from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.review import Review
from app.models.movie import Movie
from app.models.user import User
from app.middleware.auth import get_current_user
from pydantic import BaseModel

router = APIRouter(tags=["reviews"])

class ReviewCreate(BaseModel):
    score: int
    body: str

@router.get("/movies/{movie_id}/reviews")
def list_reviews(movie_id: int, db: Session = Depends(get_db)):
    if not db.query(Movie).filter(Movie.id == movie_id).first():
        raise HTTPException(status_code=404, detail="Película no encontrada")
    reviews = db.query(Review).filter(Review.movie_id == movie_id).all()
    return [
        {
            "id": r.id,
            "score": r.score,
            "body": r.body,
            "user_id": r.user_id,
            "created_at": r.created_at
        }
        for r in reviews
    ]

@router.post("/movies/{movie_id}/reviews", status_code=201)
def create_review(
    movie_id: int,
    data: ReviewCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not db.query(Movie).filter(Movie.id == movie_id).first():
        raise HTTPException(status_code=404, detail="Película no encontrada")
    if not (1 <= data.score <= 5):
        raise HTTPException(status_code=400, detail="El score debe ser entre 1 y 5")
    exists = db.query(Review).filter(
        Review.movie_id == movie_id,
        Review.user_id == current_user.id
    ).first()
    if exists:
        raise HTTPException(status_code=409, detail="Ya escribiste una reseña para esta película")
    review = Review(
        user_id=current_user.id,
        movie_id=movie_id,
        score=data.score,
        body=data.body
    )
    db.add(review)
    db.commit()
    db.refresh(review)
    return review

@router.put("/reviews/{review_id}")
def update_review(
    review_id: int,
    data: ReviewCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    review = db.query(Review).filter(Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Reseña no encontrada")
    if review.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="No puedes editar la reseña de otro usuario")
    if not (1 <= data.score <= 5):
        raise HTTPException(status_code=400, detail="El score debe ser entre 1 y 5")
    review.score = data.score
    review.body = data.body
    db.commit()
    db.refresh(review)
    return review

@router.delete("/reviews/{review_id}")
def delete_review(
    review_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    review = db.query(Review).filter(Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Reseña no encontrada")
    if review.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="No puedes eliminar la reseña de otro usuario")
    db.delete(review)
    db.commit()
    return {"detail": "Reseña eliminada"}

@router.get("/my-reviews")
def get_my_reviews(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    reviews = db.query(Review).filter(Review.user_id == current_user.id).all()
    result = []
    for r in reviews:
        movie = db.query(Movie).filter(Movie.id == r.movie_id).first()
        result.append({
            "id": r.id,
            "movie_id": r.movie_id,
            "movie_title": movie.title if movie else "Unknown",
            "poster_url": movie.poster_url if movie else None,
            "score": r.score,
            "body": r.body,
            "created_at": r.created_at
        })
    return result