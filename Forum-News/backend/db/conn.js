const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('forumnews', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
});

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexão estabelecida com sucesso.');
  } catch (error) {
    console.error('Não foi possível conectar ao banco de dados:', error);
  }
};

testConnection();

module.exports = sequelize;
