from huggingface_hub import login
from transformers import pipeline
login(token="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")
emotion_pipeline = pipeline("sentiment-analysis", model="arpanghoshal/EmoRoBERTa")
transcribed_text = "I feel happy and excited today!"
emotion_result = emotion_pipeline(transcribed_text)
print(emotion_result)
