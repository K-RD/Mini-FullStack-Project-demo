# Mini Full Stack Student Search Application

A simple **full‑stack web application** that demonstrates end‑to‑end data flow from **frontend → backend → database → frontend**, built and deployed using **free cloud services**.

This project was created for learning real‑world full‑stack development concepts such as API design, database connectivity, environment variables, deployment, and debugging production issues.

---

## 🚀 Live Demo

* **Frontend (Vercel):** https://mini-ashen-seven.vercel.app
* **Backend API (Render):** https://mini-fullstack-project-demo.onrender.com

---

## 🧱 Tech Stack

### Frontend

* HTML
* CSS (basic)
* JavaScript (Fetch API)
* Hosted on **Vercel**

### Backend

* Node.js
* Express.js
* PostgreSQL client (`pg`)
* Hosted on **Render**

### Database

* PostgreSQL
* Hosted on **Supabase** (Shared Connection Pooler)

---

## 🗂 Project Structure (Monorepo)

```
mini-fullstack-project/
│
├── backend/
│   ├── index.js          # Express server
│   ├── package.json
│   ├── .env              # Environment variables (ignored)
│   └── node_modules/     # Ignored
│
├── frontend/
│   └── index.html        # UI + Fetch logic
│
├── .gitignore
└── README.md
```

---

## ⚙️ How the Application Works

1. User enters a **student name** in the frontend UI
2. Frontend sends a **POST request** to the backend API
3. Backend queries the **PostgreSQL database** using parameterized SQL
4. Matching student records are returned as JSON
5. Frontend displays the result to the user

---

## 🔌 API Endpoints

### 🔍 Search Student

**Endpoint**

```
POST /search
```

**Request Body**

```json
{
  "name": "Rahul"
}
```

**Response**

```json
[
  {
    "id": 2,
    "name": "Rahul Raj",
    "roll_no": "CSE102",
    "branch": "Computer Science",
    "semester": 5
  }
]
```

---

## 🧪 Testing the API using curl

```bash
curl -X POST https://<your-backend-url>.onrender.com/search \
  -H "Content-Type: application/json" \
  -d '{"name":"Rahul"}'
```

---

## 🗄 Database Schema

```sql
CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    roll_no VARCHAR(20),
    branch VARCHAR(50),
    semester INT
);
```

---

## 🔐 Environment Variables

Backend uses environment variables for security:

```env
DATABASE_URL=postgresql://<user>:<password>@<pooler-host>:5432/postgres
PORT=5000
```

> `.env` files are excluded from Git using `.gitignore`.

---

## 🌐 Deployment Details

* **Frontend:** Deployed on Vercel from `/frontend`
* **Backend:** Deployed on Render from `/backend`
* **Database:** Supabase PostgreSQL (shared connection pooler for IPv4 compatibility)

---

## 🧠 Key Learnings

* Full‑stack request/response flow
* REST API design
* Secure handling of environment variables
* PostgreSQL queries with Node.js
* Hosting frontend and backend separately
* Debugging real production issues (IPv6 vs IPv4)
* Monorepo project structure

---

## 📈 Future Improvements

* Display results in an HTML table
* Add Create / Update / Delete operations
* Add form validation and loading states
* Convert frontend to React
* Add authentication