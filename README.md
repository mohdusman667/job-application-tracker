# Job Application Tracker

A full-stack MERN app for organizing job applications, tracking progress, and preparing for interviews.

**Live demo:** https://job-application-tracker-ten-ecru.vercel.app

> The backend runs on a free hosting plan, so the first request after a quiet period can take 30 to 60 seconds. Create your own account to try it. Your data is private to your account.

## Features

- **Accounts:** register and log in, with each user seeing only their own applications
- **Track applications:** company, job title, location, job link, status, description, and notes
- **Pipeline views:** switch between a list and a drag-and-drop board
- **Follow-up reminders:** set follow-up dates and filter by overdue, due today, or upcoming
- **Search, filter, and sort** by status, follow-up date, or application date
- **CSV import and export** for your applications
- **AI job analyzer:** paste a job description and your skills to get a role summary, a job-fit score, skill gaps, and likely interview questions
- **AI follow-up emails:** draft a polite follow-up email for any application

## Tech stack

- **Frontend:** React and Vite
- **Backend:** Node.js and Express
- **Database:** MongoDB Atlas with Mongoose
- **Auth:** JSON Web Tokens and bcrypt password hashing
- **AI:** Google Gemini, called from the backend
- **Hosting:** Vercel (frontend) and Render (backend)

## Run locally

### Prerequisites

- Node.js 20 or newer
- A free MongoDB Atlas cluster
- A Gemini API key

### Backend

```bash
cd server
npm install
```

Create `server/.env`:

```text
MONGO_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
JWT_SECRET=a_long_random_string
```

Then start the server:

```bash
node index.js
```

### Frontend

```bash
cd client
npm install
```

Create `client/.env.local`:

```text
VITE_API_URL=http://localhost:5000/api
```

Then start the app:

```bash
npm run dev
```

Open http://localhost:5173 and create an account.

## Security notes

- Passwords are hashed with bcrypt and never stored in plain text.
- API routes require a valid login token, and each query is scoped to the logged-in user.
- Secrets live in `.env` files, which are excluded from git.