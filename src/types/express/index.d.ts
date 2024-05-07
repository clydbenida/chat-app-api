import { Request } from "express";
import { UserAttributes } from "./src/models/User";

declare global {
  namespace Express {
    export interface Request {
      online_users: UserAttributes[];
    }
  }
}

