import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import studentsRouter from './routes/students.routes.js';
import trainersRouter from './routes/trainers.routes.js';
import modulesRouter from './routes/modules.routes.js';
import classroomsRouter from './routes/classrooms.routes.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.json({ ok: true, name: 'Campuslands Express API', version: '1.0.0' });
});

app.use('/api/students', studentsRouter);
app.use('/api/trainers', trainersRouter);
app.use('/api/modules', modulesRouter);
app.use('/api/classrooms', classroomsRouter);

// Manejo básico de errores
app.use((req, res, next) => {
  res.status(404).json({ error: 'Not Found' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

export default app;
