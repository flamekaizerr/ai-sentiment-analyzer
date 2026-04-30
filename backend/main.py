"""
FastAPI main application — AI Sentiment Analyzer backend
Endpoints:
  POST /analyze          → run all 3 ML models on input text
  GET  /history          → return all past analyses
  GET  /history/{id}     → return a single analysis
  DELETE /history/{id}   → delete a single analysis
  GET  /stats            → aggregate statistics
"""

import json
from collections import Counter
from datetime import datetime
from typing import List

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from database import create_tables, get_db, AnalysisRecord
from models import run_sentiment, run_emotion, run_ner
from schemas import (
    AnalyzeRequest, AnalyzeResponse,
    HistoryItem, StatsResponse,
    EmotionResult, EntityResult,
)

# ── App ───────────────────────────────────────────────────────────────────────
app = FastAPI(
    title="AI Sentiment Analyzer API",
    description="Full-stack ML app — sentiment, emotion & NER via HuggingFace Transformers",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # tighten in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create DB tables on startup
create_tables()


# ── Routes ────────────────────────────────────────────────────────────────────

@app.get("/")
def root():
    return {"message": "AI Sentiment Analyzer API is running 🚀", "version": "1.0.0"}


@app.get("/health")
def health():
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}


@app.post("/analyze", response_model=AnalyzeResponse)
def analyze(request: AnalyzeRequest, db: Session = Depends(get_db)):
    text = request.text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="Text cannot be empty")
    if len(text) > 2000:
        raise HTTPException(status_code=400, detail="Text must be ≤ 2000 characters")

    # Run models
    sentiment_all = run_sentiment(text)
    emotion_all   = run_emotion(text)
    entities      = run_ner(text)

    top_sentiment = sentiment_all[0]
    top_emotion   = emotion_all[0]

    word_count = len(text.split())
    char_count = len(text)

    # Persist to DB
    record = AnalysisRecord(
        text=text,
        sentiment_label=top_sentiment["label"],
        sentiment_score=top_sentiment["score"],
        emotion_label=top_emotion["label"],
        emotion_score=top_emotion["score"],
        all_emotions=json.dumps(emotion_all),
        entities=json.dumps(entities),
        word_count=word_count,
        char_count=char_count,
    )
    db.add(record)
    db.commit()

    return AnalyzeResponse(
        text=text,
        sentiment_label=top_sentiment["label"],
        sentiment_score=top_sentiment["score"],
        sentiment_all=[EmotionResult(**s) for s in sentiment_all],
        emotion_label=top_emotion["label"],
        emotion_score=top_emotion["score"],
        emotion_all=[EmotionResult(**e) for e in emotion_all],
        entities=[EntityResult(**e) for e in entities],
        word_count=word_count,
        char_count=char_count,
    )


@app.get("/history", response_model=List[HistoryItem])
def get_history(limit: int = 50, db: Session = Depends(get_db)):
    records = (
        db.query(AnalysisRecord)
        .order_by(AnalysisRecord.created_at.desc())
        .limit(limit)
        .all()
    )
    return records


@app.get("/history/{record_id}", response_model=HistoryItem)
def get_history_item(record_id: int, db: Session = Depends(get_db)):
    record = db.query(AnalysisRecord).filter(AnalysisRecord.id == record_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Record not found")
    return record


@app.delete("/history/{record_id}")
def delete_history_item(record_id: int, db: Session = Depends(get_db)):
    record = db.query(AnalysisRecord).filter(AnalysisRecord.id == record_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Record not found")
    db.delete(record)
    db.commit()
    return {"message": f"Record {record_id} deleted"}


@app.get("/stats", response_model=StatsResponse)
def get_stats(db: Session = Depends(get_db)):
    records = db.query(AnalysisRecord).all()
    total = len(records)

    if total == 0:
        return StatsResponse(
            total_analyses=0,
            avg_word_count=0.0,
            sentiment_distribution={},
            emotion_distribution={},
            most_common_sentiment="N/A",
            most_common_emotion="N/A",
        )

    avg_words = sum(r.word_count for r in records) / total
    sent_dist = dict(Counter(r.sentiment_label for r in records))
    emo_dist  = dict(Counter(r.emotion_label for r in records))

    return StatsResponse(
        total_analyses=total,
        avg_word_count=round(avg_words, 1),
        sentiment_distribution=sent_dist,
        emotion_distribution=emo_dist,
        most_common_sentiment=max(sent_dist, key=sent_dist.get),
        most_common_emotion=max(emo_dist, key=emo_dist.get),
    )
