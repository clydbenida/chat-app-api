import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../db";
import User from "./User";

export type ParticipantAttributes = {
  participant_id: number;
  chat_session_id: number;
  user_id: number;
  nickname?: string;
}

export type ParticipantCreateAttributes = Optional<ParticipantAttributes, 'participant_id'>

class Participant extends Model<ParticipantAttributes, ParticipantCreateAttributes> { }

Participant.init({
  participant_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  chat_session_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'chat_sessions',
      key: 'chat_session_id',
    }
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'user_id',
    }
  },
  nickname: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  sequelize,
  timestamps: false,
  modelName: 'participants'
});

User.hasMany(Participant, {
  foreignKey: 'user_id',
  sourceKey: 'user_id',
})

Participant.belongsTo(User, {
  foreignKey: 'user_id',
  targetKey: 'user_id',
});

export default Participant;
