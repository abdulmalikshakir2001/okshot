import whisperx
import ffmpeg
import random
import os
import gc


# Configuration object for paths and subtitle styles
config = {
    "device": "cpu",  # Changing to CPU
    "video_file": "ai_python.mp4",  # Input video file
    "audio_file": "extracted_audio.mp3",  # Output audio file
    "output_folder": "files",  # Directory for output files
    "batch_size": 16,
    "compute_type": "int8",  # Set to int8 for lower memory usage on CPU
    "srt_file": "output.srt",  # SRT subtitle file name
    "ass_file": "output.ass",  # ASS subtitle file name
    "output_video": "output.mp4",  # Final output video with burned subtitles
    "min_words": 4,  # Minimum words per subtitle
    "max_words": 8,  # Maximum words per subtitle

    # Subtitle style for ASS file
    "font": {
        "fontname": "Arial",
        "fontsize": 20,
        "primary_color": "&H00FFFFFF",  # White text for non-highlighted words
        "highlight_color": "&H0000FF00",  # Green text for highlighted word
        "outline_color": "&H00000000",  # Black outline for both highlighted and non-highlighted
        "back_color": "&H00000000",  # No background for non-highlighted words
        "highlight_bg_color": "&H00FFC0CB",  # Pink background for highlighted word
        "bold": -1,
        "italic": 0,
        "underline": 0,
        "strike_out": 0,
        "scale_x": 100,
        "scale_y": 100,
        "spacing": 0,
        "angle": 0,
        "border_style": 1,
        "outline": 2,
        "shadow": 1,
        "alignment": 2,  # Centered text
        "margin_l": 10,
        "margin_r": 10,
        "margin_v": 10,
        "encoding": 0
    }
}

# Create the output folder if it doesn't exist
if not os.path.exists(config["output_folder"]):
    os.makedirs(config["output_folder"])

# Step 1: Extract audio from video
def extract_audio(config):
    ffmpeg.input(config["video_file"]).output(config["audio_file"]).run()

# Step 2: Load WhisperX model and transcribe audio
def transcribe_audio(config):
    model = whisperx.load_model("large-v2", config["device"], compute_type=config["compute_type"])
    audio = whisperx.load_audio(config["audio_file"])
    return model.transcribe(audio, batch_size=config["batch_size"])

# Step 3: Align the transcription
def align_transcription(result, config):
    model_a, metadata = whisperx.load_align_model(language_code=result["language"], device=config["device"])
    return whisperx.align(result["segments"], model_a, metadata, config["audio_file"], device=config["device"], return_char_alignments=False)

# Step 4: Perform speaker diarization
def diarization(result, config):
    diarize_model = whisperx.DiarizationPipeline(use_auth_token="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", device=config["device"])
    diarize_segments = diarize_model(config["audio_file"])
    return whisperx.assign_word_speakers(diarize_segments, result)

# Step 5: Generate grouped subtitles based on min and max words
def generate_subtitles_grouped(segments, config):
    grouped_segments = []
    for segment in segments:
        words = segment["words"]
        index = 0

        while index < len(words):
            group_size = random.randint(config["min_words"], config["max_words"])
            group = words[index:index + group_size]

            # Filter out words without 'start' and 'end' keys
            valid_group = [word for word in group if 'start' in word and 'end' in word]

            # Ensure there's at least one valid word with start and end time
            if not valid_group:
                index += group_size
                continue
            start_time = valid_group[0]['start']
            end_time = valid_group[-1]['end']
            text = ' '.join([word['word'] for word in group])
            grouped_segments.append({
                "start": start_time,
                "end": end_time,
                "text": text,
                "words": group
            })
            index += group_size

    return grouped_segments

