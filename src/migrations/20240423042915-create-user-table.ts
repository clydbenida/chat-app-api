import { QueryInterface, DataTypes } from "sequelize";
import { sequelize } from "../db";

/** @type {import('sequelize-cli').Migration} */
async function migrateUp(queryInterface: QueryInterface) {
  const transaction = await queryInterface.sequelize.transaction();

  try {
    await queryInterface.createTable("users", {
      user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      session_token: {
        type: DataTypes.STRING,
        allowNull: true,
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
    await queryInterface.dropTable("users");
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

