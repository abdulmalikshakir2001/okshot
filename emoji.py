import whisperx
import ffmpeg
import random
import os
import gc
import torch
from transformers import pipeline  # EmoRoBERTa model for emotion detection

# Load EmoRoBERTa pipeline for emotion detection
emotion_model = pipeline("text-classification", model="arpanghoshal/EmoRoBERTa", return_all_scores=True)

# Configuration object for paths and subtitle styles
config = {
    "device": "cpu",
    "video_file": "ai_python.mp4",  # Input video file
    "audio_file": "audio.mp3",  # Extracted audio file
    "output_folder": "files",  # Directory for output files
    "batch_size": 16,
    "compute_type": "int8",  # Set to int8 for lower memory usage
    "srt_file": "output.srt",  # SRT subtitle file name
    "ass_file": "output.ass",  # ASS subtitle file name
    "output_video": "output.mp4",  # Final output video with burned subtitles and overlays
    "emoji": True,  # Option to enable or disable emoji overlay
    "emoji_position": {"x": "(W-w)/2", "y": "(H-h)/2"},  # Default emoji position at center
    "min_words": 4,  # Minimum words per subtitle
    "max_words": 8,  # Maximum words per subtitle
    "image_folder": "file_gallary",  # Path for emotion PNG images
    "image_size": 70,  # Size of PNG image to overlay
    "font": {
        "fontname": "Arial",
        "fontsize": 20,
        "primary_color": "&H00FFFFFF",  # White text
        "highlight_color": "&H0000FF00",  # Green text for highlighted word
        "outline_color": "&H00000000",  # Black outline
        "back_color": "&H00000000",  # No background
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
    },
    "background_music": True,  # Option to enable or disable background music
    "music_volume": 1.0,  # Volume control for background music
    "music_file": "file_music/one.mp3",  # Background music file
}

# Create the output folder if it doesn't exist
if not os.path.exists(config["output_folder"]):
    os.makedirs(config["output_folder"])
# Step 1: Extract audio from video
def extract_audio(config):
    # Create the output folder if it doesn't exist
    if not os.path.exists(config["output_folder"]):
        os.makedirs(config["output_folder"])
        print(f"Created directory: {config['output_folder']}")
    # Ensure the audio file is saved in the correct directory
    audio_file_path = os.path.join(config["output_folder"], config["audio_file"])

    # Use ffmpeg to extract the audio and save it to the specified path
    ffmpeg.input(config["video_file"]).output(audio_file_path).run()

    print(f"Audio extracted and saved at: {audio_file_path}")
    return audio_file_path

# Step 2: Load WhisperX model and transcribe audio
def transcribe_audio(config):
    model = whisperx.load_model("large-v2", config["device"], compute_type=config["compute_type"])
    audio = whisperx.load_audio(os.path.join(config["output_folder"], config["audio_file"])
)
    return model.transcribe(audio, batch_size=config["batch_size"])

# Step 3: Align the transcription
def align_transcription(result, config):
    model_a, metadata = whisperx.load_align_model(language_code=result["language"], device=config["device"])
    return whisperx.align(result["segments"], model_a, metadata, os.path.join(config["output_folder"], config["audio_file"])
, device=config["device"], return_char_alignments=False)

# Step 4: Perform speaker diarization
def diarization(result, config):
    diarize_model = whisperx.DiarizationPipeline(use_auth_token="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", device=config["device"])
    diarize_segments = diarize_model(os.path.join(config["output_folder"], config["audio_file"]))
    return whisperx.assign_word_speakers(diarize_segments, result)

# Step 5: Detect emotion using EmoRoBERTa model
def detect_emotion(text):
    result = emotion_model(text)
    emotion = max(result[0], key=lambda x: x['score'])['label'].lower()
    return emotion

