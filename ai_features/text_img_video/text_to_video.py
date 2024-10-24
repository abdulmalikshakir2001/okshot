import os
import torch
import json
import sys
from diffusers import CogVideoXPipeline
from diffusers.utils import export_to_video

def generate_video(config):
    # Load the CogVideoX model pipeline
    pipe = CogVideoXPipeline.from_pretrained(
        "THUDM/CogVideoX-2b",
        torch_dtype=torch.float16
    )

    # Enable model offloading to CPU for better memory management
    pipe.enable_model_cpu_offload()
    pipe.enable_sequential_cpu_offload()
    pipe.vae.enable_slicing()
    pipe.vae.enable_tiling()

    # Ensure output folder exists
    if not os.path.exists(config["path"]):
        os.makedirs(config["path"])

    # Generate the video based on the prompt
    prompt = config["prompt"]
    video = pipe(
        prompt=prompt,
        num_videos_per_prompt=1,
        num_inference_steps=50,
        num_frames=49,
        guidance_scale=6,
        generator=torch.Generator(device="cuda").manual_seed(42),
    ).frames[0]

    # Construct the video file path and save
    video_file_path = os.path.join(config["path"], 'ai_video.mp4')
    export_to_video(video, video_file_path, fps=8)

    print(f"Video saved at: {video_file_path}")
    return video_file_path

def main():
    # Load the config passed from the command line as JSON
    config = json.loads(sys.argv[1])
    
    # Call the function to generate and save the video
    generate_video(config)

if __name__ == "__main__":
    main()
