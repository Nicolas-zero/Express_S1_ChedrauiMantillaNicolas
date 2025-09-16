import { Router } from 'express';
import {
  listStudents, getStudent, searchStudents, createStudent, updateStudent, deleteStudent,
  changeStatus, getFinalGrade, updateProjectGrade, updateWorkGrades
} from '../controllers/students.controller.js';

const router = Router();

router.get('/', listStudents);
router.get('/search', searchStudents);
router.get('/:id', getStudent);
router.post('/', createStudent);
router.put('/:id', updateStudent);
router.delete('/:id', deleteStudent);
router.patch('/:id/status', changeStatus);
router.get('/:id/grade', getFinalGrade);
router.patch('/:id/grades/project', updateProjectGrade);
router.patch('/:id/grades/work', updateWorkGrades);

export default router;
