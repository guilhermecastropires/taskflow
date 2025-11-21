import { Router } from 'express';
import {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
  markTaskAsCompleted,
  getTaskStats
} from '../controller/taskController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// Todas as rotas de tarefas são protegidas
router.use(authMiddleware);

// Rotas de tarefas
router.post('/', createTask);
router.get('/', getAllTasks);
router.get('/stats', getTaskStats);
router.get('/:id', getTaskById);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);
router.patch('/:id/complete', markTaskAsCompleted);

export default router;