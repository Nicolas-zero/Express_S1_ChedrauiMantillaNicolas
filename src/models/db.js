import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_PATH = path.resolve(__dirname, '../../data/db.json');

async function ensureFile() {
  try {
    await fs.access(DATA_PATH);
  } catch {
    const seed = { students: [], trainers: [], modules: [], classrooms: [] };
    await fs.mkdir(path.dirname(DATA_PATH), { recursive: true });
    await fs.writeFile(DATA_PATH, JSON.stringify(seed, null, 2), 'utf-8');
  }
}

export async function readDB() {
  await ensureFile();
  const raw = await fs.readFile(DATA_PATH, 'utf-8');
  return JSON.parse(raw);
}

let writing = Promise.resolve();
export async function writeDB(data) {
  // Serializa escrituras para evitar condiciones de carrera simples.
  writing = writing.then(async () => {
    await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2), 'utf-8');
  });
  return writing;
}
