import { Router } from 'express';
import {
  registerUser,
  loginUser,
  deleteUser
} from '../controller/userController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// Rotas públicas
router.post('/register', registerUser);
router.post('/login', loginUser);

// Rotas protegidas
router.delete('/account', authMiddleware, deleteUser);

export default router;