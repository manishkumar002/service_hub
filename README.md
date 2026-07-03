# ServiceHub

Home services marketplace — Node.js backend + React (Vite) frontend with React Bootstrap.

## Quick start (one command)

```bash
npm run install:all
npm run dev:all
```

- **Backend:** http://localhost:8080 (see `Backend/.env` `PORT`)  
- **Frontend:** http://localhost:5173  

Ensure MongoDB is running and `Backend/.env` is configured (`PORT`, `MONGODB_URI`, `JWT_SECRET`).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev:all` | Run backend + frontend together |
| `npm run dev:server` | Backend only |
| `npm run dev:client` | Frontend only |
| `npm run install:all` | Install root + frontend dependencies |

## Features (frontend ↔ API)

- Register / Login / Profile
- Browse & post jobs (client)
- Apply on jobs (provider)
- Categories, chat, reviews, payments, subscription
