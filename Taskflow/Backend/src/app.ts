import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes';
import taskRoutes from './routes/taskRoutes';

dotenv.config();

const app: Application = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rota inicial
app.get('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'API de Gerenciamento de Tarefas - Funcionando! 🚀',
    version: '2.0.0',
    endpoints: {
      users: '/api/users',
      tasks: '/api/tasks'
    }
  });
});

// Rotas
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

// Rota 404
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Rota não encontrada!'
  });
});

export default app;