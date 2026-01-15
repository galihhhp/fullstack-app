# Task Services React App Monorepo

A modern fullstack monorepo: **ElysiaJS + Bun** for task services, **Fastify + Node.js** for user services, **React + Vite** for the frontend. Containerized, production-ready, and feature-flagged for easy extensibility.

---

## 🏗️ Project Structure

```
task-services-react-app/
├── task-services/      # ElysiaJS + Bun backend (Task API, DB, logging)
├── user-services/     # Fastify + Node.js backend (User API, DB, metrics)
├── react-frontend/    # React + Vite frontend (SPA, API integration)
└── README.md          # ← You are here
```

---

## ✨ Features

- **Fullstack, Modular**: Clean separation of backend services and frontend.
- **Microservices Architecture**: Separate task-services and user-services backends.
- **Containerized**: Dockerfiles for all services, ready for CI/CD.
- **Feature Flags**: Enable/disable edit & delete task features via env.
- **Structured Logging**: Winston for task-services, Fastify logger for user-services.
- **Prometheus Metrics**: Both backends expose `/metrics` endpoints for monitoring.
- **PostgreSQL Ready**: Connection pooling, env-configurable table/column names.
- **Modern Frontend**: React, Vite, TypeScript, mobile-first, accessible.

---

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (for backend dev)
- [Node.js](https://nodejs.org/) (for frontend dev)
- [Docker](https://www.docker.com/) (for container builds)

---

## 🛠️ Backend Services

### Task Services (task-services)

Task management API built with ElysiaJS and Bun.

#### Setup

```bash
cd task-services
bun install
cp .env.example .env # Edit as needed
```

#### Environment Variables

| Variable            | Description                             | Default     |
| ------------------- | --------------------------------------- | ----------- |
| NODE_ENV            | production/development                  | development |
| DB_HOST             | Database host                           | localhost   |
| DB_PORT             | Database port                           | 5432        |
| DB_USER             | Database username                       | postgres    |
| DB_PASSWORD         | Database password                       | ""          |
| DB_NAME             | Database name                           | postgres    |
| DB_TABLE            | Table name for tasks                    | main_table  |
| DB_COLUMN_ID        | ID column name                          | id          |
| DB_COLUMN_TASK      | Task column name                        | task        |
| FEATURE_EDIT_TASK   | Enable edit task API ("true"/"false")   | false       |
| FEATURE_DELETE_TASK | Enable delete task API ("true"/"false") | false       |
| FEATURE_REDIS_CACHE | Enable Redis caching ("true"/"false")    | false       |
| REDIS_HOST          | Redis host                              | localhost   |
| REDIS_PORT          | Redis port                              | 6379        |
| REDIS_PASSWORD      | Redis password (optional)                | ""          |
| REDIS_TTL           | Cache TTL in seconds                    | 60          |

#### Scripts

- **Dev:** `bun run dev`
- **Prod:** `bun start`

#### Docker

```bash
cd task-services
docker build -t your-dockerhub-username/task-services:latest .
docker run -d \
  --name task-services-app \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e DB_HOST=your-db-host \
  -e DB_PORT=5432 \
  -e DB_USER=postgres \
  -e DB_PASSWORD=yourpassword \
  -e DB_NAME=postgres \
  -e DB_TABLE=main_table \
  -e DB_COLUMN_ID=id \
  -e DB_COLUMN_TASK=task \
  -e FEATURE_EDIT_TASK=true \
  -e FEATURE_DELETE_TASK=true \
  -e FEATURE_REDIS_CACHE=true \
  -e REDIS_HOST=redis \
  -e REDIS_PORT=6379 \
  -e REDIS_TTL=60 \
  your-dockerhub-username/task-services:latest
```

#### API Endpoints

- `GET /` — Welcome message
- `GET /tasks` — List all tasks
- `GET /tasks/:id` — Get task by ID
- `POST /tasks` — Add a task `{ task: string }`
- `PUT /tasks/:id` — Edit a task (if enabled)
- `DELETE /tasks/:id` — Delete a task (if enabled)
- `GET /metrics` — Prometheus metrics endpoint
- `GET /health/redis` — Redis health check endpoint

---

### User Services (user-services)

User management API built with Fastify and Node.js.

#### Setup

```bash
cd user-services
pnpm install
cp .env.example .env # Edit as needed
```

#### Environment Variables

| Variable                  | Description                             | Default     |
| ------------------------- | --------------------------------------- | ----------- |
| USER_SERVICE_PORT         | Service port                            | 4000        |
| USER_SERVICE_HOST         | Service host                            | 0.0.0.0     |
| DB_HOST                   | Database host                           | localhost   |
| DB_PORT                   | Database port                           | 5432        |
| DB_USER                   | Database username                       | postgres    |
| DB_PASSWORD               | Database password                       | ""          |
| DB_NAME                   | Database name                           | postgres    |
| DB_USERS_TABLE            | Table name for users                    | users       |
| DB_USERS_COLUMN_ID        | ID column name                          | id          |
| DB_USERS_COLUMN_EMAIL     | Email column name                       | email       |
| DB_USERS_COLUMN_NAME      | Name column name                        | name        |
| FEATURE_REDIS_CACHE       | Enable Redis caching ("true"/"false")    | false       |
| REDIS_HOST                | Redis host                              | localhost   |
| REDIS_PORT                | Redis port                              | 6379        |
| REDIS_PASSWORD            | Redis password (optional)                | ""          |
| REDIS_TTL                 | Cache TTL in seconds                    | 60          |

#### Scripts

- **Dev:** `pnpm run dev`
- **Build:** `pnpm run build`
- **Start:** `pnpm start`

#### Docker

```bash
cd user-services
docker build -t your-dockerhub-username/user-services:latest .
docker run -d \
  --name user-services-app \
  -p 4000:4000 \
  -e DB_HOST=your-db-host \
  -e DB_PORT=5432 \
  -e DB_USER=postgres \
  -e DB_PASSWORD=yourpassword \
  -e DB_NAME=postgres \
  -e DB_USERS_TABLE=users \
  -e DB_USERS_COLUMN_ID=id \
  -e DB_USERS_COLUMN_EMAIL=email \
  -e DB_USERS_COLUMN_NAME=name \
  -e FEATURE_REDIS_CACHE=true \
  -e REDIS_HOST=redis \
  -e REDIS_PORT=6379 \
  -e REDIS_TTL=60 \
  your-dockerhub-username/user-services:latest
```

#### API Endpoints

- `GET /` — Welcome message
- `GET /users` — List all users
- `GET /users/:id` — Get user by ID
- `POST /users` — Create a user `{ email: string, name: string }`
- `PUT /users/:id` — Update a user `{ email: string, name: string }`
- `DELETE /users/:id` — Delete a user
- `GET /metrics` — Prometheus metrics endpoint

---

## 🖥️ Frontend (react-frontend)

### Setup

```bash
cd react-frontend
bun install # or npm install
touch .env # or use .env.example if available
```

### Environment Variables (runtime)

| Variable                 | Description                            | Default |
| ------------------------ | -------------------------------------- | ------- |
| VITE_FEATURE_EDIT_TASK   | Enable edit task UI ("true"/"false")   | false   |
| VITE_FEATURE_DELETE_TASK | Enable delete task UI ("true"/"false") | false   |

### Runtime Config

- API URL dan feature flag di-load dari `/config.json` saat container start. File ini otomatis digenerate dari env oleh entrypoint.
- Contoh `/config.json` yang dihasilkan:

```json
{
  "apiUrl": "http://localhost:3000",
  "featureEditTask": "true",
  "featureDeleteTask": "true"
}
```

### Scripts

- **Dev:** `bun run dev` or `npm run dev`
- **Build:** `bun run build` or `npm run build`
- **Preview:** `bun run preview` or `npm run preview`

### Docker

```bash
cd react-frontend
docker build -t your-dockerhub-username/react-frontend:latest .
docker run -d \
  --name react-frontend \
  -p 80:80 \
  -e VITE_FEATURE_EDIT_TASK=true \
  -e VITE_FEATURE_DELETE_TASK=true \
  -e API_URL=http://localhost:3000 \
  your-dockerhub-username/react-frontend:latest
```

---

## 🧩 Feature Flags

### Edit & Delete Features
- **Backend:**
  - Set `FEATURE_EDIT_TASK` dan `FEATURE_DELETE_TASK` di env ("true" untuk enable)
- **Frontend:**
  - Set `VITE_FEATURE_EDIT_TASK` dan `VITE_FEATURE_DELETE_TASK` di env runtime ("true" untuk enable)
  - UI hanya akan menampilkan fitur edit/delete jika env aktif saat container dijalankan

### Redis Caching
- **Both Services (task-services & user-services):**
  - Set `FEATURE_REDIS_CACHE=true` untuk enable Redis caching
  - Set `FEATURE_REDIS_CACHE=false` atau omit untuk disable (default: false)
  - Jika disabled, aplikasi langsung query database tanpa cache
  - Jika enabled tapi Redis down, aplikasi akan fallback ke database (graceful degradation)
  - Health check: `GET /health/redis` untuk cek status Redis

---

## ⚙️ CI/CD

- GitHub Actions workflow for automated Docker build & push on push to main/master/develop branches
- Images are tagged with version from `package.json` (e.g., `2.0.0`) plus SHA and `latest` tag
- Add Docker Hub secrets (`DOCKER_USERNAME`, `DOCKER_PASSWORD`) to GitHub repository for automated publishing

---

## 🤝 Contributing

PRs welcome! Please open issues for bugs/feature requests.

---

## License

MIT
