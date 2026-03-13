# MayTheLordBePraised Phase 1 (MVP) Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the MVP two-portal pastor services platform with auth, profiles, booking, prayer wall, basic giving, and both landing pages.

**Architecture:** Modular monolith — single FastAPI backend with domain modules, two React frontends (pastor + follower) sharing a common npm workspace package, MongoDB for data, Keycloak for auth, Stripe for one-time payments. All services containerized via Docker Compose.

**Tech Stack:** Python 3.12+, FastAPI, Motor, Pydantic v2, React 19, Vite, TypeScript, Tailwind CSS, Zustand, Axios, Keycloak, Stripe, MongoDB, Redis, Docker Compose.

**Ports:** 23050 (Pastor Portal), 23051 (Follower Portal), 23052 (API), 23053 (MongoDB), 23054 (Redis), 23055 (Keycloak), 23056 (Keycloak Postgres)

---

## Chunk 1: Infrastructure & Auth Foundation

### Task 1: Project Scaffolding & Docker Compose

**Files:**
- Create: `docker-compose.yml`
- Create: `.env.example`
- Create: `.gitignore`
- Create: `backend/Dockerfile`
- Create: `backend/requirements.txt`
- Create: `backend/app/__init__.py`
- Create: `backend/app/main.py`
- Create: `backend/app/config.py`
- Create: `frontend/package.json`
- Create: `frontend/apps/pastor-portal/package.json`
- Create: `frontend/apps/pastor-portal/vite.config.ts`
- Create: `frontend/apps/pastor-portal/tsconfig.json`
- Create: `frontend/apps/pastor-portal/index.html`
- Create: `frontend/apps/pastor-portal/src/main.tsx`
- Create: `frontend/apps/pastor-portal/src/App.tsx`
- Create: `frontend/apps/pastor-portal/tailwind.config.ts`
- Create: `frontend/apps/pastor-portal/postcss.config.js`
- Create: `frontend/apps/pastor-portal/src/index.css`
- Create: `frontend/apps/follower-portal/package.json`
- Create: `frontend/apps/follower-portal/vite.config.ts`
- Create: `frontend/apps/follower-portal/tsconfig.json`
- Create: `frontend/apps/follower-portal/index.html`
- Create: `frontend/apps/follower-portal/src/main.tsx`
- Create: `frontend/apps/follower-portal/src/App.tsx`
- Create: `frontend/apps/follower-portal/tailwind.config.ts`
- Create: `frontend/apps/follower-portal/postcss.config.js`
- Create: `frontend/apps/follower-portal/src/index.css`
- Create: `frontend/packages/shared/package.json`
- Create: `frontend/packages/shared/src/index.ts`
- Create: `frontend/packages/shared/tsconfig.json`
- Create: `frontend/tsconfig.base.json`

- [ ] **Step 1: Create project root files**

`.gitignore`:
```
node_modules/
dist/
.env
__pycache__/
*.pyc
.pytest_cache/
.venv/
.DS_Store
```

`.env.example`:
```env
# MongoDB
MONGO_URI=mongodb://mongo:27017
MONGO_DB=maythelordbepraised

# Redis
REDIS_URL=redis://redis:6379

# Keycloak
KEYCLOAK_URL=http://keycloak:8080
KEYCLOAK_REALM=mtlbp
KEYCLOAK_CLIENT_ID=mtlbp-api
KEYCLOAK_CLIENT_SECRET=change-me

# Stripe
STRIPE_SECRET_KEY=sk_test_changeme
STRIPE_WEBHOOK_SECRET=whsec_changeme

# API
API_HOST=0.0.0.0
API_PORT=23052
```

- [ ] **Step 2: Create Docker Compose**

`docker-compose.yml`:
```yaml
services:
  mongo:
    image: mongo:7
    ports:
      - "23053:27017"
    volumes:
      - mongo_data:/data/db

  redis:
    image: redis:7-alpine
    ports:
      - "23054:6379"

  keycloak-db:
    image: postgres:16-alpine
    ports:
      - "23056:5432"
    environment:
      POSTGRES_DB: keycloak
      POSTGRES_USER: keycloak
      POSTGRES_PASSWORD: keycloak
    volumes:
      - keycloak_db_data:/var/lib/postgresql/data

  keycloak:
    image: quay.io/keycloak/keycloak:24.0
    ports:
      - "23055:8080"
    environment:
      KC_DB: postgres
      KC_DB_URL: jdbc:postgresql://keycloak-db:5432/keycloak
      KC_DB_USERNAME: keycloak
      KC_DB_PASSWORD: keycloak
      KEYCLOAK_ADMIN: admin
      KEYCLOAK_ADMIN_PASSWORD: admin
    command: start-dev
    depends_on:
      - keycloak-db

  api:
    build: ./backend
    ports:
      - "23052:23052"
    env_file: .env
    volumes:
      - ./backend:/app
    depends_on:
      - mongo
      - redis
      - keycloak

  pastor-portal:
    build:
      context: ./frontend
      dockerfile: apps/pastor-portal/Dockerfile
    ports:
      - "23050:23050"
    volumes:
      - ./frontend:/app
      - /app/node_modules
    depends_on:
      - api

  follower-portal:
    build:
      context: ./frontend
      dockerfile: apps/follower-portal/Dockerfile
    ports:
      - "23051:23051"
    volumes:
      - ./frontend:/app
      - /app/node_modules
    depends_on:
      - api

volumes:
  mongo_data:
  keycloak_db_data:
```

- [ ] **Step 3: Create backend scaffold**

`backend/Dockerfile`:
```dockerfile
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "23052", "--reload"]
```

`backend/requirements.txt`:
```
fastapi==0.115.0
uvicorn[standard]==0.30.0
motor==3.5.0
pydantic[email]==2.9.0
pydantic-settings==2.5.0
python-jose[cryptography]==3.3.0
httpx==0.27.0
stripe==10.0.0
redis==5.0.0
pytest==8.3.0
pytest-asyncio==0.24.0
pytest-cov==5.0.0
```

`backend/app/__init__.py`: empty file

`backend/app/config.py`:
```python
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    mongo_uri: str = "mongodb://mongo:27017"
    mongo_db: str = "maythelordbepraised"
    redis_url: str = "redis://redis:6379"
    keycloak_url: str = "http://keycloak:8080"
    keycloak_realm: str = "mtlbp"
    keycloak_client_id: str = "mtlbp-api"
    keycloak_client_secret: str = ""
    stripe_secret_key: str = ""
    stripe_webhook_secret: str = ""
    api_host: str = "0.0.0.0"
    api_port: int = 23052

    class Config:
        env_file = ".env"


settings = Settings()
```

`backend/app/main.py`:
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="MayTheLordBePraised API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:23050",
        "http://localhost:23051",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health():
    return {"status": "ok"}
```

- [ ] **Step 4: Create frontend monorepo scaffold**

`frontend/package.json`:
```json
{
  "name": "mtlbp-frontend",
  "private": true,
  "workspaces": [
    "packages/*",
    "apps/*"
  ]
}
```

`frontend/tsconfig.base.json`:
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true
  }
}
```

`frontend/packages/shared/package.json`:
```json
{
  "name": "@mtlbp/shared",
  "version": "0.0.1",
  "private": true,
  "main": "src/index.ts",
  "types": "src/index.ts",
  "peerDependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  }
}
```

`frontend/packages/shared/tsconfig.json`:
```json
{
  "extends": "../../tsconfig.base.json",
  "include": ["src"]
}
```

`frontend/packages/shared/src/index.ts`:
```typescript
export const THEME = {
  colors: {
    cream: '#fdf8f0',
    brownDark: '#3d2518',
    brownMedium: '#5c3d2e',
    brownLight: '#8b6f4e',
    earth: '#d4a574',
    earthLight: '#e8d5b5',
    sand: '#f5ead6',
    sandDark: '#ede0cc',
  },
} as const;
```

- [ ] **Step 5: Create pastor portal app scaffold**

`frontend/apps/pastor-portal/package.json`:
```json
{
  "name": "@mtlbp/pastor-portal",
  "private": true,
  "version": "0.0.1",
  "scripts": {
    "dev": "vite --port 23050",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@mtlbp/shared": "workspace:*",
    "axios": "^1.7.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-router-dom": "^7.0.0",
    "zustand": "^5.0.0"
  },
  "devDependencies": {
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@vitejs/plugin-react": "^4.3.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.6.0",
    "vite": "^6.0.0"
  }
}
```

`frontend/apps/pastor-portal/vite.config.ts`:
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: { port: 23050, host: '0.0.0.0' },
});
```

`frontend/apps/pastor-portal/tsconfig.json`:
```json
{
  "extends": "../../tsconfig.base.json",
  "include": ["src"],
  "references": [{ "path": "../../packages/shared" }]
}
```

`frontend/apps/pastor-portal/index.html`:
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>MayTheLordBePraised — Pastor Portal</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

`frontend/apps/pastor-portal/tailwind.config.ts`:
```typescript
import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}', '../../packages/shared/src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#fdf8f0',
        'brown-dark': '#3d2518',
        'brown-medium': '#5c3d2e',
        'brown-light': '#8b6f4e',
        earth: '#d4a574',
        'earth-light': '#e8d5b5',
        sand: '#f5ead6',
        'sand-dark': '#ede0cc',
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
```

`frontend/apps/pastor-portal/postcss.config.js`:
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

`frontend/apps/pastor-portal/src/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  font-family: 'Inter', system-ui, sans-serif;
  background-color: #fdf8f0;
  color: #3d2518;
}
```

`frontend/apps/pastor-portal/src/main.tsx`:
```typescript
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

`frontend/apps/pastor-portal/src/App.tsx`:
```typescript
export default function App() {
  return (
    <div className="min-h-screen bg-cream">
      <h1 className="text-2xl font-serif text-brown-dark p-8">Pastor Portal</h1>
    </div>
  );
}
```

- [ ] **Step 6: Create follower portal app scaffold**

`frontend/apps/follower-portal/package.json`:
```json
{
  "name": "@mtlbp/follower-portal",
  "private": true,
  "version": "0.0.1",
  "scripts": {
    "dev": "vite --port 23051",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@mtlbp/shared": "workspace:*",
    "axios": "^1.7.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-router-dom": "^7.0.0",
    "zustand": "^5.0.0"
  },
  "devDependencies": {
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@vitejs/plugin-react": "^4.3.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.6.0",
    "vite": "^6.0.0"
  }
}
```

`frontend/apps/follower-portal/vite.config.ts`:
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: { port: 23051, host: '0.0.0.0' },
});
```

`frontend/apps/follower-portal/tsconfig.json`:
```json
{
  "extends": "../../tsconfig.base.json",
  "include": ["src"],
  "references": [{ "path": "../../packages/shared" }]
}
```

`frontend/apps/follower-portal/index.html`:
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>MayTheLordBePraised — Connect</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

`frontend/apps/follower-portal/tailwind.config.ts`:
```typescript
import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}', '../../packages/shared/src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#fdf8f0',
        'brown-dark': '#3d2518',
        'brown-medium': '#5c3d2e',
        'brown-light': '#8b6f4e',
        earth: '#d4a574',
        'earth-light': '#e8d5b5',
        sand: '#f5ead6',
        'sand-dark': '#ede0cc',
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
```

`frontend/apps/follower-portal/postcss.config.js`:
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

`frontend/apps/follower-portal/src/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  font-family: 'Inter', system-ui, sans-serif;
  background-color: #fdf8f0;
  color: #3d2518;
}
```

`frontend/apps/follower-portal/src/main.tsx`:
```typescript
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

`frontend/apps/follower-portal/src/App.tsx`:
```typescript
export default function App() {
  return (
    <div className="min-h-screen bg-cream">
      <h1 className="text-2xl font-serif text-brown-dark p-8">Connect Portal</h1>
    </div>
  );
}
```

- [ ] **Step 7: Verify Docker Compose starts all services**

Run: `cp .env.example .env && docker compose up --build -d`