# Step 6: Generate the ASS file with highlighted background for the current word
def generate_ass_highlighted(grouped_segments, config):
    ass_file_path = os.path.join(config["output_folder"], config["ass_file"])
    with open(ass_file_path, 'w', encoding='utf-8') as ass_file:
        # Basic header for ASS file
        ass_file.write("[Script Info]\n")
        ass_file.write("Title: AI Video Subtitles with Highlights\n")
        ass_file.write("ScriptType: v4.00+\n")
        ass_file.write("[V4+ Styles]\n")
        ass_file.write("Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding\n")
        
        # Define two styles: Default and Highlighted
        font_config = config["font"]
        ass_file.write(f"Style: Default,{font_config['fontname']},{font_config['fontsize']},{font_config['primary_color']},&H00FFFFFF,{font_config['outline_color']},{font_config['back_color']},{font_config['bold']},{font_config['italic']},{font_config['underline']},{font_config['strike_out']},{font_config['scale_x']},{font_config['scale_y']},{font_config['spacing']},{font_config['angle']},{font_config['border_style']},{font_config['outline']},{font_config['shadow']},{font_config['alignment']},{font_config['margin_l']},{font_config['margin_r']},{font_config['margin_v']},{font_config['encoding']}\n")
        ass_file.write(f"Style: Highlighted,{font_config['fontname']},{font_config['fontsize']},{font_config['highlight_color']},&H00FFFFFF,{font_config['outline_color']},{font_config['highlight_bg_color']},{font_config['bold']},{font_config['italic']},{font_config['underline']},{font_config['strike_out']},{font_config['scale_x']},{font_config['scale_y']},{font_config['spacing']},{font_config['angle']},{font_config['border_style']},{font_config['outline']},{font_config['shadow']},{font_config['alignment']},{font_config['margin_l']},{font_config['margin_r']},{font_config['margin_v']},{font_config['encoding']}\n")
        
        ass_file.write("[Events]\n")
        ass_file.write("Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text\n")

        # Process each subtitle segment
        for segment in grouped_segments:
            words = segment["words"]
            for i, word in enumerate(words):
                # Check if 'start' and 'end' keys exist
                if 'start' not in word or 'end' not in word:
                    continue

                start_time = word['start']
                end_time = word['end']

                # Highlight the current word with background
                highlighted_text = ''
                for j, w in enumerate(words):
                    if 'start' in w and 'end' in w:
                        if j == i:
                            # Apply highlight to the entire word with pink background and green text
                            highlighted_text += f"{{\\rHighlighted}}{w['word']} "
                        else:
                            # Apply default style for the rest of the words in the group (white text)
                            highlighted_text += f"{{\\rDefault}}{w['word']} "

                # Convert start and end time to ASS time format (h:mm:ss.xx)
                start_ass_time = f"{int(start_time // 3600)}:{int((start_time % 3600) // 60)}:{start_time % 60:.2f}".replace('.', ',')
                end_ass_time = f"{int(end_time // 3600)}:{int((end_time % 3600) // 60)}:{end_time % 60:.2f}".replace('.', ',')

                # Write the event line for ASS
                ass_file.write(f"Dialogue: 0,{start_ass_time},{end_ass_time},Default,,0,0,0,,{highlighted_text}\n")
        
        print(f"ASS file generated with background highlight: {ass_file_path}")

# Step 7: Generate SRT file
def generate_srt_file(grouped_segments, config):
    srt_file_path = os.path.join(config["output_folder"], config["srt_file"])
    with open(srt_file_path, 'w', encoding='utf-8') as srt_file:
        for index, segment in enumerate(grouped_segments, start=1):
            start_time = segment['start']
            end_time = segment['end']

            # Convert to SRT time format: 00:00:00,000
            start_srt_time = f"{int(start_time // 3600):02}:{int((start_time % 3600) // 60):02}:{start_time % 60:.3f}".replace('.', ',')
            end_srt_time = f"{int(end_time // 3600):02}:{int((end_time % 3600) // 60):02}:{end_time % 60:.3f}".replace('.', ',')

            srt_file.write(f"{index}\n{start_srt_time} --> {end_srt_time}\n{segment['text']}\n\n")
        
        print(f"SRT file generated: {srt_file_path}")

# Step 8: Burn the ASS subtitles into the video
def burn_subtitles(config):
    video_input_path = config["video_file"]
    ass_file_path = os.path.join(config["output_folder"], config["ass_file"])
    output_video_path = os.path.join(config["output_folder"], config["output_video"])

    # Use ffmpeg to burn the subtitles into the video
    ffmpeg.input(video_input_path).output(output_video_path, vf=f"subtitles={ass_file_path}").run()
    print(f"Video with subtitles burned saved as: {output_video_path}")

# Execution steps
extract_audio(config)
result = transcribe_audio(config)
aligned_result = align_transcription(result, config)
diarized_result = diarization(aligned_result, config)
print('==========================================================================================>>')
print(diarized_result)
print('==========================================================================================>>')


# Group subtitles by min/max word count and ensure continuous display
grouped_segments = generate_subtitles_grouped(diarized_result["segments"], config)

# Generate ASS file with highlighted words
generate_ass_highlighted(grouped_segments, config)

# Generate SRT file
generate_srt_file(grouped_segments, config)

# Burn subtitles to the video
burn_subtitles(config)

# Optional: Cleanup
gc.collect()