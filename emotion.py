from huggingface_hub import login
from transformers import pipeline

# Log in to Hugging Face using your token
login(token="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")

# Load the sentiment analysis pipeline with EmoRoBERTa
emotion_pipeline = pipeline("sentiment-analysis", model="arpanghoshal/EmoRoBERTa")

# Example transcription text
transcribed_text = "I feel happy and excited today!"

# Get sentiment predictions
emotion_result = emotion_pipeline(transcribed_text)

# Print the result
print(emotion_result)
