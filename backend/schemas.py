from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional


class AnalyzeRequest(BaseModel):
    text: str


class EmotionResult(BaseModel):
    label: str
    score: float


class EntityResult(BaseModel):
    word: str
    entity_group: str
    score: float
    start: int
    end: int


class AnalyzeResponse(BaseModel):
    text: str
    sentiment_label: str
    sentiment_score: float
    sentiment_all: List[EmotionResult]
    emotion_label: str
    emotion_score: float
    emotion_all: List[EmotionResult]
    entities: List[EntityResult]
    word_count: int
    char_count: int


class HistoryItem(BaseModel):
    id: int
    text: str
    sentiment_label: str
    sentiment_score: float
    emotion_label: str
    emotion_score: float
    word_count: int
    char_count: int
    created_at: datetime

    class Config:
        from_attributes = True


class StatsResponse(BaseModel):
    total_analyses: int
    avg_word_count: float
    sentiment_distribution: dict
    emotion_distribution: dict
    most_common_sentiment: str
    most_common_emotion: str
