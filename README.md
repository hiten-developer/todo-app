# 🗒️ Doto — Full Stack Todo App

A production-ready, full-stack todo application with complete JWT authentication system, built with Node.js, Express, MongoDB and vanilla JavaScript.

**🌐 Live Demo → [my-todo-frontend.netlify.app](https://my-todo-frontend.netlify.app)**

![Doto App Banner](https://img.shields.io/badge/Status-Live%20%26%20Deployed-brightgreen?style=for-the-badge)
![Frontend](https://img.shields.io/badge/Frontend-Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)
![Backend](https://img.shields.io/badge/Backend-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)
![Database](https://img.shields.io/badge/Database-MongoDB%20Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)

---

## ✨ Features

- 🔐 **User Authentication** — Signup, Login with JWT tokens
- ✅ **Todo CRUD** — Create, Read, Update, Delete tasks
- 🔒 **Protected Routes** — Only logged-in users can access their todos
- 👤 **User Specific Data** — Every user sees only their own todos
- 📱 **Responsive Design** — Works on mobile and desktop
- ⚡ **Real-time UI** — Instant updates without page refresh

---

## 🛠️ Tech Stack

### Frontend
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)

### Backend
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)

---

## 📁 Project Structure

```
todo-app/
├── 📁 todo-frontend/
│   ├── index.html        # App structure
│   ├── style.css         # All styling
│   └── script.js         # API calls + UI logic
│
└── 📁 todo-backend/
    ├── 📁 config/
    │   └── db.js             # MongoDB connection
    ├── 📁 controllers/
    │   ├── authController.js # Login, Signup logic
    │   └── todoController.js # CRUD logic
    ├── 📁 models/
    │   ├── User.js           # User schema
    │   └── Todo.js           # Todo schema
    ├── 📁 routes/
    │   ├── authRoutes.js     # Auth endpoints
    │   └── todoRoutes.js     # Todo endpoints
    ├── 📁 middlewares/
    │   └── authMiddleware.js # JWT verification
    └── server.js             # Entry point
```

---

## 🔌 API Endpoints

### Auth Routes
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/signup` | Register new user | ❌ |
| POST | `/auth/login` | Login user, get token | ❌ |

### Todo Routes
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/todos` | Get all user's todos | ✅ |
| POST | `/todos` | Create new todo | ✅ |
| PUT | `/todos/:id` | Update todo | ✅ |
| DELETE | `/todos/:id` | Delete todo | ✅ |

---

## ⚙️ Run Locally

### Prerequisites
- Node.js installed
- MongoDB installed locally

### 1. Clone the repo
```bash
git clone https://github.com/hiten-developer/todo-app.git
cd todo-app
```

### 2. Setup Backend
```bash
cd todo-backend
npm install
```

### 3. Create `.env` file in `todo-backend/`
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/todoappDB
JWT_SECRET=your_secret_key_here
```

### 4. Start Backend
```bash
npm run dev
```

### 5. Open Frontend
Open `todo-frontend/index.html` directly in browser

---

## 🌍 Deployment

| Service | Platform | URL |
|---------|----------|-----|
| Frontend | Netlify | [my-todo-frontend.netlify.app](https://my-todo-frontend.netlify.app) |
| Backend | Render | [todo-backend-0i8s.onrender.com](https://todo-backend-0i8s.onrender.com) |
| Database | MongoDB Atlas | Cloud Hosted |

---

## 👨‍💻 Author

**Hiten Prajapati**

[![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=github&logoColor=white)](https://github.com/hiten-developer)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=flat-square&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/hiten-datascience-ml/)
[![Email](https://img.shields.io/badge/Email-D14836?style=flat-square&logo=gmail&logoColor=white)](mailto:prajapatihiten2510@gmail.com)

---

<p align="center">Made with ❤️ by Hiten Prajapati</p>
