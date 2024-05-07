import { QueryInterface, DataTypes } from "sequelize";
import { sequelize } from "../db";

/** @type {import('sequelize-cli').Migration} */
async function migrateUp(queryInterface: QueryInterface) {
  const transaction = await queryInterface.sequelize.transaction();

  try {
    await queryInterface.createTable("messages", {
      message_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      chat_session_id: {
        type: DataTypes.INTEGER,
        references: {
          key: 'chat_session_id',
          model: 'chat_sessions',
        }
      },
      participant_id: {
        type: DataTypes.INTEGER,
        references: {
          key: 'participant_id',
          model: 'participants',
        }
      },
      content: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      read_status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      }
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
    await queryInterface.dropTable("messages");
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

