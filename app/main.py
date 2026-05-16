from fastapi import FastAPI
from app.database import engine, Base
from app.models import User, Movie, Review

Base.metadata.create_all(bind=engine)

app = FastAPI(title="FilmLog API", version="1.0.0")

@app.get("/health")
def health_check():
    return {"status": "ok", "version": "1.0.0"}