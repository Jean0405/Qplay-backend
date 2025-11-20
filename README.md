# MVC Express Scaffold

Proyecto minimalista con arquitectura MVC usando Node.js y Express.

Getting started

Install dependencies:

```bash
npm install
```

Run in development (auto-restart):

```bash
npm run dev
```

Open http://localhost:3000

Project structure

- `app.js` — entrada principal, configuración de Express y middleware.
- `routes/` — define rutas y las conecta a controladores (`routes/index.js`).
- `controllers/` — lógica que orquesta modelos y vistas (`homeController.js`).
- `models/` — acceso a datos (aquí: in-memory `userModel.js`).
- `views/` — plantillas EJS (`layout.ejs`, `index.ejs`).

Notes

- Para integrar una DB, reemplace `models/userModel.js` por un adaptador (Sequelize, Mongoose, etc.)
- Rutas deben ser delgadas: mover lógica pesada a `controllers` o `services`.

API Endpoints (implemented)

AUTH

- `POST /auth/register` — { username, email, password }
- `POST /auth/login` — { email, password }

USERS

- `GET /users/me` — auth required
- `GET /users/ranking/:examCategoryId`

CATEGORIES

- `GET /exam-categories`
- `POST /exam-categories` — admin only

SUBJECTS

- `GET /subjects`
- `POST /subjects` — admin only

QUESTIONS

- `GET /questions/:examCategoryId/:subjectId` — list approved
- `POST /questions/recommend` — auth required
- `GET /questions/admin/pending` — admin only
- `PATCH /questions/admin/:id/status` — admin only

EXAMS

- `POST /exams/generate` — { examCategoryId, subjectId?, limit } auth required
- `POST /exams/submit` — { examId, answers: [{ examQuestionId, selectedOption }] } auth required
- `GET /exams/:id` — auth required (owner or admin)
- `GET /exams/history/me` — auth required

ADMIN

- Endpoints for creating categories/subjects are under `/exam-categories` and `/subjects` with admin auth.

Database

- The project currently uses an in-memory store at `data/store.js` that mirrors the schema you provided.
- Replace `data/store.js` with a real DB adapter (Knex/Sequelize/Mongoose) for production.
