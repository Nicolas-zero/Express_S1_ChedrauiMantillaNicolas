import { v4 as uuid } from 'uuid';
import { readDB, writeDB } from '../models/db.js';
import { trainerSchema } from '../utils/validation.js';

export async function listTrainers(req, res, next) {
  try {
    const db = await readDB();
    res.json(db.trainers);
  } catch (err) { next(err); }
}

export async function createTrainer(req, res, next) {
  try {
    const { value, error } = trainerSchema.validate(req.body, { stripUnknown: true });
    if (error) return res.status(400).json({ error: error.message });
    const db = await readDB();
    const newItem = { ...value, id: uuid() };
    db.trainers.push(newItem);
    await writeDB(db);
    res.status(201).json(newItem);
  } catch (err) { next(err); }
}

export async function deleteTrainer(req, res, next) {
  try {
    const db = await readDB();
    const idx = db.trainers.findIndex(t => t.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Trainer not found' });
    const [deleted] = db.trainers.splice(idx, 1);
    await writeDB(db);
    res.json({ deleted });
  } catch (err) { next(err); }
}
