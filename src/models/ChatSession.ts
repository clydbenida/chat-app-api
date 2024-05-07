import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../db";
import Participant from "./Participant";
import { ChatSessionTypes } from "../types";

export type ChatSessionAttribute = {
  chat_session_id: number;
  chat_session_name: string;
  session_type: ChatSessionTypes;
}

type ChatSessionCreateAttributes = Optional<ChatSessionAttribute, 'chat_session_id'>

class ChatSession extends Model<ChatSessionAttribute, ChatSessionCreateAttributes> { }

ChatSession.init({
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
  session_type: {
    type: DataTypes.ENUM('private', 'group')
  }
}, {
  sequelize,
  timestamps: false,
  modelName: "chat_session"
});

ChatSession.hasMany(Participant, {
  foreignKey: 'chat_session_id',
  sourceKey: 'chat_session_id'
});

Participant.belongsTo(ChatSession, {
  foreignKey: 'chat_session_id',
});

export default ChatSession;
