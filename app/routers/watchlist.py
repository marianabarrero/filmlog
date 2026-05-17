from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.watchlist import Watchlist
from app.models.movie import Movie
from app.models.user import User
from app.middleware.auth import get_current_user

router = APIRouter(prefix="/watchlist", tags=["watchlist"])

@router.get("")
def get_watchlist(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    items = db.query(Watchlist).filter(Watchlist.user_id == current_user.id).all()
    result = []
    for item in items:
        movie = db.query(Movie).filter(Movie.id == item.movie_id).first()
        if movie:
            result.append({
                "watchlist_id": item.id,
                "movie_id": movie.id,
                "title": movie.title,
                "genre": movie.genre,
                "year": movie.year,
                "poster_url": movie.poster_url,
                "avg_score": movie.avg_score if hasattr(movie, 'avg_score') else None,
                "added_at": item.created_at
            })
    return result

@router.post("/{movie_id}", status_code=201)
def add_to_watchlist(movie_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not db.query(Movie).filter(Movie.id == movie_id).first():
        raise HTTPException(status_code=404, detail="Movie not found")
    exists = db.query(Watchlist).filter(
        Watchlist.user_id == current_user.id,
        Watchlist.movie_id == movie_id
    ).first()
    if exists:
        raise HTTPException(status_code=409, detail="Already in watchlist")
    item = Watchlist(user_id=current_user.id, movie_id=movie_id)
    db.add(item)
    db.commit()
    return {"detail": "Added to watchlist"}

@router.delete("/{movie_id}")
def remove_from_watchlist(movie_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    item = db.query(Watchlist).filter(
        Watchlist.user_id == current_user.id,
        Watchlist.movie_id == movie_id
    ).first()
    if not item:
        raise HTTPException(status_code=404, detail="Not in watchlist")
    db.delete(item)
    db.commit()
    return {"detail": "Removed from watchlist"}

@router.get("/check/{movie_id}")
def check_watchlist(movie_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    exists = db.query(Watchlist).filter(
        Watchlist.user_id == current_user.id,
        Watchlist.movie_id == movie_id
    ).first()
    return {"in_watchlist": exists is not None}