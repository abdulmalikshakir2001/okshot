import os
import torch
from diffusers import StableDiffusionPipeline
import json
import sys

def generate_image(config):
    # Load the model and set to CUDA
    pipe = StableDiffusionPipeline.from_pretrained(
        "runwayml/stable-diffusion-v1-5", torch_dtype=torch.float16
    )
    pipe = pipe.to("cuda")

    # Ensure output folder exists
    if not os.path.exists(config["path"]):
        os.makedirs(config["path"])

    # Generate the image based on the prompt
    prompt = config["prompt"]
    image = pipe(prompt).images[0]

    # Construct the image file path and save
    image_file_path = os.path.join(config["path"], 'ai_image.png')
    image.save(image_file_path)

    print(f"Image saved at: {image_file_path}")
    return image_file_path


def main():
    # Load the config passed from the command line as JSON
    config = json.loads(sys.argv[1])
    
    # Call the function to generate and save the image
    generate_image(config)


if __name__ == "__main__":
    main()








