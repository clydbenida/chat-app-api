import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../db";

export type UserAttributes = {
  user_id: number;
  username: string;
  session_token: string;
}

type UserCreationAttributes = Optional<UserAttributes, 'user_id'>

class User extends Model<UserAttributes, UserCreationAttributes> {
  declare user_id: string;
  declare username: string;
  declare session_token: string;
}

User.init({
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
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

}, {
  sequelize,
  timestamps: false,
  modelName: 'user',
});

export default User;
