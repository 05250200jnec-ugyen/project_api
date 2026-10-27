# Task API — SYD204

A Task List REST API built three ways: in-memory (Part 1), MySQL in one file (Part 2), and MySQL with MVC (Part 3).

## Files

| File | Part | What it is |
|---|---|---|
| `server-part1.js` | 1 | In-memory API (array). Data disappears on restart. |
| `server.js` | 2 | Single-file MySQL API with PUT and flexible PATCH |
| `server-mvc.js` | 3 | MVC entry point, mounts `src/routes/taskRoutes.js` |
| `src/db.js` | 2, 3 | MySQL connection pool (Aiven, SSL) |
| `src/models/taskModel.js` | 3 | SQL only |
| `src/controllers/taskController.js` | 3 | Validation and status codes |
| `src/routes/taskRoutes.js` | 3 | URL → controller mapping |
| `database/schema.sql` | 2 | Run once in MySQL Workbench |
| `test-db.js` | 2 | Connection test, delete after it works |

## Setup (do these on your own laptop)

1. **Create your Aiven service user** on service `mysql-20713dd0` → Users → Create service user. Use `caching_sha2_password`. Copy the password straight away.
2. **Install packages** in this folder:
   ```
   npm install
   ```
3. **Create `.env`**: copy `.env.example` to `.env`, then set `DB_USER` and `DB_PASS` to your own Aiven username and password.
   ```
   cp .env.example .env      # Windows: copy .env.example .env
   ```
4. **Create the table**: open your Aiven connection in MySQL Workbench (port 15308, SSL required), open `database/schema.sql`, and run it. If a classmate already created it, `DESCRIBE tasks;` is enough.
5. **Test the connection**:
   ```
   node test-db.js
   ```
   Expected: `Connected to MySQL` and `db: 'defaultdb'`. Delete `test-db.js` once this works.

## Running

```
npm run start:part1   # Part 1 — in-memory
npm start             # Part 2 — server.js
npm run start:mvc     # Part 3 — server-mvc.js
```

All three listen on http://localhost:3000. Stop one (Ctrl+C) before starting another.

## Test sequence (Thunder Client or Postman)

Set header `Content-Type: application/json` for requests with a body. Put your name in titles so you can find your own rows on the shared server.

| # | Method | URL | Body | Expected |
|---|---|---|---|---|
| 1 | GET | `/` | | 200 |
| 2 | GET | `/tasks` | | 200, array |
| 3 | POST | `/tasks` | `{ "title": "YourName - Task A" }` | 201 with id, created_at |
| 4 | POST | `/tasks` | `{ "title": "YourName - Task B" }` | 201 |
| 5 | GET | `/tasks/<id of A>` | | 200 |
| 6 | GET | `/tasks/9999` | | 404 `Task not found` |
| 7 | PATCH | `/tasks/<id>` | `{ "completed": true }` | 200, completed true / 1 |
| 8 | PUT | `/tasks/<id>` | `{ "title": "YourName - done", "completed": true }` | 200 |
| 9 | DELETE | `/tasks/<your id>` | | 204 |
| 10 | GET | `/tasks/<deleted id>` | | 404 |
| 11 | POST | `/tasks` | `{}` | 400 `Title is required` |
| 12 | POST | `/tasks` | `{ "title": "'; DROP TABLE tasks; --" }` | 201, stored as text; table still exists |

Persistence proof (Parts 2 and 3): create a task, stop the server, start it again, `GET /tasks` — your row is still there.

PUT and the `completed` checks are only in Parts 2 and 3; Part 1 supports GET, POST, PATCH and DELETE as in the handout.

## Troubleshooting

| Symptom | Fix |
|---|---|
| `Access denied for user` | Wrong `DB_USER` / `DB_PASS` in `.env`. Use your own service user, not avnadmin. |
| Connection hangs / `ETIMEDOUT` | `DB_PORT` must be 15308, not 3306. |
| TLS / SSL error | `DB_SSL=REQUIRED` must be in `.env`. |
| `Table 'defaultdb.tasks' doesn't exist` | Run `database/schema.sql` in Workbench. |
| `req.body` is undefined | `app.use(express.json())` must come before routes; send the JSON header. |
| `EADDRINUSE :3000` | Another server is still running. Ctrl+C it first. |
| `Cannot find module 'express'` | Run `npm install` in this folder. |
