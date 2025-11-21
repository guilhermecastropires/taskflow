import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt, { SignOptions, Secret } from 'jsonwebtoken';
import connection from '../models/connectionModels';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// Interface para o usuário
interface User extends RowDataPacket {
  id: number;
  nome: string;
  email: string;
  senha: string;
  created_at: Date;
}

// Gerar JWT Token
const generateToken = (userId: number): string => {
  const secret = process.env.JWT_SECRET as Secret;
  if (!secret) {
    throw new Error('JWT_SECRET não configurado no arquivo .env');
  }

  // O cast "as any" só é usado aqui pra contornar o tipo restrito
  const options: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as any,
  };

  return jwt.sign({ id: userId }, secret, options);
};

// Registrar novo usuário
export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nome, email, senha } = req.body;

    // Validação dos campos
    if (!nome || !email || !senha) {
      res.status(400).json({ 
        success: false, 
        message: 'Todos os campos são obrigatórios!' 
      });
      return;
    }

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ 
        success: false, 
        message: 'Email inválido!' 
      });
      return;
    }

    // Validação da senha (mínimo 6 caracteres)
    if (senha.length < 6) {
      res.status(400).json({ 
        success: false, 
        message: 'A senha deve ter no mínimo 6 caracteres!' 
      });
      return;
    }

    // Verificar se o email já existe
    const [existingUsers] = await connection.query<User[]>(
      'SELECT * FROM usuarios WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      res.status(409).json({ 
        success: false, 
        message: 'Email já cadastrado!' 
      });
      return;
    }

    // Hash da senha
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS || '10');
    const hashedPassword = await bcrypt.hash(senha, saltRounds);

    // Inserir usuário no banco
    const [result] = await connection.query<ResultSetHeader>(
      'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)',
      [nome, email, hashedPassword]
    );

    // Gerar token
    const token = generateToken(result.insertId);

    res.status(201).json({
      success: true,
      message: 'Usuário cadastrado com sucesso!',
      data: {
        id: result.insertId,
        nome,
        email,
        token
      }
    });
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro interno do servidor!' 
    });
  }
};

// Login de usuário
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, senha } = req.body;

    // Validação dos campos
    if (!email || !senha) {
      res.status(400).json({ 
        success: false, 
        message: 'Email e senha são obrigatórios!' 
      });
      return;
    }

    // Buscar usuário pelo email
    const [users] = await connection.query<User[]>(
      'SELECT * FROM usuarios WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      res.status(401).json({ 
        success: false, 
        message: 'Email ou senha incorretos!' 
      });
      return;
    }

    const user = users[0];

    // Verificar senha
    const passwordMatch = await bcrypt.compare(senha, user.senha);

    if (!passwordMatch) {
      res.status(401).json({ 
        success: false, 
        message: 'Email ou senha incorretos!' 
      });
      return;
    }

    // Gerar token
    const token = generateToken(user.id);

    // Login bem-sucedido
    res.status(200).json({
      success: true,
      message: 'Login realizado com sucesso!',
      data: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        token
      }
    });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro interno do servidor!' 
    });
  }
};

// Deletar usuário (protegido)
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId; // Vem do middleware de autenticação

    // Deletar todas as tarefas do usuário primeiro
    await connection.query('DELETE FROM tarefas WHERE usuario_id = ?', [userId]);

    // Deletar usuário
    await connection.query('DELETE FROM usuarios WHERE id = ?', [userId]);

    res.status(200).json({
      success: true,
      message: 'Conta deletada com sucesso!'
    });
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro interno do servidor!' 
    });
  }
};