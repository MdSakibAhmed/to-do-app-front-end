# Taskr — React + Vite Todo App

A minimal, keyboard-friendly task manager built with React + Vite. Comes with a full Docker setup and GitHub Actions CI/CD pipeline.

---

## Tech Stack

- **Frontend**: React 18 + Vite 5
- **Styling**: CSS Modules
- **Persistence**: localStorage
- **Server**: nginx (production)
- **Container**: Docker (multi-stage build)
- **CI/CD**: GitHub Actions

---

## Local Development

### Without Docker

```bash
npm install
npm run dev        # http://localhost:5173
```

### With Docker (hot reload)

```bash
docker compose --profile dev up
# http://localhost:5173
```

---

## Production Build

### Without Docker

```bash
npm run build
npm run preview
```

### With Docker

```bash
docker compose --profile prod up --build
# http://localhost:80
```

---

## CI/CD Pipeline

The GitHub Actions workflow runs four jobs:

| Job | Trigger | What it does |
|---|---|---|
| **Lint & Test** | Every push / PR | Runs ESLint + Vitest |
| **Build** | After lint passes | Builds bundle, uploads artifact |
| **Docker** | Push to `main` | Builds multi-arch image → GHCR |
| **Deploy** | After Docker job | SSH-deploys to your server |

### Required GitHub Secrets

Go to **Settings → Secrets and variables → Actions**:

| Secret | Description |
|---|---|
| `SSH_HOST` | Production server IP / hostname |
| `SSH_USER` | SSH username (e.g. `ubuntu`) |
| `SSH_PRIVATE_KEY` | Full private key (`-----BEGIN...`) |

### Required GitHub Variables

| Variable | Description |
|---|---|
| `DEPLOY_URL` | Your app's public URL |

---

## Project Structure

```
todo-app/
├── .github/workflows/ci-cd.yml   # CI/CD pipeline
├── src/
│   ├── components/               # UI components
│   ├── hooks/useTodos.js         # State + localStorage
│   ├── styles/globals.css
│   ├── App.jsx
│   └── main.jsx
├── Dockerfile                    # Multi-stage production build
├── Dockerfile.dev                # Dev with hot reload
├── docker-compose.yml            # Dev + prod profiles
├── nginx.conf                    # SPA routing + security headers
└── vite.config.js
```
