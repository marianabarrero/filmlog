from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer
from app.database import engine, Base
from app.models import User, Movie, Review, Watchlist
from app.routers import auth, movies, reviews, watchlist

Base.metadata.create_all(bind=engine)

security = HTTPBearer()

app = FastAPI(
    title="FilmLog API",
    version="1.0.0",
    swagger_ui_parameters={"persistAuthorization": True}
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://3.151.171.97:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(movies.router)
app.include_router(reviews.router)
app.include_router(watchlist.router)

@app.get("/health")
def health_check():
    return {"status": "ok", "version": "1.0.0"}