Verify:
- `curl http://localhost:23052/health` returns `{"status":"ok"}`
- `curl http://localhost:23055` shows Keycloak admin page
- MongoDB accessible on 23053
- Redis accessible on 23054

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: scaffold project — Docker Compose, FastAPI, React monorepo"
```

---

### Task 2: Database Connection & Indexes

**Files:**
- Create: `backend/pyproject.toml`
- Create: `backend/app/db/__init__.py`
- Create: `backend/app/db/mongo.py`
- Create: `backend/app/db/indexes.py`
- Create: `backend/tests/__init__.py`
- Create: `backend/tests/test_db.py`

- [ ] **Step 1: Create pytest config for async test support**

`backend/pyproject.toml`:
```toml
[tool.pytest.ini_options]
asyncio_mode = "auto"
```

This sets pytest-asyncio to auto mode so that `async def` fixtures and tests work without needing `@pytest_asyncio.fixture` or explicit `@pytest.mark.asyncio` decorators (though keeping the markers is harmless).

- [ ] **Step 2: Write failing test for DB connection**

`backend/tests/__init__.py`: empty file

`backend/tests/test_db.py`:
```python
import pytest
from app.db.mongo import get_db, close_db


@pytest.mark.asyncio
async def test_db_connection():
    db = await get_db()
    assert db is not None
    result = await db.command("ping")
    assert result.get("ok") == 1.0
    await close_db()
```

- [ ] **Step 3: Run test to verify it fails**

Run: `cd backend && python -m pytest tests/test_db.py -v`
Expected: FAIL — `ModuleNotFoundError: No module named 'app.db'`

- [ ] **Step 4: Implement DB connection**

`backend/app/db/__init__.py`: empty file

`backend/app/db/mongo.py`:
```python
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from app.config import settings

_client: AsyncIOMotorClient | None = None
_db: AsyncIOMotorDatabase | None = None


async def get_db() -> AsyncIOMotorDatabase:
    global _client, _db
    if _db is None:
        _client = AsyncIOMotorClient(settings.mongo_uri)
        _db = _client[settings.mongo_db]
    return _db


async def close_db() -> None:
    global _client, _db
    if _client:
        _client.close()
        _client = None
        _db = None
```

- [ ] **Step 5: Run test to verify it passes**

Run: `cd backend && python -m pytest tests/test_db.py -v`
Expected: PASS

- [ ] **Step 6: Create indexes**

`backend/app/db/indexes.py`:
```python
from motor.motor_asyncio import AsyncIOMotorDatabase


async def create_indexes(db: AsyncIOMotorDatabase) -> None:
    await db.users.create_index("email", unique=True)
    await db.users.create_index("keycloak_id", unique=True)
    await db.users.create_index("role")
    await db.services.create_index("pastor_id")
    await db.availability.create_index([("pastor_id", 1), ("day_of_week", 1)])
    await db.bookings.create_index([("pastor_id", 1), ("date", 1)])
    await db.bookings.create_index("follower_id")
    await db.prayers.create_index("status")
    await db.prayers.create_index("assigned_pastor_id")
    await db.donations.create_index("donor_id")
    await db.donations.create_index("pastor_id")
    await db.notifications.create_index([("user_id", 1), ("is_read", 1)])
```

- [ ] **Step 7: Wire DB lifecycle into FastAPI**

Update `backend/app/main.py` — add startup/shutdown:
```python
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.mongo import get_db, close_db
from app.db.indexes import create_indexes


@asynccontextmanager
async def lifespan(app: FastAPI):
    db = await get_db()
    await create_indexes(db)
    yield
    await close_db()


app = FastAPI(title="MayTheLordBePraised API", version="0.1.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:23050",
        "http://localhost:23051",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health():
    return {"status": "ok"}
```

- [ ] **Step 8: Commit**

```bash
git add backend/pyproject.toml backend/app/db/ backend/tests/ backend/app/main.py
git commit -m "feat: add MongoDB connection, indexes, and lifecycle management"
```

---

### Task 3: Keycloak Auth Integration

**Files:**
- Create: `backend/app/auth/__init__.py`
- Create: `backend/app/auth/keycloak.py`
- Create: `backend/app/auth/dependencies.py`
- Create: `backend/app/auth/models.py`
- Create: `backend/tests/test_auth.py`

- [ ] **Step 1: Write auth models**

`backend/app/auth/__init__.py`: empty file

`backend/app/auth/models.py`:
```python
from pydantic import BaseModel
from enum import Enum


class UserRole(str, Enum):
    pastor = "pastor"
    follower = "follower"
    admin = "admin"


class TokenPayload(BaseModel):
    sub: str  # keycloak user id
    email: str
    realm_access: dict | None = None


class CurrentUser(BaseModel):
    keycloak_id: str
    email: str
    role: UserRole
    user_id: str | None = None  # MongoDB _id once resolved
```

- [ ] **Step 2: Write Keycloak token verification**

`backend/app/auth/keycloak.py`:
```python
import httpx
from jose import jwt, JWTError
from functools import lru_cache
from app.config import settings


@lru_cache(maxsize=1)
def _get_jwks_url() -> str:
    return (
        f"{settings.keycloak_url}/realms/{settings.keycloak_realm}"
        f"/protocol/openid-connect/certs"
    )


async def get_public_keys() -> dict:
    async with httpx.AsyncClient() as client:
        resp = await client.get(_get_jwks_url())
        resp.raise_for_status()
        return resp.json()


async def verify_token(token: str) -> dict:
    jwks = await get_public_keys()
    try:
        payload = jwt.decode(
            token,
            jwks,
            algorithms=["RS256"],
            audience=settings.keycloak_client_id,
            options={"verify_aud": True},
        )
        return payload
    except JWTError as e:
        raise ValueError(f"Invalid token: {e}")
```

- [ ] **Step 3: Write auth dependencies**

`backend/app/auth/dependencies.py`:
```python
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.auth.keycloak import verify_token
from app.auth.models import CurrentUser, UserRole
from app.db.mongo import get_db

security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> CurrentUser:
    try:
        payload = await verify_token(credentials.credentials)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )

    db = await get_db()
    user = await db.users.find_one({"keycloak_id": payload["sub"]})

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not registered",
        )

    return CurrentUser(
        keycloak_id=payload["sub"],
        email=payload.get("email", ""),
        role=UserRole(user["role"]),
        user_id=str(user["_id"]),
    )


def require_role(*roles: UserRole):
    async def checker(user: CurrentUser = Depends(get_current_user)):
        if user.role not in roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions",
            )
        return user
    return checker
```

- [ ] **Step 4: Write test for auth dependency**

`backend/tests/test_auth.py`:
```python
import pytest
from app.auth.models import UserRole, CurrentUser


def test_user_role_enum():
    assert UserRole.pastor == "pastor"
    assert UserRole.follower == "follower"
    assert UserRole.admin == "admin"


def test_current_user_model():
    user = CurrentUser(
        keycloak_id="kc-123",
        email="pastor@test.com",
        role=UserRole.pastor,
        user_id="mongo-456",
    )
    assert user.keycloak_id == "kc-123"
    assert user.role == UserRole.pastor
```

- [ ] **Step 5: Run tests**

Run: `cd backend && python -m pytest tests/test_auth.py -v`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add backend/app/auth/ backend/tests/test_auth.py
git commit -m "feat: add Keycloak auth integration with JWT verification and role guards"
```

---

### Task 4: Auth API Routes (Register)

> **Note:** Login is handled client-to-Keycloak directly (standard OIDC flow). No backend login proxy needed — the frontend uses `keycloak-js` to obtain tokens, which are then sent as Bearer tokens to the API. The backend only validates tokens (Task 3).

**Files:**
- Create: `backend/app/modules/__init__.py`
- Create: `backend/app/modules/auth/__init__.py`
- Create: `backend/app/modules/auth/router.py`
- Create: `backend/app/modules/auth/service.py`
- Create: `backend/app/modules/auth/models.py`
- Create: `backend/tests/test_auth_routes.py`
- Modify: `backend/app/main.py`

- [ ] **Step 1: Write auth route models**

`backend/app/modules/__init__.py`: empty file
`backend/app/modules/auth/__init__.py`: empty file

`backend/app/modules/auth/models.py`:
```python
from pydantic import BaseModel, EmailStr
from app.auth.models import UserRole


class RegisterRequest(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str
    role: UserRole
    keycloak_id: str


class RegisterResponse(BaseModel):
    id: str
    email: str
    role: UserRole
    message: str = "Registration successful"


class UserProfileResponse(BaseModel):
    id: str
    email: str
    role: UserRole
    first_name: str
    last_name: str
```

- [ ] **Step 2: Write auth service**

`backend/app/modules/auth/service.py`:
```python
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.modules.auth.models import RegisterRequest
from datetime import datetime, timezone


async def register_user(db: AsyncIOMotorDatabase, data: RegisterRequest) -> dict:
    existing = await db.users.find_one({"email": data.email})
    if existing:
        raise ValueError("Email already registered")

    user_doc = {
        "email": data.email,
        "role": data.role.value,
        "keycloak_id": data.keycloak_id,
        "profile": {
            "first_name": data.first_name,
            "last_name": data.last_name,
            "phone": None,
            "photo_url": None,
            "bio": None,
            "specialties": [],
            "ministry_background": None,
        },
        "subscription": {
            "tier": "shepherd",
            "stripe_subscription_id": None,
            "status": "active",
            "current_period_end": None,
        },
        "notification_prefs": {
            "email_bookings": True,
            "email_prayers": True,
            "email_events": True,
            "email_giving": True,
        },
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    }

    result = await db.users.insert_one(user_doc)
    user_doc["_id"] = result.inserted_id
    return user_doc
```

- [ ] **Step 3: Write auth router**

`backend/app/modules/auth/router.py`:
```python
from fastapi import APIRouter, HTTPException
from app.db.mongo import get_db
from app.modules.auth.models import RegisterRequest, RegisterResponse
from app.modules.auth.service import register_user

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=RegisterResponse)
async def register(data: RegisterRequest):
    db = await get_db()
    try:
        user = await register_user(db, data)
    except ValueError as e:
        raise HTTPException(status_code=409, detail=str(e))

    return RegisterResponse(
        id=str(user["_id"]),
        email=user["email"],
        role=user["role"],
    )
```

- [ ] **Step 4: Mount router in main.py**

Add to `backend/app/main.py` after CORS middleware:
```python
from app.modules.auth.router import router as auth_router

app.include_router(auth_router, prefix="/api")
```

- [ ] **Step 5: Write integration test**

`backend/tests/test_auth_routes.py`:
```python
import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.db.mongo import get_db, close_db


@pytest.fixture(autouse=True)
async def clean_db():
    db = await get_db()
    await db.users.delete_many({})
    yield
    await close_db()


@pytest.mark.asyncio
async def test_register_pastor():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        resp = await client.post("/api/auth/register", json={
            "email": "pastor@test.com",
            "first_name": "James",
            "last_name": "Walker",
            "role": "pastor",
            "keycloak_id": "kc-123",
        })
    assert resp.status_code == 200
    data = resp.json()
    assert data["email"] == "pastor@test.com"
    assert data["role"] == "pastor"


@pytest.mark.asyncio
async def test_register_duplicate_email():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        await client.post("/api/auth/register", json={
            "email": "dup@test.com",
            "first_name": "A",
            "last_name": "B",
            "role": "follower",
            "keycloak_id": "kc-dup",
        })
        resp = await client.post("/api/auth/register", json={
            "email": "dup@test.com",
            "first_name": "C",
            "last_name": "D",
            "role": "follower",
            "keycloak_id": "kc-dup2",
        })
    assert resp.status_code == 409
```

- [ ] **Step 6: Run tests**

Run: `cd backend && python -m pytest tests/test_auth_routes.py -v`
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add backend/app/modules/ backend/tests/test_auth_routes.py backend/app/main.py
git commit -m "feat: add auth register endpoint with duplicate email guard"
```

---

## Chunk 2: Profiles & Booking Engine

### Task 5: Pastor Profile CRUD

**Files:**
- Create: `backend/app/modules/profiles/__init__.py`
- Create: `backend/app/modules/profiles/router.py`
- Create: `backend/app/modules/profiles/service.py`
- Create: `backend/app/modules/profiles/models.py`
- Create: `backend/tests/test_profiles.py`
- Modify: `backend/app/main.py`

- [ ] **Step 1: Write profile models**

`backend/app/modules/profiles/__init__.py`: empty file

`backend/app/modules/profiles/models.py`:
```python
from pydantic import BaseModel


class PastorProfileResponse(BaseModel):
    id: str
    email: str
    first_name: str
    last_name: str
    bio: str | None = None
    photo_url: str | None = None
    specialties: list[str] = []
    ministry_background: str | None = None
    is_visible: bool = True


class UpdateProfileRequest(BaseModel):
    first_name: str | None = None
    last_name: str | None = None
    bio: str | None = None
    photo_url: str | None = None
    specialties: list[str] | None = None
    ministry_background: str | None = None
    phone: str | None = None


