from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import os

_db_dir = os.path.join(os.path.expanduser('~'), '.ai_sentiment_analyzer')
os.makedirs(_db_dir, exist_ok=True)
_db_path = os.path.join(_db_dir, 'sentiment_history.db').replace('\\', '/')
DATABASE_URL = f"sqlite:///{_db_path}"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class AnalysisRecord(Base):
    __tablename__ = "analysis_records"

    id = Column(Integer, primary_key=True, index=True)
    text = Column(Text, nullable=False)
    sentiment_label = Column(String(50))
    sentiment_score = Column(Float)
    emotion_label = Column(String(50))
    emotion_score = Column(Float)
    all_emotions = Column(Text)   # JSON string
    entities = Column(Text)       # JSON string
    word_count = Column(Integer)
    char_count = Column(Integer)
    created_at = Column(DateTime, default=datetime.utcnow)


def create_tables():
    Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
