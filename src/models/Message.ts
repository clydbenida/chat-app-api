import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../db";
import ChatSession from "./ChatSession";
import Participant from "./Participant";

type MessageAttributes = {
  message_id: string;
  chat_session_id: number;
  participant_id: number;
  content: string;
  read_status: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export type MessageCreateAttributes = Optional<MessageAttributes, "message_id">;

class Message extends Model<MessageAttributes, MessageCreateAttributes> { }

Message.init({
  message_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  chat_session_id: {
    type: DataTypes.INTEGER,
    references: {
      key: 'chat_session_id',
      model: ChatSession,
    }
  },
  participant_id: {
    type: DataTypes.INTEGER,
    references: {
      key: 'participant_id',
      model: Participant,
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
}, {
  sequelize,
  modelName: 'messages'
});

Message.belongsTo(ChatSession, {
  foreignKey: 'chat_session_id',
  targetKey: 'chat_session_id',
});

ChatSession.hasMany(Message, {
  foreignKey: 'chat_session_id'
})

Message.belongsTo(Participant, {
  foreignKey: 'participant_id',
  targetKey: 'participant_id',
});

export default Message;
