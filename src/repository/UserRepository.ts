import User from "../models/User";

type findOneUserParams = {
  username?: string;
  user_id?: number;
}

class UserRepositoryClass {
  async getAllUsers() {
    try {
      const users = await User.findAll({ raw: true });
      return users;
    } catch (err) {
      console.log(err);
      throw new Error(err as string);
    }
  }
  async findOneUser(params: findOneUserParams) {
    try {
      const user = await User.findOne({
        where: { ...params }
      });

      return user;
    } catch (err) {
      console.log(err);
      throw new Error(err as string);
    }
  }

  async createUser(username: string) {
    try {
      const res = await User.create({
        username,
        session_token: '',
      });

      return res;
    } catch (err) {
      console.log(err);
      throw new Error(err as string);
    }
  }
}

const UserRepository = new UserRepositoryClass();

export default UserRepository;
