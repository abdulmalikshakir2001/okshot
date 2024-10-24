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



