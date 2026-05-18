# MovieVerse

A community-powered film catalog where users discover movies, write reviews, and build their personal watchlist.

Built with **FastAPI**, **PostgreSQL**, **React 18**, and deployed on **AWS**.

**Live demo:** http://3.151.171.97

---

## User Story

As a movie enthusiast, I want a platform where I can discover films, read what the community thinks, and keep track of movies I want to watch.

**As a visitor**, I can browse the film catalog, filter by genre, and read reviews without needing an account.

**As a registered user**, I can write reviews with a score, edit or delete my own reviews, save films to my watchlist, and view all my reviews in one place.

**As an admin**, I can add new films to the catalog with a poster image, edit film details, and delete films that have no reviews.

---

## Features

- Full CRUD on movies (admin) and reviews (users)
- JWT authentication with registration and login
- Username-based profiles
- Personal watchlist per user
- My Reviews page — see all your reviews in one place
- Genre filtering and search
- Poster images stored on AWS S3
- Responsive design — works on mobile and desktop
- Public routes (catalog, reviews) and protected routes (write review, watchlist)

---

## Business Rules

1. A user can only write **one review per film**
2. A film **cannot be deleted** if it already has reviews — returns `409 Conflict`
3. Users can only **edit or delete their own** reviews — returns `403 Forbidden` otherwise
4. Only **admins** can add, edit or delete films from the catalog — returns `403 Forbidden` otherwise

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Python 3.11, FastAPI, SQLAlchemy |
| Database | PostgreSQL (Amazon RDS) |
| Authentication | JWT (python-jose + passlib + bcrypt) |
| Frontend | React 18, React Router v6 |
| Image Storage | AWS S3 |
| Web Server | nginx (port 80 — serves React frontend) |
| App Server | uvicorn inside Docker (port 8000 — serves FastAPI) |
| Infrastructure | AWS EC2 + RDS + S3 |
| CI/CD | GitHub Actions |
| Containerization | Docker + docker-compose |

---

## Project Structure

filmlog/
├── app/
│   ├── routers/         # HTTP endpoints (auth, movies, reviews, watchlist)
│   ├── services/        # Business logic (auth_service: hashing, JWT creation)
│   ├── models/          # SQLAlchemy models (User, Movie, Review, Watchlist)
│   ├── middleware/       # JWT authentication and role verification
│   ├── database.py      # Database connection and session management
│   └── main.py          # FastAPI app entry point + CORS configuration
├── frontend/
│   ├── src/
│   │   ├── components/  # Navbar with dropdown and auth state
│   │   ├── context/     # AuthContext — global authentication state
│   │   ├── pages/       # Home, Login, Register, MovieDetail, AdminPanel, Profile, MyReviews
│   │   └── services/    # api.js — axios instance with JWT interceptor
│   └── public/          # Static assets, SVG logo, favicon
├── tests/
│   ├── conftest.py      # Test fixtures — SQLite in-memory test database
│   └── test_main.py     # 9 integration tests
├── .github/workflows/
│   └── ci.yml           # GitHub Actions — runs tests on every push
├── Dockerfile           # Container definition for the FastAPI backend
├── docker-compose.yml   # Local development stack
├── requirements.txt     # Python dependencies
├── .env.example         # Environment variables template (safe to commit)
├── README.md            # Project documentation
└── AGENTIC.md           # AI-assisted development process documentation

---

## Architecture (AWS)

Browser / Mobile
│
▼
EC2 Instance (t3.micro)
├── nginx (port 80) ──► React build (static files)
└── Docker Container
└── FastAPI + uvicorn (port 8000 — REST API)
│
├──► Amazon RDS PostgreSQL — persistent database
└──► Amazon S3 — poster images (public read bucket)

**How the two ports work together:**
- Port **80** serves the React frontend (HTML, CSS, JS files)
- Port **8000** serves the backend REST API
- The React app sends all data requests to `http://3.151.171.97:8000`

**AWS services used:**
- **EC2 t3.micro** — virtual server running nginx + Docker (Free Tier)
- **RDS db.t3.micro** — managed PostgreSQL instance (Free Tier)
- **S3** — object storage for film poster images (public bucket with CORS)
- **Elastic IP** — static IP so the server URL never changes

---

## Local Setup

### Prerequisites

