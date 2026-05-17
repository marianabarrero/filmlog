from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models.movie import Movie
from app.models.review import Review
from app.models.user import User
from app.middleware.auth import require_admin
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/movies", tags=["movies"])

class MovieCreate(BaseModel):
    title: str
    genre: str
    year: int
    synopsis: Optional[str] = None
    poster_url: Optional[str] = None

@router.get("")
def list_movies(page: int = 1, genre: Optional[str] = None, db: Session = Depends(get_db)):
    limit = 10
    query = db.query(Movie)
    if genre:
        query = query.filter(Movie.genre.ilike(f"%{genre}%"))
    total = query.count()
    movies = query.offset((page - 1) * limit).limit(limit).all()
    result = []
    for m in movies:
        avg = db.query(func.avg(Review.score)).filter(Review.movie_id == m.id).scalar()
        result.append({
            "id": m.id,
            "title": m.title,
            "genre": m.genre,
            "year": m.year,
            "synopsis": m.synopsis,
            "poster_url": m.poster_url,
            "avg_score": round(float(avg), 2) if avg else None
        })
    return {"total": total, "page": page, "results": result}

@router.get("/{movie_id}")
def get_movie(movie_id: int, db: Session = Depends(get_db)):
    movie = db.query(Movie).filter(Movie.id == movie_id).first()
    if not movie:
        raise HTTPException(status_code=404, detail="Película no encontrada")
    avg = db.query(func.avg(Review.score)).filter(Review.movie_id == movie_id).scalar()
    return {
        "id": movie.id,
        "title": movie.title,
        "genre": movie.genre,
        "year": movie.year,
        "synopsis": movie.synopsis,
        "poster_url": movie.poster_url,
        "avg_score": round(float(avg), 2) if avg else None
    }

@router.post("", status_code=201)
def create_movie(data: MovieCreate, db: Session = Depends(get_db), admin: User = Depends(require_admin)):
    movie = Movie(**data.model_dump())
    db.add(movie)
    db.commit()
    db.refresh(movie)
    return movie


@router.put("/{movie_id}")
def update_movie(movie_id: int, data: MovieCreate, db: Session = Depends(get_db), admin: User = Depends(require_admin)):
    movie = db.query(Movie).filter(Movie.id == movie_id).first()
    if not movie:
        raise HTTPException(status_code=404, detail="Película no encontrada")
    for key, value in data.model_dump().items():
        setattr(movie, key, value)
    db.commit()
    db.refresh(movie)
    return movie

@router.delete("/{movie_id}")
def delete_movie(movie_id: int, db: Session = Depends(get_db), admin: User = Depends(require_admin)):
    movie = db.query(Movie).filter(Movie.id == movie_id).first()
    if not movie:
        raise HTTPException(status_code=404, detail="Película no encontrada")
    if db.query(Review).filter(Review.movie_id == movie_id).count() > 0:
        raise HTTPException(status_code=409, detail="No se puede eliminar una película con reseñas")
    db.delete(movie)
    db.commit()
    return {"detail": "Película eliminada"}