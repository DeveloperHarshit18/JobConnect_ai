# JobConnect AI - AI-Powered Job Portal 🚀

A full-featured, modern job portal built with the **MERN Stack** (MongoDB, Express.js, React.js, Node.js) featuring AI resume analysis, real-time chat, and role-based dashboards.

![MERN Stack](https://img.shields.io/badge/Stack-MERN-blue) ![License](https://img.shields.io/badge/License-MIT-green) ![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)

---

## ✨ Features

### 🔐 Authentication & Authorization
- JWT-based authentication with bcrypt password hashing
- Role-based access control (Job Seeker, Recruiter, Admin)
- Protected routes on frontend and backend

### 👤 Job Seeker
- **Dashboard** — Recommended jobs, recent applications, stats
- **Profile Builder** — Personal info, skills, experience, education, portfolio links
- **Resume Upload** — PDF/DOC upload with Multer
- **AI Resume Analysis** — OpenAI-powered resume scoring and improvement suggestions
- **Job Search** — Advanced filtering by keyword, location, type, experience, salary
- **Apply & Track** — One-click apply, application status tracking
- **Saved Jobs** — Bookmark jobs for later

### 🏢 Recruiter
- **Dashboard** — Job stats, applicant counts, view counts
- **Post Jobs** — Rich job posting form with skills, responsibilities, qualifications
- **Manage Jobs** — Edit, close, delete job postings
- **Applicant Management** — Split-panel view, resume download, accept/reject/shortlist

### ⚡ Admin
- **Analytics Dashboard** — User growth charts, job posting charts (Recharts)
- **User Management** — View, suspend, delete users
- **Job Management** — Remove spam/inappropriate job listings

### 💬 Real-Time Chat
- Socket.io powered messaging between recruiters and job seekers
- Online status indicators
- Typing indicators
- Message history and conversation list

### 🎨 UI/UX
- Modern responsive design with Tailwind CSS
- Dark mode support
- Glassmorphism effects
- Framer Motion animations
- Mobile-first responsive layout

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js, Tailwind CSS v4, Redux Toolkit, React Router, Framer Motion |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT, bcryptjs |
| File Upload | Multer |
| Real-Time | Socket.io |
| AI | OpenAI API |
| Charts | Recharts |
| Notifications | react-hot-toast, Nodemailer |

---

## 📁 Project Structure

```
/Ai-job-portal
├── /client                  # React frontend
│   ├── /src
│   │   ├── /components
│   │   │   ├── /common      # JobCard, LoadingSpinner, ProtectedRoute
│   │   │   └── /layout      # Navbar, Footer
│   │   ├── /pages
│   │   │   ├── /seeker      # Dashboard, Profile, AppliedJobs, SavedJobs
│   │   │   ├── /recruiter   # Dashboard, PostJob, ManageJobs, Applicants
│   │   │   ├── /admin       # AdminDashboard
│   │   │   ├── Home.jsx, Jobs.jsx, JobDetails.jsx
│   │   │   ├── Login.jsx, Register.jsx, Chat.jsx
│   │   ├── /redux           # store.js, authSlice.js
│   │   ├── /services        # api.js, index.js (all API services)
│   │   ├── App.jsx, main.jsx, index.css
│   └── vite.config.js
├── /server                  # Express backend
│   ├── /config              # db.js
│   ├── /controllers         # auth, job, application, user, message, admin
│   ├── /middleware           # auth.js, upload.js
│   ├── /models              # User, Job, Application, Message, Notification
│   ├── /routes              # All API routes + AI routes
│   ├── /sockets             # chatSocket.js
│   ├── server.js
│   ├── .env.example
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Ai-job-portal
```

### 2. Setup Backend
```bash
cd server
cp .env.example .env
# Edit .env with your MongoDB URI, JWT secret, etc.
npm install
npm run dev
```

### 3. Setup Frontend
```bash
cd client
npm install
npm run dev
```

### 4. Open in Browser
```
Frontend: http://localhost:5173
Backend:  http://localhost:5000
```

---

## ⚙️ Environment Variables

Create a `.env` file in the `/server` directory using the provided `.env.example`:

```bash
cp .env.example .env
```

Then configure the following variables:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_uri
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
OPENAI_API_KEY=your_openai_key              # Optional - mock analysis works without it
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
CLIENT_URL=http://localhost:5173
```

See `.env.example` for a complete template.

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |
| GET | `/api/jobs` | Get all jobs (with filters) |
| GET | `/api/jobs/:id` | Get single job |
| GET | `/api/jobs/featured` | Get featured jobs |
| POST | `/api/jobs` | Create job (recruiter) |
| PUT | `/api/jobs/:id` | Update job |
| DELETE | `/api/jobs/:id` | Delete job |
| POST | `/api/applications` | Apply for job |
| GET | `/api/applications/user` | User's applications |
| GET | `/api/applications/job/:id` | Job's applicants |
| PUT | `/api/applications/:id` | Update application status |
| GET/PUT | `/api/users/profile` | Get/update profile |
| POST | `/api/users/resume` | Upload resume |
| POST | `/api/users/save-job/:id` | Toggle save job |
| POST/GET | `/api/messages` | Send/get messages |
| POST | `/api/ai/analyze-resume` | AI resume analysis |
| POST | `/api/ai/recommend-jobs` | AI job recommendations |
| GET | `/api/admin/stats` | Admin analytics |

---

## 📄 License

MIT License — feel free to use this project for learning and development.

---

Built with ❤️ by JobConnect AI Team