- Python 3.11+
- Node.js 18+
- PostgreSQL running locally (or use Docker — see below)
- Git

### Backend

```bash
# Clone the repository
git clone https://github.com/marianabarrero/movieverse.git
cd movieverse

# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env with your database credentials
```

Create a `.env` file with:

DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/filmlog
JWT_SECRET=your_secret_key_here
JWT_ALGORITHM=HS256
JWT_EXPIRE_MINUTES=1440

```bash
# Create the database (if using local PostgreSQL)
psql -U postgres -c "CREATE DATABASE filmlog;"

# Start the backend
uvicorn app.main:app --reload
```

> **Alternative:** If you don't have PostgreSQL installed locally, use Docker:
> ```bash
> docker run -d --name filmlog-db -e POSTGRES_PASSWORD=yourpassword -e POSTGRES_DB=filmlog -p 5432:5432 postgres:15
> ```

API docs available at: http://localhost:8000/docs

### Frontend

```bash
cd frontend
npm install
```

Create a file `frontend/.env` with:

REACT_APP_API_URL=http://localhost:8000

```bash
npm start
```

Frontend available at: http://localhost:3000

### Run with Docker

```bash
# Make sure your .env has a valid DATABASE_URL
docker-compose up --build
```

---

## Running Tests

```bash
pytest tests/ -v
```

Expected output: **9 passed**

| Test | Description |
|---|---|
| `test_health` | Health check endpoint returns 200 |
| `test_register` | User registration returns 201 |
| `test_register_duplicate` | Duplicate email returns 409 |
| `test_login_success` | Valid credentials return access token |
| `test_login_wrong_password` | Wrong password returns 401 |
| `test_list_movies_public` | Movie list is publicly accessible without auth |
| `test_create_movie_without_auth` | Unauthenticated request returns 401 |
| `test_create_movie_as_admin` | Admin can create movies successfully |
| `test_duplicate_review` | Second review on same film returns 409 |

---

## API Endpoints

### Auth (public)
| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Register new user with email, username and password |
| POST | `/auth/login` | Login and receive JWT access token |

### Movies
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/movies` | No | List movies with optional genre filter |
| GET | `/movies/:id` | No | Movie detail with average score |
| POST | `/movies` | Admin | Create movie |
| PUT | `/movies/:id` | Admin | Update movie |
| DELETE | `/movies/:id` | Admin | Delete movie (fails if has reviews) |

### Reviews
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/movies/:id/reviews` | No | List all reviews for a film |
| POST | `/movies/:id/reviews` | User | Write a review (1 per user per film) |
| PUT | `/reviews/:id` | User | Edit own review |
| DELETE | `/reviews/:id` | User | Delete own review |
| GET | `/my-reviews` | User | All reviews written by current user |

### Watchlist
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/watchlist` | User | Get my saved films |
| POST | `/watchlist/:id` | User | Save a film |
| DELETE | `/watchlist/:id` | User | Remove a film from watchlist |
| GET | `/watchlist/check/:id` | User | Check if a film is saved |

### System
| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Returns app status and version |

---

## Demo Credentials

| Role | Email | Password | Username |
|---|---|---|---|
| Admin | admin@movieverse.com | admin123 | Admin |
| User | user@movieverse.com | user123 | User |

### Promoting a user to admin

```bash
python -c "
from app.database import SessionLocal
from app.models.user import User
db = SessionLocal()
user = db.query(User).filter(User.email == 'your@email.com').first()
user.role = 'admin'
db.commit()
db.close()
print('Done')
"
```

---

## Deployment (AWS)

### Update backend

```bash
# On EC2 via AWS CloudShell
# Note: the directory on EC2 is named 'filmlog' (cloned before the repo rename)
cd filmlog
git pull origin main
sudo docker stop filmlog && sudo docker rm filmlog
sudo docker build -t filmlog-api .
sudo docker run -d --env-file .env -p 8000:8000 --name filmlog filmlog-api
```

### Update frontend

```bash
# From local machine
cd frontend && npm run build
scp -i your-key.pem -r build/. ec2-user@3.151.171.97:/home/ec2-user/build

# Then on EC2
sudo cp -r /home/ec2-user/build/* /usr/share/nginx/html/
sudo chmod -R 755 /usr/share/nginx/html/
sudo systemctl restart nginx
```



