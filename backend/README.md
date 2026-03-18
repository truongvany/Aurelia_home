# Aurelia Homme Backend

MVC backend built with Express + TypeScript + MongoDB.

## Setup

1. Install dependencies:
   npm install
2. Copy env file:
   cp .env.example .env
3. Run dev server:
   npm run dev
4. Seed data:
   npm run seed

## Environment variables

- MONGODB_URI (required)
- JWT_SECRET (required)
- GEMINI_API_KEY (recommended for AI assistant response generation)
- CORS_ORIGIN (optional, default: http://localhost:3000)

## API base

- /api/v1
- Health: GET /health
