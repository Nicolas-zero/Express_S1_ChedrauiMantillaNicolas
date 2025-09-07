import { Router } from 'express';
import { listTrainers, createTrainer, deleteTrainer } from '../controllers/trainers.controller.js';

const router = Router();
router.get('/', listTrainers);
router.post('/', createTrainer);
router.delete('/:id', deleteTrainer);

export default router;
