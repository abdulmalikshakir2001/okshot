import os
import torch
from diffusers import StableVideoDiffusionPipeline
from diffusers.utils import load_image, export_to_video
import json
import sys

def generate_video(config):
    # Load the pipeline
    pipe = StableVideoDiffusionPipeline.from_pretrained(
        "stabilityai/stable-video-diffusion-img2vid-xt", torch_dtype=torch.float16, variant="fp16"
    )
    pipe.enable_model_cpu_offload()

    # Load the conditioning image from the input path in config
    image_path = config["inputFilePath"]
    image = load_image(image_path)
    image = image.resize((1024, 576))

    # Set a seed for reproducibility
    generator = torch.manual_seed(42)

    # Generate frames using the pipeline
    frames = pipe(image, decode_chunk_size=8, generator=generator).frames[0]

    # Ensure output folder exists
    output_dir = config["outputPath"]
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    # Save the generated video to the output path
    output_video_path = os.path.join(output_dir, 'ai_img_to_video.mp4')
    export_to_video(frames, output_video_path, fps=7)

    print(f"Video saved at: {output_video_path}")
    return output_video_path


def main():
    # Load the config passed from the command line as JSON
    config = json.loads(sys.argv[1])

    # Call the function to generate and save the video
    generate_video(config)


if __name__ == "__main__":
    main()






# import torch

# from diffusers import StableVideoDiffusionPipeline
# from diffusers.utils import load_image, export_to_video

# pipe = StableVideoDiffusionPipeline.from_pretrained(
#     "stabilityai/stable-video-diffusion-img2vid-xt", torch_dtype=torch.float16, variant="fp16"
# )
# pipe.enable_model_cpu_offload()

# # Load the conditioning image
# image = load_image("https://huggingface.co/datasets/huggingface/documentation-images/resolve/main/diffusers/svd/rocket.png")
# image = image.resize((1024, 576))

# generator = torch.manual_seed(42)
# frames = pipe(image, decode_chunk_size=8, generator=generator).frames[0]

# export_to_video(frames, "ai_img_to_video.mp4", fps=7)