# Step 6: Generate grouped subtitles with emotions
def generate_subtitles_with_emotions(segments, config):
    grouped_segments = []
    for segment in segments:
        words = segment["words"]
        index = 0

        while index < len(words):
            group_size = random.randint(config["min_words"], config["max_words"])
            group = words[index:index + group_size]
            valid_group = [word for word in group if 'start' in word and 'end' in word]

            if not valid_group:
                index += group_size
                continue

            start_time = valid_group[0]['start']
            end_time = valid_group[-1]['end']
            text = ' '.join([word['word'] for word in group])

            # Detect emotion for this group
            emotion = detect_emotion(text) if config['emoji'] else None
            
            grouped_segments.append({
                "start": start_time,
                "end": end_time,
                "text": text,
                "emotion": emotion,  # Store detected emotion only if emoji option is enabled
                "words": group
            })
            index += group_size

    return grouped_segments

# Step 7: Generate ASS subtitle file
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
                if 'start' not in word or 'end' not in word:
                    continue

                start_time = word['start']
                end_time = word['end']

                # Highlight the current word with background
                highlighted_text = ''
                for j, w in enumerate(words):
                    if 'start' in w and 'end' in w:
                        if j == i:
                            highlighted_text += f"{{\\rHighlighted}}{w['word']} "
                        else:
                            highlighted_text += f"{{\\rDefault}}{w['word']} "

                # Convert start and end time to ASS time format
                start_ass_time = f"{int(start_time // 3600)}:{int((start_time % 3600) // 60)}:{start_time % 60:.2f}".replace('.', ',')
                end_ass_time = f"{int(end_time // 3600)}:{int((end_time % 3600) // 60)}:{end_time % 60:.2f}".replace('.', ',')

                # Write the event line for ASS
                ass_file.write(f"Dialogue: 0,{start_ass_time},{end_ass_time},Default,,0,0,0,,{highlighted_text}\n")
        
        print(f"ASS file generated with background highlight: {ass_file_path}")

# Step 8: Generate SRT file
def generate_srt_file(grouped_segments, config):
    srt_file_path = os.path.join(config["output_folder"], config["srt_file"])
    with open(srt_file_path, 'w', encoding='utf-8') as srt_file:
        for index, segment in enumerate(grouped_segments, start=1):
            start_time = segment['start']
            end_time = segment['end']

            # Convert to SRT time format
            start_srt_time = f"{int(start_time // 3600):02}:{int((start_time % 3600) // 60):02}:{start_time % 60:.3f}".replace('.', ',')
            end_srt_time = f"{int(end_time // 3600):02}:{int((end_time % 3600) // 60):02}:{end_time % 60:.3f}".replace('.', ',')

            srt_file.write(f"{index}\n{start_srt_time} --> {end_srt_time}\n{segment['text']}\n\n")
        
        print(f"SRT file generated: {srt_file_path}")

# Step 9: Burn subtitles into the video
def burn_subtitles(config):
    video_input_path = config["video_file"]
    ass_file_path = os.path.join(config["output_folder"], config["ass_file"])
    output_subtitled_video = os.path.join(config["output_folder"], config["output_video"])

    # Use ffmpeg to burn the subtitles into the video
    ffmpeg.input(video_input_path).output(output_subtitled_video, vf=f"subtitles={ass_file_path}").run()
    print(f"Video with subtitles burned saved as: {output_subtitled_video}")

    return output_subtitled_video

