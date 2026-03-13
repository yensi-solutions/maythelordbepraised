# MayTheLordBePraised.com

A multi-pastor ministry services platform with two distinct portals sharing a single API and database. Pastors manage and deliver services through the main domain; followers discover, book, and engage through a subdomain.

**Tagline:** "A place of comfort, counsel, and community."

## Portal Architecture

| Portal | URL | Port | Audience |
|--------|-----|------|----------|
| Pastor Portal | `maythelordbepraised.com` | 15780 | Pastors & Ministry Leaders |
| Follower Portal | `connect.maythelordbepraised.com` | 15781 | Congregants & Visitors |
| API | `api.maythelordbepraised.com` | 15782 | Shared FastAPI backend |

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend (x2) | React 19, Vite, TypeScript (strict), Tailwind CSS, Zustand, Axios |
| Backend | Python 3.12+, FastAPI, Pydantic v2 |
| Database | MongoDB 7 via Motor async driver |
| Auth | Keycloak (SSO, role-based access) |
| Payments | Stripe (tithes, offerings, ceremony fees) |
| File Storage | MinIO (S3-compatible, self-hosted) |
| Infrastructure | Docker Compose |

## Features (Phase 1 MVP)

- **Authentication** — Keycloak-based SSO with pastor/follower/admin roles
- **Pastor Profiles** — Public-facing profiles with bio, church, denomination, specialties
- **Service Definitions** — Pastors create bookable services (counseling, ceremonies, visits, etc.)
- **Availability Management** — Weekly availability slots with conflict detection
- **Booking Engine** — Followers book sessions with availability validation
- **Prayer Wall** — Submit prayers, pray-with-me counter, pastor responses, testimonies
- **Giving** — Stripe-powered donations (general, tithe, offering) with checkout flow

## Project Structure

```
maythelordbepraised/
├── backend/
│   ├── app/
│   │   ├── api/v1/endpoints/    # Route handlers
│   │   ├── core/                # Security, exceptions, logging
│   │   ├── db/                  # MongoDB connection & indexes
│   │   ├── models/              # Domain models & enums
│   │   ├── schemas/             # Pydantic request/response models
│   │   └── services/            # Business logic (BaseService pattern)
│   └── tests/                   # pytest-asyncio test suite
├── frontend/
│   ├── apps/
│   │   ├── pastor-portal/       # Pastor-facing React app
│   │   └── follower-portal/     # Follower-facing React app
│   └── packages/
│       └── shared/              # @mtlbp/shared — theme, API client, components, types
├── keycloak/
│   └── realm-export.json        # Pre-configured realm with roles & clients
├── docs/                        # Design spec & implementation plan
├── scripts/                     # Setup & validation scripts
├── docker-compose.yml
├── Makefile
└── .github/workflows/ci.yml
```

## Quick Start

### Prerequisites

- Docker & Docker Compose
- Node.js 20+
- Python 3.12+

### Setup

```bash
# Clone the repo
git clone git@github.com:yensi-solutions/maythelordbepraised.git
cd maythelordbepraised

# Copy environment file
cp .env.example .env

# Start all services
make dev
```

This starts 8 containers:

| Service | Port |
|---------|------|
| Pastor Portal | http://localhost:15780 |
| Follower Portal | http://localhost:15781 |
| API | http://localhost:15782 |
| MongoDB | localhost:15783 |
| Redis | localhost:15784 |
| Keycloak Admin | http://localhost:15785 |
| MinIO API | localhost:15787 |
| MinIO Console | http://localhost:15788 |

### Development Commands

```bash
make dev          # Start all services
make test         # Run backend tests
make lint         # Lint backend (ruff) + frontend (tsc)
make format       # Auto-format backend code
make clean        # Stop and remove containers + volumes
```

### Running Without Docker

```bash
# Backend
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt -r requirements-dev.txt
uvicorn app.main:app --reload --port 15782

# Frontend (from frontend/)
npm install
npm -w @mtlbp/pastor-portal run dev    # port 15780
npm -w @mtlbp/follower-portal run dev  # port 15781
```

## API Endpoints

All endpoints are prefixed with `/api/v1`.

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check |
| GET | `/ready` | Readiness check (DB ping) |
| POST | `/auth/register` | Register new user |
| GET | `/auth/me` | Get current user profile |
| GET | `/pastors/` | List public pastors |
| GET | `/pastors/me` | Get own pastor profile |
| PUT | `/pastors/me` | Update pastor profile |
| GET | `/pastors/{id}` | Get pastor by ID |
| POST | `/booking/services` | Create a service definition |
| GET | `/booking/pastors/{id}/services` | List pastor's services |
| PUT | `/booking/availability` | Set weekly availability |
| GET | `/booking/pastors/{id}/availability` | Get pastor's availability |
| POST | `/booking/bookings` | Create a booking |
| GET | `/booking/bookings/me` | List my bookings |
| PATCH | `/booking/bookings/{id}` | Update booking status |
| POST | `/prayers/` | Submit a prayer request |
| GET | `/prayers/` | List prayer requests |
| POST | `/prayers/{id}/pray` | Increment pray count |
| POST | `/prayers/{id}/respond` | Add pastor response |
| POST | `/prayers/{id}/answered` | Mark prayer as answered |
| POST | `/giving/checkout` | Create Stripe checkout |
| POST | `/giving/webhook` | Stripe webhook handler |
| GET | `/giving/me` | Get giving history |

## Design

Visual identity uses the **Warm & Welcoming** palette:

- Background: Cream `#fdf8f0`
- Primary: Brown Dark `#3d2518`, Brown Medium `#5c3d2e`
- Accent: Earth `#d4a574`, Earth Light `#e8d5b5`
- Surface: Sand `#f5ead6`, Sand Dark `#ede0cc`
- Typography: **Playfair Display** (headings) + **Inter** (body)

## Documentation

- [Design Spec](docs/2026-03-13-maythelordbepraised-design.md) — Full architecture and feature design
- [Phase 1 Implementation Plan](docs/2026-03-13-maythelordbepraised-phase1.md) — Task-by-task build plan

## License

Proprietary. All rights reserved.

---

Powered by [yensi.solutions](https://yensi.solutions)
