const { Sequelize } = require("sequelize");



const sequelize = new Sequelize(
    'postgres',
    'postgres.nkxsocytllzusgpiydel',
    '3wjonx9eBJ4USSIv',
    {
        host: 'aws-0-sa-east-1.pooler.supabase.com',
        dialect: 'postgres',
        port: 5432,
        logging: false
    }
);

(
    async ()=>{
        try {
            await sequelize.authenticate();
            console.log('BD conectado!')
        } catch (error) {
            console.error('\nErro ao conectar ao DB')
        }
    }
)();

module.exports = sequelize;