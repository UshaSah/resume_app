# Resume Builder – React + Node/Express + MongoDB + AWS

Modern resume builder with a React (Vite) frontend and a Node/Express backend using MongoDB Atlas for persistence. Deployed to AWS EC2 and managed via PM2. Includes a Resume Selector page to browse saved resumes and a form to create/update them.

## Features
- React (Vite) SPA with form-driven resume creation
- Resume preview and PDF export
- Node/Express REST API with CRUD for resumes
- MongoDB Atlas persistence (single collection: `resumes`)
- Resume Selector page: dropdown + preview of selected resume
- Deployable to EC2 with PM2; optional GitHub Actions workflow

## Tech Stack
- Frontend: React, Vite, CSS
- Backend: Node.js, Express.js
- Database: MongoDB Atlas (`mongodb` Node driver)
- Infra: AWS EC2, PM2 (process manager)

## Monorepo Layout
```
resume_app/
  ├─ src/                 # React app source
  ├─ public/              # Static assets for Vite
  ├─ backend/             # Express server and DB connector
  ├─ .github/workflows/   # (Optional) CI/CD to EC2
  └─ README.md            # This file
```

## Prerequisites
- Node.js 18+
- npm 9+
- MongoDB Atlas cluster and connection string
- EC2 instance (Amazon Linux) if deploying

## Environment Variables
Set these on your EC2 (and locally via shell or `.env` if you add dotenv):
- `PORT`: Backend port (e.g., `3000`)
- `MONGODB_URI`: Your MongoDB Atlas connection string
- `JWT_SECRET`: (Future) for auth when implemented

## Local Development
1) Install frontend deps and run Vite dev server
```
cd resume_app
npm install
npm run dev
```

2) Install backend deps and run the API (in a separate terminal)
```
cd backend
npm install
PORT=3000 node server.js
```

3) Configure the frontend API base URL
- In `src/App.jsx`, set `API_BASE_URL` to your backend (e.g., `http://localhost:3000`).

## Build Frontend
```
cd resume_app
npm run build
```
Build output goes to `resume_app/dist`. The backend can serve these static files if configured.

## REST API
Base URL: `http://<host>:<port>/api`

### Health
- GET `/health` → `{ status: 'healthy', database: 'connected'|'disconnected' }`

### Resumes
- POST `/resumes`
  - Body:
  ```json
  {
    "generalInfo": { /* name, email, phone, ... */ },
    "educationInfo": { /* school, degree, ... */ },
    "experienceInfo": { /* company, title, duration, ... */ }
  }
  ```
  - Response: `{ success, data: { id | _id, ... } }`

- GET `/resumes` → `{ success, data: [ ... ] }`
- GET `/resumes/:id` → `{ success, data }`
- PUT `/resumes/:id` → `{ success, data }`
- DELETE `/resumes/:id` → `{ success, data: { id } }`

## Deployment (EC2 + PM2)
SSH to EC2 and set up Node:
```
sudo dnf update -y
sudo dnf install -y nodejs git
```

Clone or pull the repo, then:
```
cd ~/resume_app
cd resume_app && npm ci && npm run build
cd ../backend && npm ci
PORT=3000 pm2 start server.js --name resume-backend
pm2 save
pm2 status
```

Open security group ports: TCP 22 (SSH), TCP 3000 (app). If you use port 80, ensure nothing (e.g., nginx) occupies it or proxy correctly.

## Resume Selector Flow
- App starts on ResumeSelector page
- Dropdown lists resumes (name – company – date)
- Selecting one renders `ResumePreview`
- Create New → navigates to form with empty fields
- Edit Selected → pre-fills form and saves via PUT
- Save navigates back to selector and auto-selects the updated/created resume

## Troubleshooting
- Blank page: check browser console for JSX/typos (often unclosed tags). Fix and restart dev server.
- CORS/403: ensure `cors()` and correct API base URL.
- Mongo errors: verify `MONGODB_URI` and network access (IP allowlist in Atlas).
- Linux build errors: never copy `node_modules` from macOS; run `npm ci` on EC2.

## Roadmap
- Authentication (register/login, JWT)
- Per-user resumes and permissions
- Public read-only share links
- CI/CD via GitHub Actions

## License
MIT