class PastorListResponse(BaseModel):
    pastors: list[PastorProfileResponse]
    total: int
```

- [ ] **Step 2: Write profile service**

`backend/app/modules/profiles/service.py`:
```python
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
from datetime import datetime, timezone


async def get_public_pastors(db: AsyncIOMotorDatabase, skip: int = 0, limit: int = 20) -> tuple[list[dict], int]:
    query = {"role": "pastor"}
    total = await db.users.count_documents(query)
    cursor = db.users.find(query).skip(skip).limit(limit)
    pastors = await cursor.to_list(length=limit)
    return pastors, total


async def get_pastor_by_id(db: AsyncIOMotorDatabase, pastor_id: str) -> dict | None:
    return await db.users.find_one({"_id": ObjectId(pastor_id), "role": "pastor"})


async def update_pastor_profile(db: AsyncIOMotorDatabase, user_id: str, updates: dict) -> dict | None:
    profile_updates = {f"profile.{k}": v for k, v in updates.items() if v is not None}
    if not profile_updates:
        return await db.users.find_one({"_id": ObjectId(user_id)})

    profile_updates["updated_at"] = datetime.now(timezone.utc)
    await db.users.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": profile_updates},
    )
    return await db.users.find_one({"_id": ObjectId(user_id)})
```

- [ ] **Step 3: Write profile router**

`backend/app/modules/profiles/router.py`:
```python
from fastapi import APIRouter, Depends, HTTPException, Query
from app.db.mongo import get_db
from app.auth.dependencies import get_current_user, require_role
from app.auth.models import CurrentUser, UserRole
from app.modules.profiles.models import (
    PastorProfileResponse, UpdateProfileRequest, PastorListResponse,
)
from app.modules.profiles.service import (
    get_public_pastors, get_pastor_by_id, update_pastor_profile,
)

router = APIRouter(prefix="/pastors", tags=["pastors"])


def _to_response(user: dict) -> PastorProfileResponse:
    profile = user.get("profile", {})
    return PastorProfileResponse(
        id=str(user["_id"]),
        email=user["email"],
        first_name=profile.get("first_name", ""),
        last_name=profile.get("last_name", ""),
        bio=profile.get("bio"),
        photo_url=profile.get("photo_url"),
        specialties=profile.get("specialties", []),
        ministry_background=profile.get("ministry_background"),
    )


@router.get("", response_model=PastorListResponse)
async def list_pastors(skip: int = Query(0, ge=0), limit: int = Query(20, ge=1, le=100)):
    db = await get_db()
    pastors, total = await get_public_pastors(db, skip, limit)
    return PastorListResponse(
        pastors=[_to_response(p) for p in pastors],
        total=total,
    )


@router.get("/{pastor_id}", response_model=PastorProfileResponse)
async def get_pastor(pastor_id: str):
    db = await get_db()
    pastor = await get_pastor_by_id(db, pastor_id)
    if not pastor:
        raise HTTPException(status_code=404, detail="Pastor not found")
    return _to_response(pastor)


@router.put("/me", response_model=PastorProfileResponse)
async def update_my_profile(
    data: UpdateProfileRequest,
    user: CurrentUser = Depends(require_role(UserRole.pastor)),
):
    db = await get_db()
    updated = await update_pastor_profile(db, user.user_id, data.model_dump(exclude_none=True))
    if not updated:
        raise HTTPException(status_code=404, detail="User not found")
    return _to_response(updated)
```

- [ ] **Step 4: Mount in main.py**

Add to `backend/app/main.py`:
```python
from app.modules.profiles.router import router as profiles_router

app.include_router(profiles_router, prefix="/api")
```

- [ ] **Step 5: Write tests**

`backend/tests/test_profiles.py`:
```python
import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.db.mongo import get_db, close_db
from bson import ObjectId


@pytest.fixture(autouse=True)
async def seed_db():
    db = await get_db()
    await db.users.delete_many({})
    await db.users.insert_one({
        "_id": ObjectId("665000000000000000000001"),
        "email": "james@test.com",
        "role": "pastor",
        "keycloak_id": "kc-james",
        "profile": {
            "first_name": "James",
            "last_name": "Walker",
            "bio": "Senior Pastor",
            "specialties": ["Marriage", "Youth"],
            "photo_url": None,
            "phone": None,
            "ministry_background": None,
        },
        "subscription": {"tier": "minister", "stripe_subscription_id": None, "status": "active", "current_period_end": None},
        "notification_prefs": {"email_bookings": True, "email_prayers": True, "email_events": True, "email_giving": True},
    })
    yield
    await close_db()


@pytest.mark.asyncio
async def test_list_pastors():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        resp = await client.get("/api/pastors")
    assert resp.status_code == 200
    data = resp.json()
    assert data["total"] == 1
    assert data["pastors"][0]["first_name"] == "James"


@pytest.mark.asyncio
async def test_get_pastor_by_id():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        resp = await client.get("/api/pastors/665000000000000000000001")
    assert resp.status_code == 200
    assert resp.json()["email"] == "james@test.com"


@pytest.mark.asyncio
async def test_get_pastor_not_found():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        resp = await client.get("/api/pastors/665000000000000000000099")
    assert resp.status_code == 404
```

- [ ] **Step 6: Run tests**

Run: `cd backend && python -m pytest tests/test_profiles.py -v`
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add backend/app/modules/profiles/ backend/tests/test_profiles.py backend/app/main.py
git commit -m "feat: add pastor profile CRUD — list, get, update"
```

---

### Task 6: Service Definitions, Availability & Booking Engine

**Files:**
- Create: `backend/app/modules/booking/__init__.py`
- Create: `backend/app/modules/booking/models.py`
- Create: `backend/app/modules/booking/service.py`
- Create: `backend/app/modules/booking/router.py`
- Create: `backend/tests/test_services.py`
- Create: `backend/tests/test_availability.py`
- Modify: `backend/app/main.py`

- [ ] **Step 1: Write booking models**

`backend/app/modules/booking/__init__.py`: empty file

`backend/app/modules/booking/models.py`:
```python
from pydantic import BaseModel
from enum import Enum


class ServiceCategory(str, Enum):
    counseling = "counseling"
    ceremony = "ceremony"
    visit = "visit"
    pre_marital = "pre_marital"
    other = "other"


class ServiceMode(str, Enum):
    in_person = "in_person"
    virtual = "virtual"
    both = "both"


class CreateServiceRequest(BaseModel):
    name: str
    description: str
    category: ServiceCategory
    duration_minutes: int
    price_cents: int = 0
    mode: ServiceMode = ServiceMode.both


class ServiceResponse(BaseModel):
    id: str
    pastor_id: str
    name: str
    description: str
    category: ServiceCategory
    duration_minutes: int
    price_cents: int
    mode: ServiceMode
    is_active: bool


class BookingStatus(str, Enum):
    pending = "pending"
    confirmed = "confirmed"
    completed = "completed"
    cancelled = "cancelled"
    no_show = "no_show"


class CreateBookingRequest(BaseModel):
    pastor_id: str
    service_id: str
    date: str  # YYYY-MM-DD
    start_time: str  # HH:MM
    mode: str  # in_person or virtual


class BookingResponse(BaseModel):
    id: str
    pastor_id: str
    follower_id: str
    service_id: str
    date: str
    start_time: str
    end_time: str
    mode: str
    status: BookingStatus
    meeting_link: str | None = None


class UpdateBookingStatusRequest(BaseModel):
    status: BookingStatus


# Note: Spec uses int (0-6) for day_of_week. MVP uses string enum for readability.
# Fields is_recurring, specific_date, status deferred to Phase 2 (date blocking/vacation mode).
class DayOfWeek(str, Enum):
    monday = "monday"
    tuesday = "tuesday"
    wednesday = "wednesday"
    thursday = "thursday"
    friday = "friday"
    saturday = "saturday"
    sunday = "sunday"


class AvailabilitySlot(BaseModel):
    day_of_week: DayOfWeek
    start_time: str  # HH:MM
    end_time: str  # HH:MM


class SetAvailabilityRequest(BaseModel):
    slots: list[AvailabilitySlot]


class AvailabilityResponse(BaseModel):
    id: str
    pastor_id: str
    day_of_week: str
    start_time: str
    end_time: str
```

- [ ] **Step 2: Write service layer (services, availability, bookings)**

`backend/app/modules/booking/service.py`:
```python
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
from datetime import datetime, timezone


async def create_service(db: AsyncIOMotorDatabase, pastor_id: str, data: dict) -> dict:
    doc = {
        "pastor_id": ObjectId(pastor_id),
        "name": data["name"],
        "description": data["description"],
        "category": data["category"],
        "duration_minutes": data["duration_minutes"],
        "price_cents": data.get("price_cents", 0),
        "mode": data.get("mode", "both"),
        "is_active": True,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    }
    result = await db.services.insert_one(doc)
    doc["_id"] = result.inserted_id
    return doc


async def get_services_by_pastor(db: AsyncIOMotorDatabase, pastor_id: str) -> list[dict]:
    cursor = db.services.find({"pastor_id": ObjectId(pastor_id), "is_active": True})
    return await cursor.to_list(length=100)


async def create_booking(db: AsyncIOMotorDatabase, follower_id: str, data: dict) -> dict:
    service = await db.services.find_one({"_id": ObjectId(data["service_id"])})
    if not service:
        raise ValueError("Service not found")

    # Calculate end time
    start_h, start_m = map(int, data["start_time"].split(":"))
    total_minutes = start_h * 60 + start_m + service["duration_minutes"]
    end_time = f"{total_minutes // 60:02d}:{total_minutes % 60:02d}"

    doc = {
        "pastor_id": ObjectId(data["pastor_id"]),
        "follower_id": ObjectId(follower_id),
        "service_id": ObjectId(data["service_id"]),
        "date": data["date"],
        "start_time": data["start_time"],
        "end_time": end_time,
        "mode": data["mode"],
        "status": "pending",
        "meeting_link": None,
        "notes": None,
        "package_id": None,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    }
    result = await db.bookings.insert_one(doc)
    doc["_id"] = result.inserted_id
    return doc


async def get_bookings_for_user(db: AsyncIOMotorDatabase, user_id: str, role: str) -> list[dict]:
    if role == "pastor":
        query = {"pastor_id": ObjectId(user_id)}
    else:
        query = {"follower_id": ObjectId(user_id)}
    cursor = db.bookings.find(query).sort("date", -1)
    return await cursor.to_list(length=100)


async def update_booking_status(db: AsyncIOMotorDatabase, booking_id: str, status: str) -> dict | None:
    await db.bookings.update_one(
        {"_id": ObjectId(booking_id)},
        {"$set": {"status": status, "updated_at": datetime.now(timezone.utc)}},
    )
    return await db.bookings.find_one({"_id": ObjectId(booking_id)})


async def set_availability(db: AsyncIOMotorDatabase, pastor_id: str, slots: list[dict]) -> list[dict]:
    """Replace all availability slots for a pastor."""
    await db.availability.delete_many({"pastor_id": ObjectId(pastor_id)})
    if not slots:
        return []
    docs = []
    for slot in slots:
        doc = {
            "pastor_id": ObjectId(pastor_id),
            "day_of_week": slot["day_of_week"],
            "start_time": slot["start_time"],
            "end_time": slot["end_time"],
            "created_at": datetime.now(timezone.utc),
        }
        docs.append(doc)
    result = await db.availability.insert_many(docs)
    for doc, inserted_id in zip(docs, result.inserted_ids):
        doc["_id"] = inserted_id
    return docs


async def get_availability(db: AsyncIOMotorDatabase, pastor_id: str) -> list[dict]:
    cursor = db.availability.find({"pastor_id": ObjectId(pastor_id)})
    return await cursor.to_list(length=100)


async def check_pastor_available(db: AsyncIOMotorDatabase, pastor_id: str, date: str, start_time: str, duration_minutes: int) -> bool:
    """Check if a pastor is available at the requested date/time."""
    from datetime import date as date_type
    booking_date = date_type.fromisoformat(date)
    day_name = booking_date.strftime("%A").lower()

    # Check availability slots for that day
    slots = await db.availability.find({
        "pastor_id": ObjectId(pastor_id),
        "day_of_week": day_name,
    }).to_list(length=100)

    if not slots:
        return False

    start_h, start_m = map(int, start_time.split(":"))
    total_minutes = start_h * 60 + start_m
    end_minutes = total_minutes + duration_minutes

    # Check if requested time fits within any availability slot
    fits_slot = False
    for slot in slots:
        slot_start_h, slot_start_m = map(int, slot["start_time"].split(":"))
        slot_end_h, slot_end_m = map(int, slot["end_time"].split(":"))
        slot_start = slot_start_h * 60 + slot_start_m
        slot_end = slot_end_h * 60 + slot_end_m
        if total_minutes >= slot_start and end_minutes <= slot_end:
            fits_slot = True
            break
    if not fits_slot:
        return False

    # Check for conflicting bookings on the same date
    existing = await db.bookings.find({
        "pastor_id": ObjectId(pastor_id),
        "date": date,
        "status": {"$in": ["pending", "confirmed"]},
    }).to_list(length=100)

    for booking in existing:
        b_start_h, b_start_m = map(int, booking["start_time"].split(":"))
        b_end_h, b_end_m = map(int, booking["end_time"].split(":"))
        b_start = b_start_h * 60 + b_start_m
        b_end = b_end_h * 60 + b_end_m
        if total_minutes < b_end and end_minutes > b_start:
            return False  # Overlap

    return True
```

