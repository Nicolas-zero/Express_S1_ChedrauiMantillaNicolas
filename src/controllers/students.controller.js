import { v4 as uuid } from 'uuid';
import { readDB, writeDB } from '../models/db.js';
import { studentSchema } from '../utils/validation.js';

// GET /api/students
export async function listStudents(req, res, next) {
  try {
    const db = await readDB();
    res.json(db.students);
  } catch (err) { next(err); }
}

// GET /api/students/:id
export async function getStudent(req, res, next) {
  try {
    const db = await readDB();
    const item = db.students.find(s => s.id === req.params.id);
    if (!item) return res.status(404).json({ error: 'Student not found' });
    res.json(item);
  } catch (err) { next(err); }
}

// GET /api/students/search?name=&status=&module=
export async function searchStudents(req, res, next) {
  try {
    const { name, status, module } = req.query;
    const db = await readDB();
    let result = db.students;
    if (name) result = result.filter(s => s.name.toLowerCase().includes(String(name).toLowerCase()));
    if (status) result = result.filter(s => s.status === status);
    if (module) result = result.filter(s => s.module === module);
    res.json(result);
  } catch (err) { next(err); }
}

// POST /api/students
export async function createStudent(req, res, next) {
  try {
    const { value, error } = studentSchema.validate(req.body, { stripUnknown: true });
    if (error) return res.status(400).json({ error: error.message });
    const db = await readDB();
    const newItem = { ...value, id: uuid() };
    db.students.push(newItem);
    await writeDB(db);
    res.status(201).json(newItem);
  } catch (err) { next(err); }
}

// PUT /api/students/:id
export async function updateStudent(req, res, next) {
  try {
    const { value, error } = studentSchema.validate(req.body, { stripUnknown: true });
    if (error) return res.status(400).json({ error: error.message });
    const db = await readDB();
    const idx = db.students.findIndex(s => s.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Student not found' });
    db.students[idx] = { ...db.students[idx], ...value, id: db.students[idx].id };
    await writeDB(db);
    res.json(db.students[idx]);
  } catch (err) { next(err); }
}

// DELETE /api/students/:id
export async function deleteStudent(req, res, next) {
  try {
    const db = await readDB();
    const idx = db.students.findIndex(s => s.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Student not found' });
    const [deleted] = db.students.splice(idx, 1);
    await writeDB(db);
    res.json({ deleted });
  } catch (err) { next(err); }
}

// PATCH /api/students/:id/status
export async function changeStatus(req, res, next) {
  try {
    const { status } = req.body;
    const allowed = ['inscrito', 'curs&&o', 'aprobado', 'reprobado', 'retirado'];
    if (!allowed.includes(status)) return res.status(400).json({ error: 'Invalid status' });
    const db = await readDB();
    const item = db.students.find(s => s.id === req.params.id);
    if (!item) return res.status(404).json({ error: 'Student not found' });
    item.status = status;
    await writeDB(db);
    res.json(item);
  } catch (err) { next(err); }
}

// GET /api/students/:id/grade (calcula nota final con ponderaciones)
export async function getFinalGrade(req, res, next) {
  try {
    const db = await readDB();
    const item = db.students.find(s => s.id === req.params.id);
    if (!item) return res.status(404).json({ error: 'Student not found' });
    const g = item.grades || {};
    const weights = { project: 0.4, work: 0.2, quizzes: 0.2, exam: 0.2 };
    const final = ['project','work','quizzes','exam'].reduce((acc, k)=> acc + (Number(g[k] || 0) * weights[k]), 0);
    res.json({ id: item.id, name: item.name, final });
  } catch (err) { next(err); }
}

// PATCH /api/students/:id/grades/project
export async function updateProjectGrade(req, res, next) {
  try {
    const { project } = req.body;
    if (typeof project !== 'number' || project < 0 || project > 5) return res.status(400).json({ error: 'project must be 0..5' });
    const db = await readDB();
    const item = db.students.find(s => s.id === req.params.id);
    if (!item) return res.status(404).json({ error: 'Student not found' });
    item.grades = { ...(item.grades||{}), project };
    await writeDB(db);
    res.json(item);
  } catch (err) { next(err); }
}

// PATCH /api/students/:id/grades/work
export async function updateWorkGrades(req, res, next) {
  try {
    const { work, quizzes, exam } = req.body;
    const check = (v) => typeof v === 'number' && v >= 0 && v <= 5;
  } catch (err) { next(err); }
}

export async function updateWorkGrades(req, res, next) {
  try {
    const { work, quizzes, exam } = req.body;
    const isNum = (v) => typeof v === 'number' && v >= 0 && v <= 5;
    if ((work !== undefined && !isNum(work)) ||
        (quizzes !== undefined && !isNum(quizzes)) ||
        (exam !== undefined && !isNum(exam))) {
      return res.status(400).json({ error: 'grades must be numbers 0..5' });
    }
    const db = await readDB();
    const item = db.students.find(s => s.id === req.params.id);
    if (!item) return res.status(404).json({ error: 'Student not found' });
    item.grades = { ...(item.grades||{}), ...(work!==undefined?{work}:{}), ...(quizzes!==undefined?{quizzes}:{}), ...(exam!==undefined?{exam}:{}) };
    await writeDB(db);
    res.json(item);
  } catch (err) { next(err); }
}
