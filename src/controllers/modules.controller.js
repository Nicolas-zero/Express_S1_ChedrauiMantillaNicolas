import { v4 as uuid } from 'uuid';
import { readDB, writeDB } from '../models/db.js';
import { moduleSchema } from '../utils/validation.js';

export async function listModules(req, res, next) {
  try {
    const db = await readDB();
    res.json(db.modules);
  } catch (err) { next(err); }
}

export async function createModule(req, res, next) {
  try {
    const { value, error } = moduleSchema.validate(req.body, { stripUnknown: true });
    if (error) return res.status(400).json({ error: error.message });
    const db = await readDB();
    const newItem = { ...value, id: uuid() };
    db.modules.push(newItem);
    await writeDB(db);
    res.status(201).json(newItem);
  } catch (err) { next(err); }
}
