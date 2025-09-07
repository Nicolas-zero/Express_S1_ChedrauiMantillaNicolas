import { Router } from 'express';
import { listModules, createModule } from '../controllers/modules.controller.js';

const router = Router();
router.get('/', listModules);
router.post('/', createModule);

export default router;
