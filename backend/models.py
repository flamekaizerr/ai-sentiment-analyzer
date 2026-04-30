"""
ML model loader — loads three HuggingFace Transformer pipelines:
  1. Sentiment analysis  (cardiffnlp/twitter-roberta-base-sentiment-latest)
  2. Emotion detection   (j-hartmann/emotion-english-distilroberta-base)
  3. Named entity recog  (dslim/bert-base-NER)

Models are loaded once at startup and reused for all requests.
"""

from transformers import pipeline
import torch

# Use CPU by default; change to "cuda" if you have a GPU
DEVICE = 0 if torch.cuda.is_available() else -1

print("[*] Loading HuggingFace models... (first run downloads ~600 MB, subsequent runs are instant)")

sentiment_pipeline = pipeline(
    "sentiment-analysis",
    model="cardiffnlp/twitter-roberta-base-sentiment-latest",
    top_k=None,
    device=DEVICE,
)
print("[OK] Sentiment model loaded")

emotion_pipeline = pipeline(
    "text-classification",
    model="j-hartmann/emotion-english-distilroberta-base",
    top_k=None,
    device=DEVICE,
)
print("[OK] Emotion model loaded")

ner_pipeline = pipeline(
    "ner",
    model="dslim/bert-base-NER",
    aggregation_strategy="simple",
    device=DEVICE,
)
print("[OK] NER model loaded")
print("[READY] All models ready!\n")


def run_sentiment(text: str):
    results = sentiment_pipeline(text[:512])[0]
    # Normalise label names
    label_map = {"LABEL_0": "negative", "LABEL_1": "neutral", "LABEL_2": "positive",
                 "negative": "negative", "neutral": "neutral", "positive": "positive"}
    normalised = [{"label": label_map.get(r["label"].lower(), r["label"].lower()),
                   "score": round(r["score"], 4)} for r in results]
    normalised.sort(key=lambda x: x["score"], reverse=True)
    return normalised


def run_emotion(text: str):
    results = emotion_pipeline(text[:512])[0]
    normalised = [{"label": r["label"].lower(), "score": round(r["score"], 4)} for r in results]
    normalised.sort(key=lambda x: x["score"], reverse=True)
    return normalised


def run_ner(text: str):
    results = ner_pipeline(text[:512])
    return [
        {
            "word": r["word"],
            "entity_group": r["entity_group"],
            "score": round(float(r["score"]), 4),
            "start": int(r["start"]),
            "end": int(r["end"]),
        }
        for r in results
    ]
