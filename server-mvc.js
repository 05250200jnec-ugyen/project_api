// server-mvc.js — PART 3 complete (MVC entry point)
require('dotenv').config();
const express = require('express');
const taskRoutes = require('./src/routes/taskRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Task API (MVC version) is ready!' });
});

// Every route inside taskRoutes is prefixed with /tasks
app.use('/tasks', taskRoutes);

// Global error handler — 4 parameters so Express treats it as an error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(err.statusCode || 500).json({
    error: err.message || 'Internal Server Error',
  });
});

app.listen(PORT, () => {
  console.log(`MVC server running at http://localhost:${PORT}`);
});
