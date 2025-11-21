import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const connection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Função para testar a conexão
export const testConnection = async () => {
  try {
    const conn = await connection.getConnection();
    console.log('✅ Conexão com MySQL estabelecida com sucesso!');
    conn.release();
  } catch (error) {
    console.error('❌ Erro ao conectar com MySQL:', error);
    throw error;
  }
};

export default connection;