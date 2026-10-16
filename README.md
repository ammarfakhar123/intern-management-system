# 🎓 InternPulse — Full-Stack Intern Management & Progress Tracking System

> **Internship Task 1 — Full-Stack React & Node.js/Express Project**  
> Built with React (Vite), Tailwind CSS, Framer Motion (`motion/react`), Node.js, Express, and MongoDB.

---

## 🌟 Overview

**InternPulse** is a clean, modern, and intuitive web application designed for managing internship programs and tracking intern performance in real time.

It features separate, role-protected dashboards for **Admins** and **Interns**, automated progress calculation, task assignments, interactive work submission with GitHub/demo links, and mentor review workflows with approvals and revision requests.

---

## 🚀 Key Features

### 🔐 1. Authentication & Role-Based Access
- Single unified modern login interface for both Admins and Interns.
- JWT-based authentication with bcrypt password hashing.
- Role-based route protection (`/admin/*` and `/intern/*`).
- One-click demo account autofill buttons on the login page for effortless evaluation.

### 📊 2. Admin Workspace
- **Real-Time Analytics Cards:** Total Interns, Total Tasks, Completed Tasks, and Pending Tasks.
- **Visual Analytics:** Interactive Donut chart (Recharts) showing task statuses and priority distributions.
- **Intern Directory (CRUD):** Search by name/email/department, filter by status, add new intern accounts, view detailed progress modals, edit records, and delete with confirmation dialogs.
- **Task Management (CRUD):** Create tasks with priorities (Low, Medium, High) and deadlines, assign to specific interns, switch between Grid and Table views, and filter by status/priority/intern.
- **Submission Review & Feedback:** Review intern deliverables (GitHub links, live demo links, summaries), provide feedback comments, and **Approve Task** (marks Completed) or **Request Changes** (returns to In Progress).

### 🎯 3. Intern Workspace
- **Personalized Dashboard:** Welcome banner with enrolled department, quick metric cards, and upcoming milestone deadlines.
- **Automated Progress Tracking:**
  $$\text{Progress} = \left(\frac{\text{Completed Tasks}}{\text{Total Assigned Tasks}}\right) \times 100$$
  *Only admin-approved tasks count toward completion. Handled zero-task edge cases gracefully.*
- **My Tasks Module:** View assigned tasks, start work (changes status from *Pending* to *In Progress*), and submit deliverables.
- **Work Submission Module:** Submit GitHub repository URL, live project demo link, and detailed work descriptions.
- **Feedback & Revisions:** Read mentor evaluations and resubmit updated work when changes are requested.
- **Profile Module:** View read-only program details (department, joining date, status) and update personal contact information.

### 🎨 4. Design & UI/UX
- **Modern SaaS Aesthetics:** Clean white cards, slate backgrounds (`#F8FAFC`), and vibrant Indigo (`#4F46E5`) & Purple (`#8B5CF6`) accents.
- **Framer Motion Animations:** Smooth page transitions, modal spring entrances, animated progress bar fills, and button hover/tap micro-interactions using imports from `motion/react`.
- **Responsive Layout:** Adaptive sidebar navigation with mobile drawer support for desktop, tablet, and mobile.

---

## 🛠️ Technology Stack

### Frontend
- **Framework:** React 18 with Vite
- **Styling:** Tailwind CSS with custom theme palette
- **Animations:** Motion for React (`motion/react`)
- **Routing:** React Router DOM (v6)
- **HTTP Client:** Axios with request & response interceptors
- **Icons:** Lucide React
- **Charts:** Recharts (Responsive Pie & Bar charts)
- **Notifications:** React Hot Toast

### Backend
- **Runtime:** Node.js (v18+)
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Zero-Friction Fallback:** Embedded In-Memory MongoDB option enabled out of the box so the project runs immediately with zero external setup!
- **Authentication:** JSON Web Tokens (JWT) & bcryptjs
- **Environment:** dotenv & cors

---

## 📁 Project Structure

```text
intern-management-system/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/         # Button, Input, Select, Modal, StatCard, etc.
│   │   │   └── layout/         # Sidebar, Header
│   │   ├── context/            # AuthContext.jsx
│   │   ├── layouts/            # DashboardLayout.jsx
│   │   ├── pages/
│   │   │   ├── auth/           # Login.jsx
│   │   │   ├── admin/          # AdminDashboard, InternList, TaskList
│   │   │   └── intern/         # InternDashboard, InternTasks, InternProgress, InternProfile
│   │   ├── services/           # api.js (Axios instance)
│   │   ├── App.jsx             # Routes & ProtectedRoute configuration
│   │   ├── index.css           # Tailwind base styles
│   │   └── main.jsx
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── backend/
│   ├── config/                 # db.js, seedDefault.js
│   ├── controllers/            # auth, intern, task, submission, feedback, dashboard
│   ├── middleware/             # authMiddleware, errorMiddleware
│   ├── models/                 # User, Task, Submission, Feedback
│   ├── routes/                 # Express API routes
│   ├── scripts/                # seed.js, test-e2e.js
│   ├── .env                    # Environment variables
│   ├── .env.example
│   ├── server.js
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## ⚡ Quick Start & Installation

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### 1. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the backend server:
   ```bash
   npm start
   ```
   *The server runs on `http://localhost:5000`. If a local MongoDB instance is not detected, it automatically starts a zero-friction in-memory MongoDB server and seeds realistic demo data!*