- [ ] **Step 3: Write booking router**

`backend/app/modules/booking/router.py`:
```python
from fastapi import APIRouter, Depends, HTTPException
from bson import ObjectId
from app.db.mongo import get_db
from app.auth.dependencies import get_current_user, require_role
from app.auth.models import CurrentUser, UserRole
from app.modules.booking.models import (
    CreateServiceRequest, ServiceResponse,
    CreateBookingRequest, BookingResponse, UpdateBookingStatusRequest,
    SetAvailabilityRequest, AvailabilityResponse,
)
from app.modules.booking.service import (
    create_service, get_services_by_pastor,
    create_booking, get_bookings_for_user, update_booking_status,
    set_availability, get_availability, check_pastor_available,
)

router = APIRouter(tags=["booking"])


def _service_response(s: dict) -> ServiceResponse:
    return ServiceResponse(
        id=str(s["_id"]),
        pastor_id=str(s["pastor_id"]),
        name=s["name"],
        description=s["description"],
        category=s["category"],
        duration_minutes=s["duration_minutes"],
        price_cents=s["price_cents"],
        mode=s["mode"],
        is_active=s["is_active"],
    )


def _booking_response(b: dict) -> BookingResponse:
    return BookingResponse(
        id=str(b["_id"]),
        pastor_id=str(b["pastor_id"]),
        follower_id=str(b["follower_id"]),
        service_id=str(b["service_id"]),
        date=b["date"],
        start_time=b["start_time"],
        end_time=b["end_time"],
        mode=b["mode"],
        status=b["status"],
        meeting_link=b.get("meeting_link"),
    )


@router.post("/services", response_model=ServiceResponse)
async def create_new_service(
    data: CreateServiceRequest,
    user: CurrentUser = Depends(require_role(UserRole.pastor)),
):
    db = await get_db()
    service = await create_service(db, user.user_id, data.model_dump())
    return _service_response(service)


@router.get("/pastors/{pastor_id}/services", response_model=list[ServiceResponse])
async def list_pastor_services(pastor_id: str):
    db = await get_db()
    services = await get_services_by_pastor(db, pastor_id)
    return [_service_response(s) for s in services]


@router.post("/bookings", response_model=BookingResponse)
async def book_session(
    data: CreateBookingRequest,
    user: CurrentUser = Depends(require_role(UserRole.follower)),
):
    db = await get_db()
    # Validate pastor availability before creating booking
    service = await db.services.find_one({"_id": ObjectId(data.service_id)})
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    is_available = await check_pastor_available(
        db, data.pastor_id, data.date, data.start_time, service["duration_minutes"],
    )
    if not is_available:
        raise HTTPException(status_code=409, detail="Pastor is not available at this time")
    try:
        booking = await create_booking(db, user.user_id, data.model_dump())
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    return _booking_response(booking)


@router.get("/bookings/me", response_model=list[BookingResponse])
async def my_bookings(user: CurrentUser = Depends(get_current_user)):
    db = await get_db()
    bookings = await get_bookings_for_user(db, user.user_id, user.role.value)
    return [_booking_response(b) for b in bookings]


@router.patch("/bookings/{booking_id}", response_model=BookingResponse)
async def update_booking(
    booking_id: str,
    data: UpdateBookingStatusRequest,
    user: CurrentUser = Depends(get_current_user),
):
    db = await get_db()
    updated = await update_booking_status(db, booking_id, data.status.value)
    if not updated:
        raise HTTPException(status_code=404, detail="Booking not found")
    return _booking_response(updated)


def _availability_response(a: dict) -> AvailabilityResponse:
    return AvailabilityResponse(
        id=str(a["_id"]),
        pastor_id=str(a["pastor_id"]),
        day_of_week=a["day_of_week"],
        start_time=a["start_time"],
        end_time=a["end_time"],
    )


@router.put("/availability", response_model=list[AvailabilityResponse])
async def set_my_availability(
    data: SetAvailabilityRequest,
    user: CurrentUser = Depends(require_role(UserRole.pastor)),
):
    db = await get_db()
    slots = await set_availability(db, user.user_id, [s.model_dump() for s in data.slots])
    return [_availability_response(s) for s in slots]


@router.get("/pastors/{pastor_id}/availability", response_model=list[AvailabilityResponse])
async def get_pastor_availability(pastor_id: str):
    db = await get_db()
    slots = await get_availability(db, pastor_id)
    return [_availability_response(s) for s in slots]
```

- [ ] **Step 4: Mount router**

Add to `backend/app/main.py`:
```python
from app.modules.booking.router import router as booking_router

app.include_router(booking_router, prefix="/api")
```

- [ ] **Step 5: Write tests**

`backend/tests/test_services.py`:
```python
import pytest
from app.db.mongo import get_db, close_db
from app.modules.booking.service import create_service, get_services_by_pastor
from bson import ObjectId


@pytest.fixture(autouse=True)
async def clean_db():
    db = await get_db()
    await db.services.delete_many({})
    yield
    await close_db()


PASTOR_ID = "665000000000000000000001"


@pytest.mark.asyncio
async def test_create_service():
    db = await get_db()
    service = await create_service(db, PASTOR_ID, {
        "name": "Marriage Counseling",
        "description": "1-on-1 sessions",
        "category": "counseling",
        "duration_minutes": 60,
        "price_cents": 0,
        "mode": "both",
    })
    assert service["name"] == "Marriage Counseling"
    assert service["pastor_id"] == ObjectId(PASTOR_ID)
    assert service["is_active"] is True


@pytest.mark.asyncio
async def test_get_services_by_pastor():
    db = await get_db()
    await create_service(db, PASTOR_ID, {
        "name": "Counseling",
        "description": "desc",
        "category": "counseling",
        "duration_minutes": 60,
    })
    await create_service(db, PASTOR_ID, {
        "name": "Wedding",
        "description": "desc",
        "category": "ceremony",
        "duration_minutes": 120,
    })
    services = await get_services_by_pastor(db, PASTOR_ID)
    assert len(services) == 2
```

- [ ] **Step 6: Run service tests**

Run: `cd backend && python -m pytest tests/test_services.py -v`
Expected: PASS

- [ ] **Step 7: Write availability tests**

`backend/tests/test_availability.py`:
```python
import pytest
from app.db.mongo import get_db, close_db
from app.modules.booking.service import (
    set_availability, get_availability, check_pastor_available, create_service, create_booking,
)
from bson import ObjectId


@pytest.fixture(autouse=True)
async def clean_db():
    db = await get_db()
    await db.availability.delete_many({})
    await db.services.delete_many({})
    await db.bookings.delete_many({})
    yield
    await close_db()


PASTOR_ID = "665000000000000000000001"
FOLLOWER_ID = "665000000000000000000002"


@pytest.mark.asyncio
async def test_set_and_get_availability():
    db = await get_db()
    slots = [
        {"day_of_week": "monday", "start_time": "09:00", "end_time": "17:00"},
        {"day_of_week": "wednesday", "start_time": "10:00", "end_time": "15:00"},
    ]
    result = await set_availability(db, PASTOR_ID, slots)
    assert len(result) == 2
    assert result[0]["day_of_week"] == "monday"

    fetched = await get_availability(db, PASTOR_ID)
    assert len(fetched) == 2


@pytest.mark.asyncio
async def test_set_availability_replaces_existing():
    db = await get_db()
    await set_availability(db, PASTOR_ID, [
        {"day_of_week": "monday", "start_time": "09:00", "end_time": "17:00"},
    ])
    await set_availability(db, PASTOR_ID, [
        {"day_of_week": "tuesday", "start_time": "10:00", "end_time": "14:00"},
    ])
    fetched = await get_availability(db, PASTOR_ID)
    assert len(fetched) == 1
    assert fetched[0]["day_of_week"] == "tuesday"


@pytest.mark.asyncio
async def test_check_available_within_slot():
    db = await get_db()
    await set_availability(db, PASTOR_ID, [
        {"day_of_week": "monday", "start_time": "09:00", "end_time": "17:00"},
    ])
    # 2026-03-16 is a Monday
    available = await check_pastor_available(db, PASTOR_ID, "2026-03-16", "10:00", 60)
    assert available is True


@pytest.mark.asyncio
async def test_check_unavailable_no_slot():
    db = await get_db()
    await set_availability(db, PASTOR_ID, [
        {"day_of_week": "monday", "start_time": "09:00", "end_time": "17:00"},
    ])
    # 2026-03-17 is a Tuesday — no availability set
    available = await check_pastor_available(db, PASTOR_ID, "2026-03-17", "10:00", 60)
    assert available is False


@pytest.mark.asyncio
async def test_check_unavailable_outside_slot():
    db = await get_db()
    await set_availability(db, PASTOR_ID, [
        {"day_of_week": "monday", "start_time": "09:00", "end_time": "12:00"},
    ])
    # Booking at 11:30 for 60 min would end at 12:30, past the slot end
    available = await check_pastor_available(db, PASTOR_ID, "2026-03-16", "11:30", 60)
    assert available is False


@pytest.mark.asyncio
async def test_check_unavailable_conflicting_booking():
    db = await get_db()
    await set_availability(db, PASTOR_ID, [
        {"day_of_week": "monday", "start_time": "09:00", "end_time": "17:00"},
    ])
    service = await create_service(db, PASTOR_ID, {
        "name": "Counseling",
        "description": "desc",
        "category": "counseling",
        "duration_minutes": 60,
    })
    await create_booking(db, FOLLOWER_ID, {
        "pastor_id": PASTOR_ID,
        "service_id": str(service["_id"]),
        "date": "2026-03-16",
        "start_time": "10:00",
        "mode": "virtual",
    })
    # Try to book overlapping slot
    available = await check_pastor_available(db, PASTOR_ID, "2026-03-16", "10:30", 60)
    assert available is False
```

- [ ] **Step 8: Run availability tests**

Run: `cd backend && python -m pytest tests/test_availability.py -v`
Expected: PASS

- [ ] **Step 9: Commit**

```bash
git add backend/app/modules/booking/ backend/tests/test_services.py backend/tests/test_availability.py backend/app/main.py
git commit -m "feat: add service definitions, availability management, and booking engine"
```

---

## Chunk 3: Prayer Wall & Basic Giving

### Task 7: Prayer Wall Module

**Files:**
- Create: `backend/app/modules/prayer/__init__.py`
- Create: `backend/app/modules/prayer/models.py`
- Create: `backend/app/modules/prayer/service.py`
- Create: `backend/app/modules/prayer/router.py`
- Create: `backend/tests/test_prayer.py`
- Modify: `backend/app/main.py`

- [ ] **Step 1: Write prayer models**

`backend/app/modules/prayer/__init__.py`: empty file

`backend/app/modules/prayer/models.py`:
```python
from pydantic import BaseModel


class CreatePrayerRequest(BaseModel):
    text: str
    is_anonymous: bool = False


class PrayerResponse(BaseModel):
    id: str
    author_id: str | None
    is_anonymous: bool
    text: str
    status: str
    pray_count: int
    testimony: str | None = None
    pastor_responses: list[dict] = []


class PrayerRespondRequest(BaseModel):
    text: str


class MarkAnsweredRequest(BaseModel):
    testimony: str | None = None
```

- [ ] **Step 2: Write prayer service**

