import { QueryInterface, DataTypes } from "sequelize";
import { sequelize } from "../db";

/** @type {import('sequelize-cli').Migration} */
async function migrateUp(queryInterface: QueryInterface) {
  const transaction = await queryInterface.sequelize.transaction();

  try {
    await queryInterface.createTable("chat_sessions", {
      chat_session_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      chat_session_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    });

    console.log("Transacting...");
    await transaction.commit();
  } catch (err) {
    await transaction.rollback();
    console.log(err);
  }
}

async function migrateDown(queryInterface: QueryInterface) {
  const transaction = await queryInterface.sequelize.transaction();

  try {
    await queryInterface.dropTable("chat_sessions");
    await transaction.commit();
  } catch (err) {
    await transaction.rollback();
    console.log(err);
  }
}

const direction = process.argv[2];

if (!(direction === "up" || direction === "down")) {
  throw Error("Please specify the direction - up or down");
}

if (direction.toLocaleLowerCase() === "up") {
  migrateUp(sequelize.getQueryInterface());
} else if (direction.toLocaleLowerCase() === "down") {
  migrateDown(sequelize.getQueryInterface());
}


