import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Estender o tipo Request para incluir userId
declare global {
  namespace Express {
    interface Request {
      userId?: number;
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  try {
    // Pegar o token do header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({
        success: false,
        message: 'Token não fornecido!'
      });
      return;
    }

    // Formato: "Bearer TOKEN"
    const parts = authHeader.split(' ');

    if (parts.length !== 2) {
      res.status(401).json({
        success: false,
        message: 'Token mal formatado!'
      });
      return;
    }

    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme)) {
      res.status(401).json({
        success: false,
        message: 'Token mal formatado!'
      });
      return;
    }

    // Verificar token
    jwt.verify(token, process.env.JWT_SECRET!, (err, decoded) => {
      if (err) {
        res.status(401).json({
          success: false,
          message: 'Token inválido ou expirado!'
        });
        return;
      }

      // Adicionar userId ao request
      req.userId = (decoded as any).id;
      next();
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Erro na autenticação!'
    });
  }
};