`backend/app/modules/prayer/service.py`:
```python
from motor.motor_asyncio import AsyncIOMotorDatabase
from pymongo import ReturnDocument
from bson import ObjectId
from datetime import datetime, timezone


async def create_prayer(db: AsyncIOMotorDatabase, author_id: str, text: str, is_anonymous: bool) -> dict:
    doc = {
        "author_id": ObjectId(author_id),
        "is_anonymous": is_anonymous,
        "text": text,
        "status": "active",
        "pray_count": 0,
        "testimony": None,
        "pastor_responses": [],
        "assigned_pastor_id": None,
        "follow_up_needed": False,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    }
    result = await db.prayers.insert_one(doc)
    doc["_id"] = result.inserted_id
    return doc


async def get_prayers(db: AsyncIOMotorDatabase, status: str | None = None, skip: int = 0, limit: int = 20) -> list[dict]:
    query = {}
    if status:
        query["status"] = status
    cursor = db.prayers.find(query).sort("created_at", -1).skip(skip).limit(limit)
    return await cursor.to_list(length=limit)


async def pray_with(db: AsyncIOMotorDatabase, prayer_id: str) -> dict | None:
    result = await db.prayers.find_one_and_update(
        {"_id": ObjectId(prayer_id)},
        {"$inc": {"pray_count": 1}},
        return_document=ReturnDocument.AFTER,
    )
    return result


async def respond_to_prayer(db: AsyncIOMotorDatabase, prayer_id: str, pastor_id: str, text: str) -> dict | None:
    response = {
        "pastor_id": str(pastor_id),
        "text": text,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    result = await db.prayers.find_one_and_update(
        {"_id": ObjectId(prayer_id)},
        {
            "$push": {"pastor_responses": response},
            "$set": {"updated_at": datetime.now(timezone.utc)},
        },
        return_document=ReturnDocument.AFTER,
    )
    return result


async def mark_answered(db: AsyncIOMotorDatabase, prayer_id: str, testimony: str | None) -> dict | None:
    update = {"status": "answered", "updated_at": datetime.now(timezone.utc)}
    if testimony:
        update["testimony"] = testimony
    result = await db.prayers.find_one_and_update(
        {"_id": ObjectId(prayer_id)},
        {"$set": update},
        return_document=ReturnDocument.AFTER,
    )
    return result
```

- [ ] **Step 3: Write prayer router**

`backend/app/modules/prayer/router.py`:
```python
from fastapi import APIRouter, Depends, HTTPException, Query
from app.db.mongo import get_db
from app.auth.dependencies import get_current_user, require_role
from app.auth.models import CurrentUser, UserRole
from app.modules.prayer.models import (
    CreatePrayerRequest, PrayerResponse, PrayerRespondRequest, MarkAnsweredRequest,
)
from app.modules.prayer.service import (
    create_prayer, get_prayers, pray_with, respond_to_prayer, mark_answered,
)

router = APIRouter(prefix="/prayers", tags=["prayers"])


def _prayer_response(p: dict) -> PrayerResponse:
    return PrayerResponse(
        id=str(p["_id"]),
        author_id=None if p.get("is_anonymous") else str(p["author_id"]),
        is_anonymous=p.get("is_anonymous", False),
        text=p["text"],
        status=p["status"],
        pray_count=p.get("pray_count", 0),
        testimony=p.get("testimony"),
        pastor_responses=p.get("pastor_responses", []),
    )


@router.get("", response_model=list[PrayerResponse])
async def list_prayers(
    status: str | None = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
):
    db = await get_db()
    prayers = await get_prayers(db, status, skip, limit)
    return [_prayer_response(p) for p in prayers]


@router.post("", response_model=PrayerResponse)
async def submit_prayer(
    data: CreatePrayerRequest,
    user: CurrentUser = Depends(get_current_user),
):
    db = await get_db()
    prayer = await create_prayer(db, user.user_id, data.text, data.is_anonymous)
    return _prayer_response(prayer)


@router.post("/{prayer_id}/pray", response_model=PrayerResponse)
async def pray_with_prayer(prayer_id: str):
    db = await get_db()
    prayer = await pray_with(db, prayer_id)
    if not prayer:
        raise HTTPException(status_code=404, detail="Prayer not found")
    return _prayer_response(prayer)


@router.post("/{prayer_id}/respond", response_model=PrayerResponse)
async def pastor_respond(
    prayer_id: str,
    data: PrayerRespondRequest,
    user: CurrentUser = Depends(require_role(UserRole.pastor)),
):
    db = await get_db()
    prayer = await respond_to_prayer(db, prayer_id, user.user_id, data.text)
    if not prayer:
        raise HTTPException(status_code=404, detail="Prayer not found")
    return _prayer_response(prayer)


@router.patch("/{prayer_id}", response_model=PrayerResponse)
async def mark_prayer_answered(
    prayer_id: str,
    data: MarkAnsweredRequest,
    user: CurrentUser = Depends(get_current_user),
):
    db = await get_db()
    prayer = await mark_answered(db, prayer_id, data.testimony)
    if not prayer:
        raise HTTPException(status_code=404, detail="Prayer not found")
    return _prayer_response(prayer)
```

- [ ] **Step 4: Mount router**

Add to `backend/app/main.py`:
```python
from app.modules.prayer.router import router as prayer_router

app.include_router(prayer_router, prefix="/api")
```

- [ ] **Step 5: Write tests**

`backend/tests/test_prayer.py`:
```python
import pytest
from app.db.mongo import get_db, close_db
from app.modules.prayer.service import create_prayer, get_prayers, pray_with, mark_answered


@pytest.fixture(autouse=True)
async def clean_db():
    db = await get_db()
    await db.prayers.delete_many({})
    yield
    await close_db()


AUTHOR_ID = "665000000000000000000010"


@pytest.mark.asyncio
async def test_create_and_list_prayers():
    db = await get_db()
    await create_prayer(db, AUTHOR_ID, "Pray for healing", False)
    await create_prayer(db, AUTHOR_ID, "Guidance needed", True)
    prayers = await get_prayers(db)
    assert len(prayers) == 2


@pytest.mark.asyncio
async def test_pray_with_increments_count():
    db = await get_db()
    prayer = await create_prayer(db, AUTHOR_ID, "Test prayer", False)
    assert prayer["pray_count"] == 0
    updated = await pray_with(db, str(prayer["_id"]))
    assert updated["pray_count"] == 1
    updated = await pray_with(db, str(prayer["_id"]))
    assert updated["pray_count"] == 2


@pytest.mark.asyncio
async def test_mark_answered_with_testimony():
    db = await get_db()
    prayer = await create_prayer(db, AUTHOR_ID, "Healing prayer", False)
    updated = await mark_answered(db, str(prayer["_id"]), "God healed me!")
    assert updated["status"] == "answered"
    assert updated["testimony"] == "God healed me!"


@pytest.mark.asyncio
async def test_filter_by_status():
    db = await get_db()
    await create_prayer(db, AUTHOR_ID, "Active one", False)
    p2 = await create_prayer(db, AUTHOR_ID, "Will be answered", False)
    await mark_answered(db, str(p2["_id"]), None)

    active = await get_prayers(db, status="active")
    assert len(active) == 1
    answered = await get_prayers(db, status="answered")
    assert len(answered) == 1
```

- [ ] **Step 6: Run tests**

Run: `cd backend && python -m pytest tests/test_prayer.py -v`
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add backend/app/modules/prayer/ backend/tests/test_prayer.py backend/app/main.py
git commit -m "feat: add prayer wall — submit, browse, pray-with, respond, mark answered"
```

---

### Task 8: Basic Giving (One-Time Stripe Payments)

> **Note:** Spec lists `POST /donations` but we use `POST /donations/checkout` (Stripe Checkout Session pattern) + `POST /donations/webhook` (async recording). This is the recommended Stripe integration approach.

**Files:**
- Create: `backend/app/modules/giving/__init__.py`
- Create: `backend/app/modules/giving/models.py`
- Create: `backend/app/modules/giving/service.py`
- Create: `backend/app/modules/giving/router.py`
- Create: `backend/tests/test_giving.py`
- Modify: `backend/app/main.py`

- [ ] **Step 1: Write giving models**

`backend/app/modules/giving/__init__.py`: empty file

`backend/app/modules/giving/models.py`:
```python
from pydantic import BaseModel
from enum import Enum


class DonationType(str, Enum):
    tithe = "tithe"
    offering = "offering"
    love_offering = "love_offering"


class CreateDonationRequest(BaseModel):
    amount_cents: int
    type: DonationType
    pastor_id: str | None = None  # for love offerings


class DonationResponse(BaseModel):
    id: str
    donor_id: str
    pastor_id: str | None
    amount_cents: int
    type: DonationType
    stripe_payment_id: str
    created_at: str


class CreateCheckoutRequest(BaseModel):
    amount_cents: int
    type: DonationType
    pastor_id: str | None = None
    success_url: str
    cancel_url: str


class CheckoutResponse(BaseModel):
    checkout_url: str
    session_id: str
```

- [ ] **Step 2: Write giving service**

`backend/app/modules/giving/service.py`:
```python
import stripe
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
from datetime import datetime, timezone
from app.config import settings

stripe.api_key = settings.stripe_secret_key


async def create_checkout_session(
    amount_cents: int,
    donation_type: str,
    pastor_id: str | None,
    donor_id: str,
    success_url: str,
    cancel_url: str,
) -> stripe.checkout.Session:
    metadata = {
        "donor_id": donor_id,
        "type": donation_type,
    }
    if pastor_id:
        metadata["pastor_id"] = pastor_id

    session = stripe.checkout.Session.create(
        payment_method_types=["card"],
        line_items=[{
            "price_data": {
                "currency": "gbp",
                "product_data": {"name": f"{donation_type.replace('_', ' ').title()}"},
                "unit_amount": amount_cents,
            },
            "quantity": 1,
        }],
        mode="payment",
        success_url=success_url,
        cancel_url=cancel_url,
        metadata=metadata,
    )
    return session


async def record_donation(db: AsyncIOMotorDatabase, donor_id: str, data: dict) -> dict:
    doc = {
        "donor_id": ObjectId(donor_id),
        "pastor_id": ObjectId(data["pastor_id"]) if data.get("pastor_id") else None,
        "campaign_id": None,
        "amount_cents": data["amount_cents"],
        "type": data["type"],
        "is_recurring": False,
        "stripe_payment_id": data["stripe_payment_id"],
        "recurring_donation_id": None,
        "created_at": datetime.now(timezone.utc),
    }
    result = await db.donations.insert_one(doc)
    doc["_id"] = result.inserted_id
    return doc


async def get_giving_history(db: AsyncIOMotorDatabase, donor_id: str) -> list[dict]:
    cursor = db.donations.find({"donor_id": ObjectId(donor_id)}).sort("created_at", -1)
    return await cursor.to_list(length=100)


async def get_received_donations(db: AsyncIOMotorDatabase, pastor_id: str) -> list[dict]:
    cursor = db.donations.find({"pastor_id": ObjectId(pastor_id)}).sort("created_at", -1)
    return await cursor.to_list(length=100)
```

- [ ] **Step 3: Write giving router**

`backend/app/modules/giving/router.py`:
```python
from fastapi import APIRouter, Depends, HTTPException, Request
import stripe
from app.db.mongo import get_db
from app.auth.dependencies import get_current_user, require_role
from app.auth.models import CurrentUser, UserRole
from app.config import settings
from app.modules.giving.models import (
    CreateCheckoutRequest, CheckoutResponse, DonationResponse,
)
from app.modules.giving.service import (
    create_checkout_session, record_donation, get_giving_history, get_received_donations,
)

router = APIRouter(tags=["giving"])


def _donation_response(d: dict) -> DonationResponse:
    return DonationResponse(
        id=str(d["_id"]),
        donor_id=str(d["donor_id"]),
        pastor_id=str(d["pastor_id"]) if d.get("pastor_id") else None,
        amount_cents=d["amount_cents"],
        type=d["type"],
        stripe_payment_id=d.get("stripe_payment_id", ""),
        created_at=d["created_at"].isoformat() if hasattr(d["created_at"], "isoformat") else str(d["created_at"]),
    )


@router.post("/donations/checkout", response_model=CheckoutResponse)
async def create_checkout(
    data: CreateCheckoutRequest,
    user: CurrentUser = Depends(get_current_user),
):
    try:
        session = await create_checkout_session(
            amount_cents=data.amount_cents,
            donation_type=data.type.value,
            pastor_id=data.pastor_id,
            donor_id=user.user_id,
            success_url=data.success_url,
            cancel_url=data.cancel_url,
        )
    except stripe.StripeError as e:
        raise HTTPException(status_code=400, detail=str(e))

    return CheckoutResponse(checkout_url=session.url, session_id=session.id)


