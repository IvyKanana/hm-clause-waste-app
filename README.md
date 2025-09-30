# H.M. CLAUSE — Waste Collection App (PWA)

This repository includes a mobile-first Progressive Web App (PWA) frontend and a Node/Express backend
to generate a PDF receipt and email it to both the client and Polypac (polypacrecords@gmail.com).

## What this package contains
- frontend/: React + Vite PWA-ready frontend
- backend/: Node + Express server that generates the PDF (pdfkit) and sends email (nodemailer)
- .env.example for SMTP settings

## Quick start (local)
1. Backend:
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # set SMTP_USER and SMTP_PASS in .env (SendGrid or SMTP)
   node server.js
   ```
2. Frontend:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
3. Open frontend on your phone using your machine's local IP + port 5173 (same Wi-Fi). Submit a form
   and check email for both the client address you used and polypacrecords@gmail.com.

## Deployment
- Frontend: Vercel or Netlify (set build command `npm run build`)
- Backend: Render, Heroku, or Vercel Serverless (set environment variables for SMTP)
