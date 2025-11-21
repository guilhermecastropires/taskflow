import app from './app';
import { testConnection } from './models/connectionModels';
import dotenv from 'dotenv';

// Carregar variáveis de ambiente ANTES de tudo
dotenv.config();

const PORT = process.env.PORT || 3000;

// Verificar se a porta está correta
console.log('🔍 Variáveis de Ambiente:');
console.log(`   PORT do servidor: ${PORT}`);
console.log(`   DB_PORT do MySQL: ${process.env.DB_PORT}`);
console.log('');

// Inicializar servidor
const startServer = async () => {
  try {
    // Testar conexão com o banco
    console.log('🔄 Tentando conectar ao MySQL...');
    console.log(`   Host: ${process.env.DB_HOST}`);
    console.log(`   Porta: ${process.env.DB_PORT}`);
    console.log(`   Banco: ${process.env.DB_NAME}`);
    console.log(`   Usuário: ${process.env.DB_USER}`);
    
    await testConnection();

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`📍 http://localhost:${PORT}`);
      console.log(`\n📋 Endpoints de Usuário:`);
      console.log(`   POST   /api/users/register - Registrar usuário`);
      console.log(`   POST   /api/users/login - Login`);
      console.log(`   DELETE /api/users/account - Deletar conta (protegido)`);
      console.log(`\n📋 Endpoints de Tarefas (todos protegidos):`);
      console.log(`   POST   /api/tasks - Criar tarefa`);
      console.log(`   GET    /api/tasks - Listar tarefas`);
      console.log(`   GET    /api/tasks/stats - Estatísticas`);
      console.log(`   GET    /api/tasks/:id - Buscar tarefa`);
      console.log(`   PUT    /api/tasks/:id - Atualizar tarefa`);
      console.log(`   DELETE /api/tasks/:id - Deletar tarefa`);
      console.log(`   PATCH  /api/tasks/:id/complete - Marcar como concluída`);
    });
  } catch (error) {
    console.error('\n❌ Erro ao iniciar servidor!');
    console.error('\n🔍 Possíveis causas:');
    console.error('   1. MySQL não está rodando');
    console.error('   2. Credenciais incorretas no .env');
    console.error('   3. Banco de dados não existe');
    console.error('   4. Porta MySQL incorreta\n');
    console.error('📝 Verifique o arquivo .env e certifique-se de que o MySQL está ativo.\n');
    console.error('Detalhes do erro:', error);
    process.exit(1);
  }
};

startServer();