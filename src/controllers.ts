import { Request, Response } from "express";
import UserRepository from "./repository/UserRepository";
import { generateToken } from "./token";
import ParticipantRepository from "./repository/ParticipantRepository";
import { ParticipantAttributes } from "./models/Participant";
import { ChatSessionType, ParsedParticipantType } from "./types";
import ChatSessionRepository from "./repository/ChatSessionRepository";
import MessageRepository from "./repository/MessageRepository";
import { Socket } from "socket.io";

class GlobalControllerClass {
  getHelloWorld(req: Request, res: Response) {
    res.send("Hello, world!");
  }

  async registerUser(req: Request, res: Response) {
    const { username } = req.body;

    const foundUser = await UserRepository.findOneUser({ username });

    if (foundUser) {
      const token = generateToken(foundUser.dataValues)
      res.status(201).json({
        data: {
          token,
          user: foundUser.dataValues,
        }
      });

      return;
    }
    const newUser = await UserRepository.createUser(username);

    const token = generateToken(newUser.dataValues)
    res.status(201).json({
      data: {
        token,
        user: newUser.dataValues
      }
    })
  }

  async getOnlineUsers(req: Request, res: Response) {
    const { username } = req.query;

    const allUsers = await UserRepository.getAllUsers();
    const filteredUsers = allUsers.filter(user => user.username !== username);

    res.json({
      data: filteredUsers,
    });
  }

  async createChatSession(req: Request, res: Response) {
    try {
      const { chat_name, user_ids } = req.body;

      if (!user_ids) {
        res.status(400).json({ message: "user_ids can't be empty!" });
        return;
      }

      if (user_ids?.length <= 1) {
        res.status(400).json({ message: "invalid number of user_ids" });
        return;
      }

      // Before creating a chat session, check first if the participants for the chat session is not duplicated
      const existingSession = await ChatSessionRepository.getExistingSession(user_ids);

      if (existingSession?.length) {
        // If there is an existing session, fetch the existing session along with its participants
        console.log(existingSession)
        const chatSession = await ChatSessionRepository.getChatSession({ chat_session_id: existingSession[0].dataValues.chat_session_id });
        res.status(201).json({ data: chatSession })
        return;
      }

      const newChatSession = await ChatSessionRepository.createOneChatSession(chat_name ?? "");
      const chat_session_id = newChatSession?.dataValues.chat_session_id;

      if (!chat_session_id) {
        throw new Error("Unable to create chat_session");
      }

      const participants: ParsedParticipantType[] = [];

      for (let i = 0; i < user_ids.length; i++) {
        const newParticipant = await ParticipantRepository.createParticipant(chat_session_id, user_ids[i]);
        const foundUser = await UserRepository.findOneUser({ user_id: newParticipant?.dataValues.user_id });

        participants.push({
          user_id: newParticipant?.dataValues.user_id!,
          participant_id: newParticipant?.dataValues.participant_id!,
          nickname: newParticipant?.dataValues.nickname,
          username: foundUser?.username!
        });
      }

      res.json({
        data: {
          participants,
          ...newChatSession.dataValues,
        }
      })
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "something went wrong." })
    }
  }

  async getChatSessions(req: Request, res: Response) {
    try {
      const { user_id } = req.query;
      const parsedChatSessions: ChatSessionType[] = [];
      const userChatSessions = await ChatSessionRepository.getChatSessions({ user_id: Number(user_id) });

      if (!userChatSessions) {
        res.status(200).json({ message: "No chat sessions found" });
        return;
      }

      for (let i = 0; i < userChatSessions?.length; i++) {
        const otherParticipants = await ParticipantRepository.getParticipants(userChatSessions[i].dataValues.chat_session_id);

        parsedChatSessions.push({
          ...userChatSessions[i].dataValues,
          chat_session_id: userChatSessions[i].dataValues.chat_session_id,
          chat_session_name: userChatSessions[i].dataValues.chat_session_name,
          participants: otherParticipants!,
          session_type: userChatSessions[i].dataValues.session_type,
        })
      }

      res.json({ data: parsedChatSessions })
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "something went wrong while fetching your chat sessions" });
    }
  }

  async getMessages(req: Request, res: Response) {
    try {
      const { chat_session_id, limit, offset } = req.query;
      const messages = await MessageRepository.getMessages(Number(limit), Number(offset), Number(chat_session_id));

      res.status(200).json({ data: messages });
    } catch (err) {
      console.log(err);
    }
  }
}

const GlobalController = new GlobalControllerClass();

export default GlobalController;
