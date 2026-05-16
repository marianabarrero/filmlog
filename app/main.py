from fastapi import FastAPI
from app.database import engine, Base
from app.models import User, Movie, Review
from app.routers import auth

Base.metadata.create_all(bind=engine)

app = FastAPI(title="FilmLog API", version="1.0.0")

app.include_router(auth.router)

@app.get("/health")
def health_check():
    return {"status": "ok", "version": "1.0.0"}