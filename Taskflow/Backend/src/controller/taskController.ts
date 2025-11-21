import { Request, Response } from 'express';
import connection from '../models/connectionModels';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// Interface para tarefa
interface Task extends RowDataPacket {
  id: number;
  usuario_id: number;
  titulo: string;
  descricao: string;
  status: 'pendente' | 'em_progresso' | 'concluida';
  prioridade: 'baixa' | 'media' | 'alta';
  data_vencimento: Date | null;
  created_at: Date;
  updated_at: Date;
}

// Criar nova tarefa
export const createTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const { titulo, descricao, status, prioridade, data_vencimento } = req.body;

    // Validação
    if (!titulo) {
      res.status(400).json({
        success: false,
        message: 'O título é obrigatório!'
      });
      return;
    }

    // Valores padrão
    const taskStatus = status || 'pendente';
    const taskPriority = prioridade || 'media';

    // Inserir tarefa
    const [result] = await connection.query<ResultSetHeader>(
      `INSERT INTO tarefas (usuario_id, titulo, descricao, status, prioridade, data_vencimento) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, titulo, descricao || null, taskStatus, taskPriority, data_vencimento || null]
    );

    res.status(201).json({
      success: true,
      message: 'Tarefa criada com sucesso!',
      data: {
        id: result.insertId,
        titulo,
        descricao,
        status: taskStatus,
        prioridade: taskPriority,
        data_vencimento
      }
    });
  } catch (error) {
    console.error('Erro ao criar tarefa:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor!'
    });
  }
};

// Listar todas as tarefas do usuário
export const getAllTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const { status, prioridade } = req.query;

    let query = 'SELECT * FROM tarefas WHERE usuario_id = ?';
    const params: any[] = [userId];

    // Filtros opcionais
    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    if (prioridade) {
      query += ' AND prioridade = ?';
      params.push(prioridade);
    }

    query += ' ORDER BY created_at DESC';

    const [tasks] = await connection.query<Task[]>(query, params);

    res.status(200).json({
      success: true,
      data: tasks,
      total: tasks.length
    });
  } catch (error) {
    console.error('Erro ao buscar tarefas:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor!'
    });
  }
};

// Buscar tarefa por ID
export const getTaskById = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    const [tasks] = await connection.query<Task[]>(
      'SELECT * FROM tarefas WHERE id = ? AND usuario_id = ?',
      [id, userId]
    );

    if (tasks.length === 0) {
      res.status(404).json({
        success: false,
        message: 'Tarefa não encontrada!'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: tasks[0]
    });
  } catch (error) {
    console.error('Erro ao buscar tarefa:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor!'
    });
  }
};

// Atualizar tarefa
export const updateTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const { titulo, descricao, status, prioridade, data_vencimento } = req.body;

    // Verificar se a tarefa existe e pertence ao usuário
    const [tasks] = await connection.query<Task[]>(
      'SELECT * FROM tarefas WHERE id = ? AND usuario_id = ?',
      [id, userId]
    );

    if (tasks.length === 0) {
      res.status(404).json({
        success: false,
        message: 'Tarefa não encontrada!'
      });
      return;
    }

    // Construir query de update dinamicamente
    const updates: string[] = [];
    const params: any[] = [];

    if (titulo !== undefined) {
      updates.push('titulo = ?');
      params.push(titulo);
    }
    if (descricao !== undefined) {
      updates.push('descricao = ?');
      params.push(descricao);
    }
    if (status !== undefined) {
      updates.push('status = ?');
      params.push(status);
    }
    if (prioridade !== undefined) {
      updates.push('prioridade = ?');
      params.push(prioridade);
    }
    if (data_vencimento !== undefined) {
      updates.push('data_vencimento = ?');
      params.push(data_vencimento);
    }

    if (updates.length === 0) {
      res.status(400).json({
        success: false,
        message: 'Nenhum campo para atualizar!'
      });
      return;
    }

    params.push(id, userId);

    await connection.query(
      `UPDATE tarefas SET ${updates.join(', ')} WHERE id = ? AND usuario_id = ?`,
      params
    );

    // Buscar tarefa atualizada
    const [updatedTask] = await connection.query<Task[]>(
      'SELECT * FROM tarefas WHERE id = ?',
      [id]
    );

    res.status(200).json({
      success: true,
      message: 'Tarefa atualizada com sucesso!',
      data: updatedTask[0]
    });
  } catch (error) {
    console.error('Erro ao atualizar tarefa:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor!'
    });
  }
};

// Deletar tarefa
export const deleteTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    // Verificar se a tarefa existe e pertence ao usuário
    const [tasks] = await connection.query<Task[]>(
      'SELECT * FROM tarefas WHERE id = ? AND usuario_id = ?',
      [id, userId]
    );

    if (tasks.length === 0) {
      res.status(404).json({
        success: false,
        message: 'Tarefa não encontrada!'
      });
      return;
    }

    await connection.query('DELETE FROM tarefas WHERE id = ?', [id]);

    res.status(200).json({
      success: true,
      message: 'Tarefa deletada com sucesso!'
    });
  } catch (error) {
    console.error('Erro ao deletar tarefa:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor!'
    });
  }
};

// Marcar tarefa como concluída
export const markTaskAsCompleted = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    // Verificar se a tarefa existe e pertence ao usuário
    const [tasks] = await connection.query<Task[]>(
      'SELECT * FROM tarefas WHERE id = ? AND usuario_id = ?',
      [id, userId]
    );

    if (tasks.length === 0) {
      res.status(404).json({
        success: false,
        message: 'Tarefa não encontrada!'
      });
      return;
    }

    await connection.query(
      'UPDATE tarefas SET status = ? WHERE id = ?',
      ['concluida', id]
    );

    res.status(200).json({
      success: true,
      message: 'Tarefa marcada como concluída!'
    });
  } catch (error) {
    console.error('Erro ao marcar tarefa como concluída:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor!'
    });
  }
};

// Obter estatísticas das tarefas
export const getTaskStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId;

    const [stats] = await connection.query<RowDataPacket[]>(
      `SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'concluida' THEN 1 ELSE 0 END) as concluidas,
        SUM(CASE WHEN status = 'em_progresso' THEN 1 ELSE 0 END) as em_progresso,
        SUM(CASE WHEN status = 'pendente' THEN 1 ELSE 0 END) as pendentes,
        SUM(CASE WHEN prioridade = 'alta' THEN 1 ELSE 0 END) as alta_prioridade,
        SUM(CASE WHEN prioridade = 'media' THEN 1 ELSE 0 END) as media_prioridade,
        SUM(CASE WHEN prioridade = 'baixa' THEN 1 ELSE 0 END) as baixa_prioridade
       FROM tarefas 
       WHERE usuario_id = ?`,
      [userId]
    );

    res.status(200).json({
      success: true,
      data: stats[0]
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor!'
    });
  }
};