@router.post("/donations/webhook")
async def stripe_webhook(request: Request):
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature", "")

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, settings.stripe_webhook_secret,
        )
    except (ValueError, stripe.SignatureVerificationError):
        raise HTTPException(status_code=400, detail="Invalid webhook")

    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        metadata = session.get("metadata", {})
        db = await get_db()
        await record_donation(db, metadata["donor_id"], {
            "amount_cents": session["amount_total"],
            "type": metadata["type"],
            "pastor_id": metadata.get("pastor_id"),
            "stripe_payment_id": session["payment_intent"],
        })

    return {"status": "ok"}


@router.get("/donations/me", response_model=list[DonationResponse])
async def my_giving(user: CurrentUser = Depends(get_current_user)):
    db = await get_db()
    donations = await get_giving_history(db, user.user_id)
    return [_donation_response(d) for d in donations]


@router.get("/donations/received", response_model=list[DonationResponse])
async def received(user: CurrentUser = Depends(require_role(UserRole.pastor))):
    db = await get_db()
    donations = await get_received_donations(db, user.user_id)
    return [_donation_response(d) for d in donations]
```

- [ ] **Step 4: Mount router**

Add to `backend/app/main.py`:
```python
from app.modules.giving.router import router as giving_router

app.include_router(giving_router, prefix="/api")
```

- [ ] **Step 5: Write tests**

`backend/tests/test_giving.py`:
```python
import pytest
from app.db.mongo import get_db, close_db
from app.modules.giving.service import record_donation, get_giving_history


@pytest.fixture(autouse=True)
async def clean_db():
    db = await get_db()
    await db.donations.delete_many({})
    yield
    await close_db()


DONOR_ID = "665000000000000000000010"
PASTOR_ID = "665000000000000000000001"


@pytest.mark.asyncio
async def test_record_and_retrieve_donation():
    db = await get_db()
    donation = await record_donation(db, DONOR_ID, {
        "amount_cents": 5000,
        "type": "tithe",
        "pastor_id": None,
        "stripe_payment_id": "pi_test_123",
    })
    assert donation["amount_cents"] == 5000
    assert donation["type"] == "tithe"

    history = await get_giving_history(db, DONOR_ID)
    assert len(history) == 1


@pytest.mark.asyncio
async def test_love_offering_tracks_pastor():
    db = await get_db()
    donation = await record_donation(db, DONOR_ID, {
        "amount_cents": 2500,
        "type": "love_offering",
        "pastor_id": PASTOR_ID,
        "stripe_payment_id": "pi_test_456",
    })
    assert str(donation["pastor_id"]) == PASTOR_ID
```

- [ ] **Step 6: Run tests**

Run: `cd backend && python -m pytest tests/test_giving.py -v`
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add backend/app/modules/giving/ backend/tests/test_giving.py backend/app/main.py
git commit -m "feat: add giving module — Stripe checkout, webhook, donation history"
```

---

## Chunk 4: Frontend — Shared Components & Landing Pages

### Task 9: Shared Component Library

**Files:**
- Create: `frontend/packages/shared/src/components/Button.tsx`
- Create: `frontend/packages/shared/src/components/Card.tsx`
- Create: `frontend/packages/shared/src/components/Input.tsx`
- Create: `frontend/packages/shared/src/components/Modal.tsx`
- Create: `frontend/packages/shared/src/components/Avatar.tsx`
- Create: `frontend/packages/shared/src/components/Tag.tsx`
- Create: `frontend/packages/shared/src/components/Footer.tsx`
- Create: `frontend/packages/shared/src/components/Input.tsx`
- Create: `frontend/packages/shared/src/components/Modal.tsx`
- Create: `frontend/packages/shared/src/components/Avatar.tsx`
- Create: `frontend/packages/shared/src/components/Tag.tsx`
- Create: `frontend/packages/shared/src/theme.ts`
- Create: `frontend/packages/shared/src/api/client.ts`
- Create: `frontend/packages/shared/src/stores/authStore.ts`
- Modify: `frontend/packages/shared/src/index.ts`

- [ ] **Step 1: Create API client**

