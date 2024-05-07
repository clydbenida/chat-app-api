
import { QueryInterface, DataTypes } from "sequelize";
import { sequelize } from "../db";

/** @type {import('sequelize-cli').Migration} */
async function migrateUp(queryInterface: QueryInterface) {
  const transaction = await queryInterface.sequelize.transaction();

  try {
    await queryInterface.addColumn("chat_sessions", "session_type", {
      type: DataTypes.ENUM('private', 'group'),
      allowNull: false,
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
    await queryInterface.removeColumn("chat_sessions", "session_type");
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

