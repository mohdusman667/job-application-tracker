# Job Application Tracker

A MERN stack app for organizing job applications, tracking progress, and preparing for interviews.

## Current features

- Add applications with company, title, location, job link, status, description, and notes
- Search applications by company or job title
- Update an application’s status
- Delete an application
- View a dashboard summary

## AI job description analyzer

- Paste a public job description to get an AI summary, key skills, main responsibilities, and three likely interview questions.
- The analyzer uses Gemini through the backend. Keep `GEMINI_API_KEY` private in `server/.env`.
## Tech stack

- React and Vite
- Node.js and Express
- MongoDB Atlas and Mongoose

## Run locally

### Backend

Create a `server/.env` file containing your private MongoDB connection string:

```text
MONGO_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key