`frontend/packages/shared/src/api/client.ts`:
```typescript
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:23052/api';

export const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('mtlbp_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

- [ ] **Step 2: Create auth store**

`frontend/packages/shared/src/stores/authStore.ts`:
```typescript
import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  role: 'pastor' | 'follower' | 'admin';
  firstName: string;
  lastName: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: localStorage.getItem('mtlbp_token'),
  isAuthenticated: !!localStorage.getItem('mtlbp_token'),
  setAuth: (user, token) => {
    localStorage.setItem('mtlbp_token', token);
    set({ user, token, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem('mtlbp_token');
    set({ user: null, token: null, isAuthenticated: false });
  },
}));
```

- [ ] **Step 3: Create theme file**

Extract THEME from `index.ts` into `frontend/packages/shared/src/theme.ts`:
```typescript
export const THEME = {
  colors: {
    cream: '#fdf8f0',
    brownDark: '#3d2518',
    brownMedium: '#5c3d2e',
    brownLight: '#8b6f4e',
    earth: '#d4a574',
    earthLight: '#e8d5b5',
    sand: '#f5ead6',
    sandDark: '#ede0cc',
  },
} as const;
```

- [ ] **Step 4: Create shared UI components**

`frontend/packages/shared/src/components/Button.tsx`:
```typescript
import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({ variant = 'primary', size = 'md', className = '', children, ...props }: ButtonProps) {
  const base = 'font-semibold rounded-lg transition-all duration-200 inline-flex items-center justify-center';
  const sizes = { sm: 'px-4 py-2 text-sm', md: 'px-6 py-3 text-base', lg: 'px-8 py-4 text-lg' };
  const variants = {
    primary: 'bg-brown-medium text-cream hover:bg-brown-dark',
    outline: 'border-2 border-brown-medium text-brown-medium hover:bg-sand',
    ghost: 'text-brown-medium hover:bg-sand',
  };
  return (
    <button className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
```

`frontend/packages/shared/src/components/Card.tsx`:
```typescript
import { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export function Card({ hover = false, className = '', children, ...props }: CardProps) {
  const base = 'bg-white rounded-xl border border-earth-light shadow-sm';
  const hoverClass = hover ? 'transition-all duration-200 hover:-translate-y-1 hover:shadow-md' : '';
  return (
    <div className={`${base} ${hoverClass} ${className}`} {...props}>
      {children}
    </div>
  );
}
```

`frontend/packages/shared/src/components/Input.tsx`:
```typescript
import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && <label className="block text-sm font-medium text-brown-dark mb-1">{label}</label>}
        <input
          ref={ref}
          className={`w-full px-4 py-3 rounded-lg border border-earth-light bg-white text-brown-dark
            placeholder:text-brown-light/50 focus:outline-none focus:ring-2 focus:ring-earth
            focus:border-transparent transition-all ${error ? 'border-red-400' : ''} ${className}`}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';
```

`frontend/packages/shared/src/components/Modal.tsx`:
```typescript
import { ReactNode, useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-brown-dark/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-earth-light">
          <h2 className="font-serif text-xl text-brown-dark">{title}</h2>
          <button onClick={onClose} className="text-brown-light hover:text-brown-dark text-2xl">&times;</button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
```

`frontend/packages/shared/src/components/Avatar.tsx`:
```typescript
interface AvatarProps {
  name: string;
  photoUrl?: string | null;
  size?: 'sm' | 'md' | 'lg';
}

export function Avatar({ name, photoUrl, size = 'md' }: AvatarProps) {
  const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-16 h-16 text-xl' };
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  if (photoUrl) {
    return <img src={photoUrl} alt={name} className={`${sizes[size]} rounded-full object-cover`} />;
  }
  return (
    <div className={`${sizes[size]} rounded-full bg-earth flex items-center justify-center text-white font-semibold`}>
      {initials}
    </div>
  );
}
```

`frontend/packages/shared/src/components/Tag.tsx`:
```typescript
interface TagProps {
  label: string;
  variant?: 'default' | 'active';
}

export function Tag({ label, variant = 'default' }: TagProps) {
  const styles = {
    default: 'bg-sand text-brown-medium',
    active: 'bg-brown-medium text-cream',
  };
  return (
    <span className={`text-xs px-3 py-1 rounded-full font-medium ${styles[variant]}`}>{label}</span>
  );
}
```

`frontend/packages/shared/src/components/Footer.tsx`:
```typescript
export function Footer() {
  return (
    <footer className="bg-brown-dark text-earth-light py-8">
      <div className="max-w-7xl mx-auto px-5 flex justify-between items-center text-sm">
        <span>&copy; 2026 MayTheLordBePraised. All rights reserved.</span>
        <span className="text-brown-light">
          Powered by <a href="https://yensi.solutions" className="text-earth font-semibold hover:text-cream">yensi.solutions</a>
        </span>
      </div>
    </footer>
  );
}
```

- [ ] **Step 5: Export all from index**

Update `frontend/packages/shared/src/index.ts`:
```typescript
export { THEME } from './theme';
export { api } from './api/client';
export { useAuthStore } from './stores/authStore';
export { Button } from './components/Button';
export { Card } from './components/Card';
export { Input } from './components/Input';
export { Modal } from './components/Modal';
export { Avatar } from './components/Avatar';
export { Tag } from './components/Tag';
export { Footer } from './components/Footer';
```

- [ ] **Step 5: Commit**

```bash
cd frontend && git add packages/shared/
git commit -m "feat: add shared component library — Button, Card, Footer, API client, auth store"
```

---

### Task 10: Follower Portal Landing Page

**Files:**
- Create: `frontend/apps/follower-portal/src/pages/Landing.tsx`
- Create: `frontend/apps/follower-portal/src/components/landing/Hero.tsx`
- Create: `frontend/apps/follower-portal/src/components/landing/ServiceGrid.tsx`
- Create: `frontend/apps/follower-portal/src/components/landing/StatsBar.tsx`
- Create: `frontend/apps/follower-portal/src/components/landing/HowItWorks.tsx`
- Create: `frontend/apps/follower-portal/src/components/landing/PastorCards.tsx`
- Create: `frontend/apps/follower-portal/src/components/landing/PrayerPreview.tsx`
- Create: `frontend/apps/follower-portal/src/components/landing/SermonPreview.tsx`
- Create: `frontend/apps/follower-portal/src/components/landing/EventsPreview.tsx`
- Create: `frontend/apps/follower-portal/src/components/landing/Testimonials.tsx`
- Create: `frontend/apps/follower-portal/src/components/landing/GivingSection.tsx`
- Create: `frontend/apps/follower-portal/src/components/layout/LandingNavbar.tsx`
- Modify: `frontend/apps/follower-portal/src/App.tsx`

This task implements the full follower landing page as designed in the visual companion (Layout C — Full-Width Immersive Hero). Each section is its own component. Mobile-first with responsive breakpoints.

- [ ] **Step 1: Create LandingNavbar component**

`LandingNavbar.tsx` — transparent overlay nav with: logo, links (Services, Our Pastors, Prayer Wall, Sermons, Events), Give CTA button. Mobile: hamburger menu with slide-out panel. This is the unauthenticated landing page nav. The authenticated nav (`Navbar.tsx`) is created in Task 15.

- [ ] **Step 2: Create Hero section**

Full-viewport warm gradient hero with cross icon, "May The Lord Be Praised" headline, subtitle, two CTAs (Explore Services, Watch Sermons), Psalm 23:1 scripture at bottom.

- [ ] **Step 3: Create ServiceGrid (5 tiles)**

Icon grid: Counseling, Ceremonies, Prayer Wall, Sermons, Giving. `grid-cols-5` desktop, `grid-cols-3` tablet, `grid-cols-2` mobile.

- [ ] **Step 4: Create StatsBar**

4-column stats: 12+ Pastors, 5,000+ Prayers Answered, 800+ Ceremonies, 24/7 Prayer Support. `grid-cols-4` desktop, `grid-cols-2` mobile.

- [ ] **Step 5: Create HowItWorks (3 steps)**

Choose Service → Select Pastor → Book & Connect. Numbered circles with descriptions.

- [ ] **Step 6: Create PastorCards**

4 pastor cards with photo placeholder, name, role, specialty tags, "Book a Session" CTA. Fetches from `/api/pastors` when API is connected (static placeholder data for now).

- [ ] **Step 7: Create PrayerPreview**

3 prayer cards with left border accent, prayer text, author, "Pray" button with count. Static data initially.

- [ ] **Step 8: Create SermonPreview**

Featured sermon player (dark card with play icon, title, progress bar) + 4 sermon list items.

- [ ] **Step 9: Create EventsPreview**

3 event cards with date bar (day + month), title, description, meta (time, location, spots), RSVP button.

- [ ] **Step 10: Create Testimonials**

Dark section (`bg-brown-dark`), 3 testimonial cards with stars, quote, author avatar+name.

- [ ] **Step 11: Create GivingSection**

Sand background, 6 amount options ($25-$500 + custom), "Give Now" button, impact messaging.

- [ ] **Step 12: Assemble Landing page**

`Landing.tsx` composes all sections in order. Wire into App.tsx with react-router-dom.

- [ ] **Step 13: Verify in browser**

Run: `cd frontend && npm install && npm -w @mtlbp/follower-portal run dev`
Open: `http://localhost:23051`
Verify: All 11 sections render, mobile responsive (resize browser to 375px).

- [ ] **Step 14: Commit**

```bash
git add frontend/apps/follower-portal/
git commit -m "feat: build follower portal landing page — all 11 sections, mobile-first"
```

---

### Task 11: Pastor Portal Landing Page

**Files:**
- Create: `frontend/apps/pastor-portal/src/pages/Landing.tsx`
- Create: `frontend/apps/pastor-portal/src/components/landing/Hero.tsx`
- Create: `frontend/apps/pastor-portal/src/components/landing/DashboardPreview.tsx`
- Create: `frontend/apps/pastor-portal/src/components/landing/Features.tsx`
- Create: `frontend/apps/pastor-portal/src/components/landing/HowItWorks.tsx`
- Create: `frontend/apps/pastor-portal/src/components/landing/Pricing.tsx`
- Create: `frontend/apps/pastor-portal/src/components/landing/CTA.tsx`
- Create: `frontend/apps/pastor-portal/src/components/layout/Navbar.tsx`
- Modify: `frontend/apps/pastor-portal/src/App.tsx`

This implements the pastor-facing landing page as designed (split hero with dashboard preview mockup).

- [ ] **Step 1: Create Navbar**

Transparent nav: logo, Features link, Pricing link, Log In (outline), Start Free (filled).

- [ ] **Step 2: Create DashboardPreview**

Mockup card showing: greeting, 3 stat boxes (Today's Appts: 8, New Prayers: 23, This Week: $2.4k), 3 upcoming appointments. Styled as a floating window with slight perspective rotation.

- [ ] **Step 3: Create Hero**

Split layout: left side = badge ("For Pastors & Ministry Leaders"), headline ("Digitize Your Ministry. Multiply Your Impact."), subtitle, 2 CTAs. Right side = DashboardPreview.

- [ ] **Step 4: Create Features grid (9 cards)**

3-column grid of feature cards: Smart Booking, Prayer Manager, Sermon Library, Ceremony Management, Tithes & Offerings, Ministry Analytics, Community Groups, Event Management, Resource Library. Each with icon, title, description, badge.

- [ ] **Step 5: Create HowItWorks (4 steps)**

4-column: Create Profile → Set Services → Share Link → Grow Ministry. With arrow connectors.

- [ ] **Step 6: Create Pricing (3 tiers)**

Shepherd (Free), Minister ($29/mo, featured), Ministry ($79/mo). Each with feature list and CTA.

- [ ] **Step 7: Create CTA section**

Dark warm gradient: "Your Ministry Deserves More Than a Facebook Page" + CTA button.

- [ ] **Step 8: Assemble Landing page + wire router**

- [ ] **Step 9: Verify in browser**

Run: `cd frontend && npm -w @mtlbp/pastor-portal run dev`
Open: `http://localhost:23050`
Verify: All sections render, mobile responsive.

- [ ] **Step 10: Commit**

```bash
git add frontend/apps/pastor-portal/
git commit -m "feat: build pastor portal landing page — hero, features, pricing, CTA"
```

---

## Chunk 5: Frontend Auth & Dashboard Shell

### Task 12: Frontend Keycloak Auth Flow

**Files:**
- Create: `frontend/packages/shared/src/auth/keycloak.ts`
- Create: `frontend/apps/pastor-portal/src/pages/Login.tsx`
- Create: `frontend/apps/pastor-portal/src/pages/Register.tsx`
- Create: `frontend/apps/follower-portal/src/pages/Login.tsx`
- Create: `frontend/apps/follower-portal/src/pages/Register.tsx`
- Modify: `frontend/packages/shared/src/index.ts`
- Modify both `App.tsx` files

- [ ] **Step 1: Create Keycloak JS adapter wrapper**

`frontend/packages/shared/src/auth/keycloak.ts`:
```typescript
import Keycloak from 'keycloak-js';

const keycloakConfig = {
  url: import.meta.env.VITE_KEYCLOAK_URL || 'http://localhost:23055',
  realm: 'mtlbp',
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID || 'mtlbp-web',
};

export const keycloak = new Keycloak(keycloakConfig);

export async function initKeycloak(): Promise<boolean> {
  const authenticated = await keycloak.init({
    onLoad: 'check-sso',
    silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
  });
  return authenticated;
}

export function login() {
  keycloak.login();
}

export function logout() {
  keycloak.logout();
}

export function getToken(): string | undefined {
  return keycloak.token;
}
```

Add `keycloak-js` to shared `package.json` dependencies.

- [ ] **Step 2: Create pastor Login/Register pages**

Simple forms that redirect to Keycloak login/register. After auth callback, store token in auth store and redirect to dashboard.

- [ ] **Step 3: Create follower Login/Register pages**

Same pattern, but redirects to follower home after auth.

- [ ] **Step 4: Wire protected routes in both App.tsx**

Use react-router-dom with auth guards. Unauthenticated → Landing. Authenticated pastor → Dashboard. Authenticated follower → home feed.

- [ ] **Step 5: Commit**

```bash
git add frontend/
git commit -m "feat: add Keycloak auth flow — login, register, protected routes"
```

---

### Task 13: Pastor Dashboard Shell

**Files:**
- Create: `frontend/apps/pastor-portal/src/components/layout/Sidebar.tsx`
- Create: `frontend/apps/pastor-portal/src/components/layout/TopBar.tsx`
- Create: `frontend/apps/pastor-portal/src/components/layout/DashboardLayout.tsx`
- Create: `frontend/apps/pastor-portal/src/components/layout/MobileNav.tsx`
- Create: `frontend/apps/pastor-portal/src/pages/Dashboard.tsx`
- Create: `frontend/apps/pastor-portal/src/components/dashboard/StatCard.tsx`
- Create: `frontend/apps/pastor-portal/src/components/dashboard/AppointmentList.tsx`
- Create: `frontend/apps/pastor-portal/src/components/dashboard/PrayerAlert.tsx`
- Modify: `frontend/apps/pastor-portal/src/App.tsx`

- [ ] **Step 1: Create DashboardLayout with independently scrollable sidebar**

Per UX preferences: sidebar has its own scroll bar, main content scrolls independently. `overflow-hidden` on parent, `overflow-y-auto` on each panel. Sidebar header ("MayTheLordBePraised") is sticky. Mobile: sidebar collapses, bottom tab nav appears.

`DashboardLayout.tsx`:
```typescript
import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { MobileNav } from './MobileNav';

export function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="h-screen flex overflow-hidden bg-cream">
      {/* Sidebar — desktop only, independently scrollable */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 border-r border-earth-light">
        <Sidebar />
      </div>
      {/* Main content — independently scrollable */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
      {/* Mobile bottom nav */}
      <MobileNav />
    </div>
  );
}
```

- [ ] **Step 2: Create Sidebar**

Navigation items: Dashboard, Bookings, Services, Prayers, Sermons (Phase 2), Events (Phase 2), Giving, Groups (Phase 2), Testimonies (Phase 3), Resources (Phase 3), Profile, Settings. Active item highlighted. Sticky header. `overflow-y-auto` for scrolling.

- [ ] **Step 3: Create TopBar**

Greeting ("Good morning, Pastor James"), notification bell, profile avatar dropdown.

- [ ] **Step 4: Create MobileNav**

Bottom tab bar with 5 icons: Dashboard, Bookings, Prayers, Giving, More. `lg:hidden`.

- [ ] **Step 5: Create Dashboard page**

3 StatCards (Today's Appointments, New Prayers, This Week's Giving) + AppointmentList (today's schedule) + PrayerAlert (unread prayer count). All fetching from API with static fallback data.

- [ ] **Step 6: Wire Dashboard into router**

Add `/dashboard` route wrapped in `DashboardLayout`. Set as default route for authenticated pastors.

- [ ] **Step 7: Verify**

Run: `npm -w @mtlbp/pastor-portal run dev`
Verify: Sidebar scrolls independently. Dashboard stats render. Mobile bottom nav shows at 768px breakpoint.

- [ ] **Step 8: Commit**

```bash
git add frontend/apps/pastor-portal/
git commit -m "feat: add pastor dashboard shell — sidebar, layout, stat cards, mobile nav"
```

---

### Task 14: Pastor Booking & Prayer Management Pages

**Files:**
- Create: `frontend/apps/pastor-portal/src/pages/Bookings.tsx`
- Create: `frontend/apps/pastor-portal/src/pages/Services.tsx`
- Create: `frontend/apps/pastor-portal/src/pages/Prayers.tsx`
- Create: `frontend/apps/pastor-portal/src/pages/Giving.tsx`
- Create: `frontend/apps/pastor-portal/src/stores/bookingStore.ts`
- Create: `frontend/apps/pastor-portal/src/stores/prayerStore.ts`
- Create: `frontend/apps/pastor-portal/src/stores/givingStore.ts`
- Create: `frontend/apps/pastor-portal/src/components/services/ServiceForm.tsx`
- Create: `frontend/apps/pastor-portal/src/components/services/ServiceTable.tsx`
- Create: `frontend/apps/pastor-portal/src/components/booking/BookingCard.tsx`
- Create: `frontend/apps/pastor-portal/src/components/prayer/PrayerInboxCard.tsx`
- Create: `frontend/apps/pastor-portal/src/components/prayer/ResponseForm.tsx`
- Create: `frontend/apps/pastor-portal/src/components/giving/GivingSummary.tsx`
- Create: `frontend/apps/pastor-portal/src/components/giving/DonationTable.tsx`

- [ ] **Step 1: Create Zustand stores**

`bookingStore.ts`: State: `services: Service[]`, `bookings: Booking[]`, `loading: boolean`, `error: string | null`. Actions: `fetchServices()` → `GET /api/pastors/{id}/services`, `createService(data)` → `POST /api/services`, `fetchBookings()` → `GET /api/bookings/me`, `updateBookingStatus(id, status)` → `PATCH /api/bookings/{id}`. All actions call the shared `api` client from `@mtlbp/shared`.

`prayerStore.ts`: State: `prayers: Prayer[]`, `loading`, `error`. Actions: `fetchPrayers()` → `GET /api/prayers`, `respondToPrayer(id, text)` → `POST /api/prayers/{id}/respond`.

`givingStore.ts`: State: `donations: Donation[]`, `loading`, `error`. Actions: `fetchReceived()` → `GET /api/donations/received`.

- [ ] **Step 2: Create Services page**

Layout: page header "My Services" + `<Button>Add Service</Button>` top-right. Below: `<ServiceTable>` — Tailwind `<table>` with columns: Name, Category (`<Tag>`), Duration, Price (formatted as currency, "Free" if 0), Active (toggle switch). Each row has edit/delete actions. `<ServiceForm>` opens in a `<Modal>` with `<Input>` fields for: name, description, category (select dropdown), duration (number), price (number), mode (radio: In-Person/Virtual/Both). Form validates required fields and calls `createService()` on submit.

- [ ] **Step 3: Create Bookings page**

Layout: page header "Bookings" with date filter (today/this week/all). Below: vertical list of `<BookingCard>` components. Each card uses `<Card>` wrapper with: left section (date formatted as "Mon, Mar 15" + time "9:00 AM – 10:00 AM"), center section (follower name, service name as `<Tag>`, mode badge "Virtual"/"In-Person"), right section (status badge color-coded: pending=yellow, confirmed=green, cancelled=red + `<Button variant="outline" size="sm">Confirm</Button>` / `<Button variant="ghost" size="sm">Cancel</Button>` if status is "pending"). Calls `updateBookingStatus()` on action click.

- [ ] **Step 4: Create Prayers inbox page**

Layout: page header "Prayer Requests" with filter tabs (All / New / Responded / Follow-up). Below: vertical list of `<PrayerInboxCard>` components. Each card: left border accent (`border-l-4 border-earth`), prayer text (italic, `text-brown-dark`), meta row (anonymous or author name, date as relative time, pray count with icon), action row: `<Button size="sm">Respond</Button>` opens `<ResponseForm>` below the card (textarea + submit button, calls `respondToPrayer()`), checkbox "Follow-up needed" (calls `PATCH /api/prayers/{id}` with `follow_up_needed: true`). Existing pastor responses shown below prayer text with pastor name and response text.

- [ ] **Step 5: Create Giving dashboard page**

Layout: `<GivingSummary>` at top — 3 `<StatCard>` components in a row: "Total Received" (sum all amounts), "This Week" (last 7 days), "Love Offerings" (filtered by type). Below: `<DonationTable>` — Tailwind `<table>` with columns: Date (formatted), Amount (currency), Type (`<Tag>`), Donor (name or "Anonymous"). Sort by date descending. Pagination: "Load more" button if > 20 results.

- [ ] **Step 6: Wire all pages into router**

Add routes within `DashboardLayout`: `/services` → Services, `/bookings` → Bookings, `/prayers` → Prayers, `/giving` → Giving. Update `Sidebar.tsx` to use `NavLink` from react-router-dom with `className` callback for active state highlighting (`bg-sand text-brown-dark font-semibold` when active).

- [ ] **Step 7: Verify all pages render with API calls**

Run: `npm -w @mtlbp/pastor-portal run dev`
Navigate to each route and verify: tables render (with empty state messages if no data), forms open in modals, filters switch content, API calls visible in browser network tab.

- [ ] **Step 8: Commit**

```bash
git add frontend/apps/pastor-portal/
git commit -m "feat: add pastor management pages — services, bookings, prayers, giving"
```

---

### Task 15: Follower Portal — Browse, Book, Pray, Give

**Files:**
- Create: `frontend/apps/follower-portal/src/pages/Pastors.tsx`
- Create: `frontend/apps/follower-portal/src/pages/PastorProfile.tsx`
- Create: `frontend/apps/follower-portal/src/pages/BookService.tsx`
- Create: `frontend/apps/follower-portal/src/pages/PrayerWall.tsx`
- Create: `frontend/apps/follower-portal/src/pages/Give.tsx`
- Create: `frontend/apps/follower-portal/src/pages/MyBookings.tsx`
- Create: `frontend/apps/follower-portal/src/pages/MyGiving.tsx`
- Create: `frontend/apps/follower-portal/src/pages/Profile.tsx`
- Create: `frontend/apps/follower-portal/src/components/layout/Navbar.tsx` (authenticated version, different from LandingNavbar)
- Create: `frontend/apps/follower-portal/src/components/layout/MobileNav.tsx`
- Create: `frontend/apps/follower-portal/src/components/pastor/PastorCard.tsx`
- Create: `frontend/apps/follower-portal/src/components/pastor/PastorFilter.tsx`
- Create: `frontend/apps/follower-portal/src/components/booking/BookingWizard.tsx`
- Create: `frontend/apps/follower-portal/src/components/booking/DatePicker.tsx`
- Create: `frontend/apps/follower-portal/src/components/prayer/PrayerCard.tsx`
- Create: `frontend/apps/follower-portal/src/components/prayer/PrayerForm.tsx`
- Create: `frontend/apps/follower-portal/src/components/giving/AmountSelector.tsx`
- Create: `frontend/apps/follower-portal/src/stores/pastorStore.ts`
- Create: `frontend/apps/follower-portal/src/stores/bookingStore.ts`
- Create: `frontend/apps/follower-portal/src/stores/prayerStore.ts`

- [ ] **Step 1: Create Zustand stores**

`pastorStore.ts`: State: `pastors: Pastor[]`, `selectedPastor: Pastor | null`, `loading`, `error`. Actions: `fetchPastors(filters?)` → `GET /api/pastors`, `fetchPastor(id)` → `GET /api/pastors/{id}`.

`bookingStore.ts`: State: `services: Service[]`, `myBookings: Booking[]`, `loading`, `error`. Actions: `fetchServices(pastorId)` → `GET /api/pastors/{id}/services`, `createBooking(data)` → `POST /api/bookings`, `fetchMyBookings()` → `GET /api/bookings/me`.

`prayerStore.ts`: State: `prayers: Prayer[]`, `loading`, `error`. Actions: `fetchPrayers(status?)` → `GET /api/prayers`, `submitPrayer(text, isAnonymous)` → `POST /api/prayers`, `prayWith(id)` → `POST /api/prayers/{id}/pray`.

- [ ] **Step 2: Create authenticated Navbar**

`Navbar.tsx` — cream background with bottom border. Left: logo (links to `/`). Center: nav links (Pastors, Prayer Wall, Give). Right: `<Avatar>` with dropdown menu (My Bookings, My Giving, Profile, Logout). Mobile: hamburger menu replaces center links. This is different from `LandingNavbar.tsx` (transparent, no auth state).

- [ ] **Step 3: Create Pastors browse page**

Layout: top section with `<PastorFilter>` — search input (by name) + specialty tag filters (clickable `<Tag>` components: Marriage, Youth, Grief, etc., toggleable). Below: responsive grid (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6`) of `<PastorCard>` components. Each card: `<Card hover>` wrapping `<Avatar size="lg">` at top, pastor name (font-serif), role subtitle, specialty tags row, `<Button variant="outline" size="sm">View Profile</Button>`. Calls `fetchPastors()` on mount, filters client-side by specialty tag selection.

- [ ] **Step 4: Create PastorProfile page**

Route: `/pastors/:id`. Layout: top banner with warm gradient background + `<Avatar size="lg">` + name + role. Below in two columns (stacked on mobile): left (2/3 width) — bio section (rendered markdown-safe text), ministry background section, list of services as `<Card>` items each showing: service name, category `<Tag>`, duration, price (or "Free"), mode badges, `<Button>Book This Service</Button>` (links to `/book/:pastorId/:serviceId`). Right (1/3 width) — specialty tags, "Book a Session" CTA card.

- [ ] **Step 5: Create BookService page**

Route: `/book/:pastorId/:serviceId`. `<BookingWizard>` manages 3 steps via local state (`step: 1 | 2 | 3`):

**Step 1 — Service Confirmation:** Show selected service details (name, duration, price, mode). Confirm and proceed button.

**Step 2 — Pick Date/Time:** `<DatePicker>` — simple calendar grid showing next 30 days. Highlight available dates (mock all weekdays as available for MVP). Below calendar: time slots as clickable buttons (`grid-cols-3 gap-2`), each showing "9:00 AM", "10:00 AM", etc. based on service duration. Selected slot highlighted with `bg-brown-medium text-cream`.

**Step 3 — Confirm:** Summary card showing: pastor name, service, date, time, mode selector (In-Person/Virtual radio buttons). `<Button>Confirm Booking</Button>` → calls `createBooking()` → shows success modal with booking ID and "Add to Calendar" link.

Navigation: "Back" button on steps 2-3, progress indicator (3 circles) at top. All form elements full-width on mobile.

- [ ] **Step 6: Create PrayerWall page**

Layout: top section — `<PrayerForm>` card with textarea (`placeholder="Share your prayer request..."`), `<Input type="checkbox">` for anonymous toggle, `<Button>Submit Prayer</Button>`. Calls `submitPrayer()`.

Below: filter tabs row (`All | Active | Answered`) as clickable text links with active underline. Then vertical feed of `<PrayerCard>` components. Each card: `<Card>` with left border accent (`border-l-4 border-earth`), prayer text (italic), meta row (author name or "Anonymous", relative time, pray count), `<button className="text-sm bg-sand px-3 py-1 rounded-full">🙏 Pray ({count})</button>` — calls `prayWith(id)` and optimistically increments count. Answered prayers show testimony text below in green-tinted card section.

- [ ] **Step 7: Create Give page**

Layout: centered card (max-w-lg) with scripture quote at top ("2 Corinthians 9:7"). `<AmountSelector>`: grid of 6 preset amount buttons ($25, $50, $100, $250, $500, Custom) as `grid-cols-3 gap-3`. Each is a bordered div, selected state: `border-brown-medium bg-sand`. Custom option shows `<Input type="number">` when selected.

Below: donation type select dropdown (Tithe, Offering, Love Offering). If "Love Offering" selected, show pastor dropdown (fetched from `GET /api/pastors`, rendered as select with pastor names).

`<Button size="lg" className="w-full mt-6">Give Now</Button>` → calls `POST /api/donations/checkout` with `{ amount_cents, type, pastor_id, success_url: window.location.origin + '/give/success', cancel_url: window.location.origin + '/give' }` → redirects to `checkout_url` from response (Stripe hosted checkout page).

- [ ] **Step 8: Create MyBookings and MyGiving history pages**

`MyBookings.tsx`: page header "My Bookings". List of `<Card>` items showing: date + time, pastor name (`<Avatar size="sm">` + name), service name, status badge (color-coded), cancel button (if status is "pending"). Fetches from `GET /api/bookings/me`.

`MyGiving.tsx`: page header "My Giving". Summary stat at top (total given). Table: Date, Amount, Type, Receipt link. Fetches from `GET /api/donations/me`.

`Profile.tsx`: page header "My Profile". Form with `<Input>` fields: first name, last name, email (disabled), phone. `<Button>Save Changes</Button>`.

- [ ] **Step 9: Wire all routes**

Routes within authenticated layout: `/pastors` → Pastors, `/pastors/:id` → PastorProfile, `/book/:pastorId/:serviceId` → BookService, `/prayer-wall` → PrayerWall, `/give` → Give, `/my-bookings` → MyBookings, `/my-giving` → MyGiving, `/profile` → Profile. Default route for authenticated followers: `/pastors`.

- [ ] **Step 10: Verify end-to-end flows in browser**

Run: `npm -w @mtlbp/follower-portal run dev`
Test flows: browse pastors → view profile → book service (3-step wizard) → see in My Bookings. Submit prayer → see on wall → pray with. Navigate to Give page → select amount → verify checkout redirect params.

- [ ] **Step 11: Commit**

```bash
git add frontend/apps/follower-portal/
git commit -m "feat: add follower portal pages — browse, book, pray, give"
```

---

### Task 16: Final Integration & Smoke Test

**Files:**
- Modify: `docker-compose.yml` (add frontend Dockerfiles)
- Create: `frontend/apps/pastor-portal/Dockerfile`
- Create: `frontend/apps/follower-portal/Dockerfile`

- [ ] **Step 1: Create frontend development Dockerfiles**

Both use Node 20 alpine, install deps, run vite dev server (not production build) with appropriate port. These are development-only Dockerfiles with hot reload via volume mounts.

- [ ] **Step 2: Run full stack**

```bash
docker compose up --build
```

- [ ] **Step 3: Smoke test all endpoints**

Verify:
- `http://localhost:23050` — Pastor landing page renders
- `http://localhost:23051` — Follower landing page renders
- `http://localhost:23052/health` — API health check
- `http://localhost:23052/docs` — Swagger UI shows all routes
- `http://localhost:23055` — Keycloak admin console

- [ ] **Step 4: Run all backend tests**

```bash
cd backend && python -m pytest tests/ -v --cov=app
```

Expected: All tests pass, coverage report generated.

- [ ] **Step 5: Commit**

```bash
git add docker-compose.yml frontend/apps/pastor-portal/Dockerfile frontend/apps/follower-portal/Dockerfile
git commit -m "feat: complete Phase 1 MVP — full stack integration"
```

---

## Summary

| Chunk | Tasks | What It Delivers |
|-------|-------|-----------------|
| 1 | 1-4 | Docker Compose, DB, Keycloak auth, registration API |
| 2 | 5-6 | Pastor profiles CRUD, service definitions, booking engine |
| 3 | 7-8 | Prayer wall (full CRUD), basic Stripe giving |
| 4 | 9-11 | Shared components, both landing pages |
| 5 | 12-16 | Frontend auth, dashboard, management pages, follower pages, integration |

**Total:** 16 tasks across 5 chunks. Each task produces a working, testable, committable increment.