# Step 10: Overlay emotion images on the subtitled video if emoji option is enabled
def overlay_emotion_images_on_subtitled_video(grouped_segments, config, subtitled_video):
    if not config.get("emoji"):
        print("Emoji overlay is disabled. Skipping emoji overlay.")
        return subtitled_video

    output_video_path = os.path.join(config["output_folder"], config["output_video"])
    temp_output_path = os.path.join(config["output_folder"], "temp_output.mp4")  # Temporary output file

    # Start building the filter_complex graph for ffmpeg using the subtitled video
    video_stream = ffmpeg.input(subtitled_video)
    current_stream = video_stream
    input_streams = [video_stream]

    # Add each emotion PNG as an overlay at its corresponding time
    for index, segment in enumerate(grouped_segments):
        emotion = segment['emotion']
        start_time = segment['start']
        end_time = segment['end']

        # Determine the PNG file path for the detected emotion
        png_file = os.path.join(config["image_folder"], f"{emotion}.png")

        if os.path.exists(png_file):
            # Load the image file as another input stream
            image_stream = ffmpeg.input(png_file, loop=1, t=end_time - start_time, s=f"{config['image_size']}x{config['image_size']}")
            input_streams.append(image_stream)

            # Apply the overlay filter sequentially
            # Emoji will be centered by default, but the position can be controlled via config
            emoji_x = config.get("emoji_position", {}).get("x", "(W-w)/2")
            emoji_y = config.get("emoji_position", {}).get("y", "(H-h)/2")

            current_stream = ffmpeg.overlay(current_stream, image_stream, x=emoji_x, y=emoji_y, enable=f"between(t,{start_time},{end_time})")

    # Apply the final overlay to the subtitled video and save to the temporary path
    current_stream.output(temp_output_path).run()

    print(f"Temporary video with emotion PNG overlays saved as: {temp_output_path}")

    # Check if the final output file already exists, and if so, delete it
    if os.path.exists(output_video_path):
        os.remove(output_video_path)
        print(f"Existing file '{output_video_path}' deleted.")

    # Rename the temporary output to the final output path
    os.rename(temp_output_path, output_video_path)
    print(f"Temporary file renamed to final output: {output_video_path}")

    return output_video_path

# Step 11: Add background music or retain original audio
def add_background_music(subtitled_video, config):
    video_input = ffmpeg.input(subtitled_video)
    audio_input = ffmpeg.input(os.path.join(config["output_folder"], config["audio_file"])
)

    temp_output_path = os.path.join(config["output_folder"], "temp_output.mp4")  # Temporary output file
    output_final = os.path.join(config["output_folder"], config["output_video"])  # Final output path

    # Check if background music is enabled
    if config["background_music"]:
        background_music = config["music_file"]

        # Get video and background music duration
        video_duration = float(ffmpeg.probe(subtitled_video)['format']['duration'])
        music_duration = float(ffmpeg.probe(background_music)['format']['duration'])

        if music_duration < video_duration:
            # Loop the background music if it's shorter than the video
            looped_music = ffmpeg.input(background_music, stream_loop=-1, t=video_duration)
            merged_audio = ffmpeg.filter([audio_input, looped_music], 'amix', duration='longest', dropout_transition=2)
        else:
            # Trim the background music if it's longer than the video
            trimmed_music = ffmpeg.input(background_music, t=video_duration)
            merged_audio = ffmpeg.filter([audio_input, trimmed_music], 'amix', duration='longest', dropout_transition=2)

        # Save to the temporary output file
        ffmpeg.output(video_input['v'], merged_audio, temp_output_path).run()

        print(f"Temporary video with background music saved as: {temp_output_path}")
    else:
        # If background music is disabled, only use the original audio
        ffmpeg.output(video_input['v'], audio_input['a'], temp_output_path).run()

        print(f"Temporary video with original audio saved as: {temp_output_path}")

    # Check if the final output file already exists, and if so, delete it
    if os.path.exists(output_final):
        os.remove(output_final)
        print(f"Existing file '{output_final}' deleted.")

    # Rename the temporary output to the final output path
    os.rename(temp_output_path, output_final)
    print(f"Temporary file renamed to final output: {output_final}")

    return output_final


# Execution Steps

# 1. Extract Audio
extract_audio(config)

# 2. Transcribe Audio
result = transcribe_audio(config)

# 3. Align Transcription
aligned_result = align_transcription(result, config)

# 4. Perform Diarization
diarized_result = diarization(aligned_result, config)

# 5. Group subtitles by min/max word count and add emotion detection
grouped_segments = generate_subtitles_with_emotions(diarized_result["segments"], config)

# 6. Generate ASS file with highlighted words
generate_ass_highlighted(grouped_segments, config)

# 7. Generate SRT file
generate_srt_file(grouped_segments, config)

# 8. Burn subtitles into the video
subtitled_video = burn_subtitles(config)

# 9. Overlay emotion PNGs on top of the subtitled video, if enabled
final_output = overlay_emotion_images_on_subtitled_video(grouped_segments, config, subtitled_video)

# 10. Add background music or retain original audio
final_output_with_music_or_audio = add_background_music(final_output, config)

# Optional: Cleanup
gc.collect()
