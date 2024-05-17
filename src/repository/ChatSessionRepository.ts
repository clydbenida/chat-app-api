import { Op, col, fn, literal } from "sequelize";

import ChatSession from "../models/ChatSession";
import Participant from "../models/Participant";
import User from "../models/User";
import { ChatSessionTypes, GetChatSessionsParams } from "../types";
import Message from "../models/Message";

class ChatRepositoryClass {
  async getChatSessions(params: GetChatSessionsParams) {
    try {
      const latestChatSubQuery = `SELECT MAX(createdAt) as createdAt FROM messages GROUP BY chat_session_id `;
      return ChatSession.findAll({
        attributes: ["chat_session_id", "chat_session_name", "session_type"],
        include: [
          {
            attributes: ["participant_id", "user_id", "chat_session_id"],
            model: Participant,
            include: [User],
            where: {
              ...params,
            },
          },
          {
            attributes: ["createdAt", "content", "message_id"],
            model: Message,
            where: {
              [Op.and]: [
                {
                  chat_session_id: {
                    [Op.col]: "chat_session.chat_session_id",
                  },
                },
                { createdAt: { [Op.in]: literal(`(${latestChatSubQuery})`) } },
              ],
            },
          },
        ],
        order: [[col("messages.createdAt"), "DESC"]],
      });
    } catch (err) {
      console.log(err);
    }
  }

  async getChatSession(params: GetChatSessionsParams) {
    try {
      return ChatSession.findOne({
        attributes: ["chat_session_id", "chat_session_name", "session_type"],
        include: [
          {
            attributes: ["participant_id", "user_id", "chat_session_id"],
            model: Participant,
            include: [User],
            where: {
              ...params,
            },
          },
        ],
      });
    } catch (err) {
      console.log(err);
    }
  }

  async createOneChatSession(
    chat_session_name: string,
    type?: ChatSessionTypes,
  ) {
    try {
      return ChatSession.create(
        {
          chat_session_name,
          session_type: type ?? "private",
        },
        { raw: true },
      );
    } catch (err) {
      console.log(err);
    }
  }

  async getExistingSession(user_ids: string[]) {
    try {
      return ChatSession.findAll({
        attributes: ["chat_session_id", [fn("COUNT", col("*")), "c"]],
        include: [
          {
            model: Participant,
            where: {
              user_id: {
                [Op.in]: user_ids,
              },
            },
            include: [User],
          },
        ],
        where: {
          session_type: "private",
        },
        group: "chat_session_id",
        having: literal("c > 1"),
      });
    } catch (err) {
      console.log(err);
    }
  }
}

const ChatSessionRepository = new ChatRepositoryClass();

export default ChatSessionRepository;
