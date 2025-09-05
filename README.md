# Mini Analytics Dashboard (MERN, TypeScript)

## Prerequisites
- Node.js 20+
- MongoDB running locally (or supply `MONGO_URI`)

## Backend
```bash
cd backend
cp .env.example .env  # then adjust values
npm run dev           # dev
npm run build && npm start  # production
```

## Frontend
```bash
cd frontend
cp .env.example .env  # optional; defaults to http://localhost:4000/api
npm run dev
```

## API Summary
- POST `/api/posts` { title, content, author }
- POST `/api/posts/:id/comments` { text, commenter }
- GET `/api/posts` query: `page`, `limit`, `author`, `q`
- GET `/api/analytics/top-authors`
- GET `/api/analytics/top-commented`
- GET `/api/analytics/posts-per-day`
