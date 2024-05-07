import { Sequelize } from "sequelize";

export const sequelize = new Sequelize('chat_app', 'root', 'coolpb', {
  host: 'localhost',
  dialect: 'mysql',
});

export async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}
