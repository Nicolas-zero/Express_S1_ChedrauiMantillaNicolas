import { v4 as uuid } from 'uuid';
import { readDB, writeDB } from '../models/db.js';
import { classroomSchema } from '../utils/validation.js';

export async function listClassrooms(req, res, next) {
  try {
    const db = await readDB();
    res.json(db.classrooms);
  } catch (err) { next(err); }
}

export async function createClassroom(req, res, next) {
  try {
    const { value, error } = classroomSchema.validate(req.body, { stripUnknown: true });
    if (error) return res.status(400).json({ error: error.message });
    const db = await readDB();
    const newItem = { ...value, id: uuid() };
    db.classrooms.push(newItem);
    await writeDB(db);
    res.status(201).json(newItem);
  } catch (err) { next(err); }
}
