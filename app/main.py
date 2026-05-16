from fastapi import FastAPI
from fastapi.security import HTTPBearer
from app.database import engine, Base
from app.models import User, Movie, Review
from app.routers import auth, movies, reviews

Base.metadata.create_all(bind=engine)

security = HTTPBearer()

app = FastAPI(
    title="FilmLog API",
    version="1.0.0",
    swagger_ui_parameters={"persistAuthorization": True}
)

app.include_router(auth.router)
app.include_router(movies.router)
app.include_router(reviews.router)

@app.get("/health")
def health_check():
    return {"status": "ok", "version": "1.0.0"}