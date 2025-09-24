# Suncool - MERN Temperature Dashboard

A simple MERN web app to log and visualize body temperature across the day or week, with authentication.

## Requirements
- Node.js 18+
- MongoDB running locally (or a connection string)

## Backend (server)
1. Install deps:
   - `cd server`
   - `npm install`
2. Create `.env` in `server/` (see below):
   - `PORT=4000`
   - `MONGO_URI=mongodb://127.0.0.1:27017/suncool`
   - `JWT_SECRET=change_me`
3. Run dev API:
   - `npm run dev`
4. API base: `http://localhost:4000/api`

## Frontend (client)
1. Install deps:
   - `cd client`
   - `npm install`
2. Start dev server:
   - `npm run dev`
3. App: open `http://localhost:5173`

Vite is configured to proxy `/api` to `http://localhost:4000`.

## Features
- Signup/Login (JWT)
- Add temperature logs with optional note
- List recent logs
- Chart averages (hourly for current day; daily for last 7 days)

## Folder Structure
- `server/` Express + MongoDB
- `client/` React + Vite + Recharts

## Notes
- For production, set strong `JWT_SECRET` and proper CORS.
- Adjust chart y-axis domain based on your expected temperature range.
