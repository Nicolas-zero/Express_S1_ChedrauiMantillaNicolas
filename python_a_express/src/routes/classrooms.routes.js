import { Router } from 'express';
import { listClassrooms, createClassroom } from '../controllers/classrooms.controller.js';

const router = Router();
router.get('/', listClassrooms);
router.post('/', createClassroom);

export default router;