4. (Optional) Run automated end-to-end tests:
   ```bash
   npm run test
   # or: node scripts/test-e2e.js
   ```

### 2. Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser at `http://localhost:5173`.

---

## 🔑 Default Demo Credentials

You can use the one-click demo buttons on the login page or manually enter:

| Role | Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@internpulse.com` | `admin123` | System Administrator (Full Access) |
| **Intern** | `alex.morgan@internpulse.com` | `intern123` | Alex Morgan (Frontend Engineering) |
| **Intern** | `sophia.chen@internpulse.com` | `intern123` | Sophia Chen (Backend Engineering) |
| **Intern** | `liam.patel@internpulse.com` | `intern123` | Liam Patel (UI/UX Design) |

---

## 🔄 End-to-End Demonstration Workflow

Follow this step-by-step walkthrough to test the complete lifecycle:

1. **Admin Login:**
   - Log in with `admin@internpulse.com` / `admin123`.
   - View dashboard cards, task status donut chart, and priority breakdowns.
2. **Create New Intern:**
   - Click **Add Intern** (or go to **Interns** -> **Add New Intern**).
   - Fill in: Full Name, Email, Password, Department, and Joining Date. Click **Create Intern**.
3. **Assign a Task:**
   - Go to **Tasks** -> **Create Task**.
   - Enter title, description, select your new intern, set priority to *High*, and pick a due date.
4. **Intern Login:**
   - Log out, and log in with the new intern's credentials.
   - The Intern Dashboard displays: 1 Assigned Task, 1 Pending, 0 Completed, and **0% Progress**.
5. **Start Task & Submit Work:**
   - Go to **My Tasks**.
   - Click **Start Task** (status changes from *Pending* to *In Progress*).
   - Click **Submit Work**. Provide a GitHub repo link, demo link, and description.
   - Task status transitions to **Submitted**.
6. **Admin Review & Approval:**
   - Log back in as Admin.
   - Notice the task in the **Review Queue** on the dashboard.
   - Open the task review modal, inspect the submitted links and description.
   - Write feedback comments and click **Approve Task**.
7. **Verify Progress Update:**
   - Log back in as the intern.
   - Notice the task status is now **Completed**.
   - Progress bar automatically calculates:
     $$\text{Progress} = \left(\frac{1}{1}\right) \times 100 = 100\%$$
   - View mentor comments under **Recent Feedback**.

---

## 📡 REST API Documentation

### Auth
- `POST /api/auth/login` — Authenticate and receive JWT token.
- `GET /api/auth/me` — Retrieve current authenticated profile.
- `PUT /api/auth/profile` — Update current user's name and contact phone.

### Interns (Admin Only)
- `GET /api/interns` — List all interns with search, department filtering, and calculated progress.
- `GET /api/interns/:id` — Get single intern with full assigned task history.
- `POST /api/interns` — Create new intern account.
- `PUT /api/interns/:id` — Update intern information.
- `DELETE /api/interns/:id` — Remove intern and cascade delete associated tasks.

### Tasks
- `GET /api/tasks` — List tasks (Admins see all; Interns see their assigned tasks).
- `GET /api/tasks/:id` — Get task with submissions and feedback history.
- `POST /api/tasks` — (Admin) Create and assign task.
- `PUT /api/tasks/:id` — (Admin) Edit task details.
- `DELETE /api/tasks/:id` — (Admin) Delete task.
- `PATCH /api/tasks/:id/status` — Start task (Pending -> In Progress).

### Submissions & Feedback
- `POST /api/submissions` — (Intern) Submit work deliverables.
- `GET /api/submissions` — Retrieve submissions.
- `GET /api/submissions/task/:taskId` — Retrieve submission history for a task.
- `POST /api/feedback` — (Admin) Review submission and approve or request revisions.
- `GET /api/feedback/task/:taskId` — Retrieve feedback history for a task.

### Dashboard
- `GET /api/dashboard/admin` — Total counts, status breakdown, recent interns, and tasks.
- `GET /api/dashboard/intern` — Assigned/Pending/Completed stats, progress %, upcoming deadlines, and feedback.
