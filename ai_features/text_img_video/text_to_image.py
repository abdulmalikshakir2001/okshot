# import torch
# from diffusers import StableDiffusionPipeline
# pipe = StableDiffusionPipeline.from_pretrained("runwayml/stable-diffusion-v1-5", torch_dtype=torch.float16)
# pipe = pipe.to("cuda")

# prompt = "ant having feathers of  hen with that  feathers ant flying on city"
# image = pipe(prompt).images[0]
# image.save("ai_image.png")




import torch

from diffusers import StableVideoDiffusionPipeline
from diffusers.utils import load_image, export_to_video

pipe = StableVideoDiffusionPipeline.from_pretrained(
    "stabilityai/stable-video-diffusion-img2vid-xt", torch_dtype=torch.float16, variant="fp16"
)
pipe.enable_model_cpu_offload()

# Load the conditioning image
image = load_image("https://huggingface.co/datasets/huggingface/documentation-images/resolve/main/diffusers/svd/rocket.png")
image = image.resize((1024, 576))

generator = torch.manual_seed(42)
frames = pipe(image, decode_chunk_size=8, generator=generator).frames[0]

export_to_video(frames, "generated.mp4", fps=7)








# video file from text
# import torch
# print(torch.cuda.is_available())
# from diffusers import CogVideoXPipeline
# from diffusers.utils import export_to_video

# prompt = "laptop flying with feathers like bird on the  surface of the ocean"

# pipe = CogVideoXPipeline.from_pretrained(
#     "THUDM/CogVideoX-2b",
#     torch_dtype=torch.float16
# )

# pipe.enable_model_cpu_offload()
# pipe.enable_sequential_cpu_offload()
# pipe.vae.enable_slicing()
# pipe.vae.enable_tiling()
# video = pipe(
#     prompt=prompt,
#     num_videos_per_prompt=1,
#     num_inference_steps=50,
#     num_frames=49,
#     guidance_scale=6,
#     generator=torch.Generator(device="cuda").manual_seed(42),
# ).frames[0]

# export_to_video(video, "output.mp4", fps=8)



