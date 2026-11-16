# Aurelia Homme

Aurelia Homme is a luxury men's fashion e-commerce application with a minimalist, editorial-inspired interface and a TypeScript/Express backend.

## Features

- Product browsing and category-based discovery
- Customer authentication and account flows
- Shopping and purchase-related experiences
- MongoDB-backed product, user, category, and points data
- AI assistant integration through the backend
- Cloudinary integration for media management
- Dark, architectural visual system with warm gold accents

## Tech stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS, React Router, Motion, Lucide React
- **Backend:** Node.js, Express, TypeScript, MongoDB, Mongoose, JWT
- **Services:** Cloudinary and Gemini/Groq-compatible AI integrations

## Project structure

```text
.
├── frontend/   # React + Vite web application
├── backend/    # Express API and MongoDB integration
├── DESIGN.md   # UI and design-system guidelines
├── code.html   # Design/prototype reference
└── screen.png  # Project preview
```

## Requirements

- Node.js 18+
- npm
- MongoDB (local instance or hosted deployment)

## Local development

### 1. Start the backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

The API runs on `http://localhost:5000` by default, with routes under `/api/v1`.

### 2. Start the frontend

In another terminal:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

The frontend runs on `http://localhost:3000` by default.

Set `VITE_API_BASE_URL` in `frontend/.env` to the backend API URL, for example:

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

## Backend commands

Run these from `backend/`:

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server with watch mode |
| `npm run build` | Compile the backend |
| `npm start` | Start the compiled backend |
| `npm run lint` | Type-check the backend |
| `npm run seed:all` | Seed users, categories, and products |

## Frontend commands

Run these from `frontend/`:

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Build the frontend for production |
| `npm run preview` | Preview the production build |
| `npm run lint` | Type-check the frontend |

## Environment variables

Backend configuration is documented in `backend/.env.example`, including the MongoDB connection, JWT settings, CORS origin, and AI integration key. Frontend configuration is documented in `frontend/.env.example`.

Never commit real credentials or production secrets to the repository.

## Design

The visual direction is documented in [DESIGN.md](./DESIGN.md). It follows an architectural-minimalist approach: dark tonal surfaces, editorial typography, restrained gold accents, generous spacing, and sharp corners.