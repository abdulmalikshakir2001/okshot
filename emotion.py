# from huggingface_hub import login
# from transformers import pipeline
# login(token="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")
# emotion_pipeline = pipeline("sentiment-analysis", model="arpanghoshal/EmoRoBERTa")
# transcribed_text = "I feel happy and excited today!"
# emotion_result = emotion_pipeline(transcribed_text)
# print(emotion_result)


from transformers import pipeline

# Load zero-shot classification pipeline
classifier = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")

# Video transcript (can be very long)
video_transcript = """
The new smartphone release offers a sleek design and impressive performance, but there are a few downsides worth noting. The display is vibrant and sharp, making media consumption enjoyable, and the camera delivers clear, detailed shots even in low light. However, the battery life falls short, barely lasting a full day with moderate use. The software interface is smooth, but occasional lag can be frustrating. For the price, it offers solid features, but there are better options if you're seeking longer battery life or more polished software performance. Overall, it's a decent phone with room for improvement.
"""

# Define a wide range of candidate labels, with "How-to" and "Edutainment" removed
candidate_labels = [
    "Educational", "Entertainment", "Promotional", "News", "Documentary", 
    "Tutorial", "Vlog", "Review", "Comedy", 
    "Fitness", "Lifestyle", "Travel", "Motivational"
]

# Perform zero-shot classification
result = classifier(video_transcript, candidate_labels)

# Find the best matching label with the highest score
best_label = result['labels'][0]
best_score = result['scores'][0]

# Output the best match
print(f"The content best matches the category: {best_label} with a confidence of {best_score:.2f}")
