def test_health(client):
    r = client.get("/health")
    assert r.status_code == 200
    assert r.json()["status"] == "ok"

def test_register(client):
    r = client.post("/auth/register", json={"email": "test@test.com", "password": "1234"})
    assert r.status_code == 201
    assert r.json()["email"] == "test@test.com"
    assert r.json()["role"] == "user"

def test_register_duplicate(client):
    client.post("/auth/register", json={"email": "dup@test.com", "password": "1234"})
    r = client.post("/auth/register", json={"email": "dup@test.com", "password": "1234"})
    assert r.status_code == 409

def test_login_success(client):
    client.post("/auth/register", json={"email": "login@test.com", "password": "1234"})
    r = client.post("/auth/login", json={"email": "login@test.com", "password": "1234"})
    assert r.status_code == 200
    assert "access_token" in r.json()

def test_login_wrong_password(client):
    client.post("/auth/register", json={"email": "wrong@test.com", "password": "1234"})
    r = client.post("/auth/login", json={"email": "wrong@test.com", "password": "wrongpass"})
    assert r.status_code == 401

def test_list_movies_public(client):
    r = client.get("/movies")
    assert r.status_code == 200
    assert "results" in r.json()

def test_create_movie_without_auth(client):
    r = client.post("/movies", json={"title": "Test", "genre": "Drama", "year": 2020})
    assert r.status_code == 401

def test_create_movie_as_admin(client):
    # Registrar y hacer login
    client.post("/auth/register", json={"email": "admin@test.com", "password": "admin123"})
    # Cambiar rol a admin directamente en la BD de tests
    from tests.conftest import TestingSession
    from app.models.user import User
    db = TestingSession()
    user = db.query(User).filter(User.email == "admin@test.com").first()
    user.role = "admin"
    db.commit()
    db.close()
    # Login y crear película
    login = client.post("/auth/login", json={"email": "admin@test.com", "password": "admin123"})
    token = login.json()["access_token"]
    r = client.post("/movies",
        json={"title": "Inception", "genre": "Sci-fi", "year": 2010, "poster_url": None},
        headers={"Authorization": f"Bearer {token}"}
    )
    assert r.status_code == 201
    assert r.json()["title"] == "Inception"

def test_duplicate_review(client):
    # Registrar usuario
    client.post("/auth/register", json={"email": "reviewer@test.com", "password": "1234"})
    # Registrar admin y crear película
    client.post("/auth/register", json={"email": "admin2@test.com", "password": "admin123"})
    from tests.conftest import TestingSession
    from app.models.user import User
    db = TestingSession()
    user = db.query(User).filter(User.email == "admin2@test.com").first()
    user.role = "admin"
    db.commit()
    db.close()
    admin_login = client.post("/auth/login", json={"email": "admin2@test.com", "password": "admin123"})
    admin_token = admin_login.json()["access_token"]
    client.post("/movies",
        json={"title": "Movie", "genre": "Drama", "year": 2020, "poster_url": None},
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    # Login usuario normal
    user_login = client.post("/auth/login", json={"email": "reviewer@test.com", "password": "1234"})
    user_token = user_login.json()["access_token"]
    # Primera reseña
    client.post("/movies/1/reviews",
        json={"score": 5, "body": "Excelente"},
        headers={"Authorization": f"Bearer {user_token}"}
    )
    # Segunda reseña — debe fallar
    r = client.post("/movies/1/reviews",
        json={"score": 3, "body": "Otra reseña"},
        headers={"Authorization": f"Bearer {user_token}"}
    )
    assert r.status_code == 409