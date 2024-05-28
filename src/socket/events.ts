import { Socket } from "socket.io";
import MessageRepository from "../repository/MessageRepository";
import ParticipantRepository from "../repository/ParticipantRepository";
import { CreateMessageType } from "../types";

class SocketEventsClass {
  socket: Socket;

  constructor(socket: Socket) {
    this.socket = socket;
  }

  createMessage = async (messageObj: CreateMessageType) => {
    try {
      const response = await ParticipantRepository.getParticipantId(messageObj.chatSession.chat_session_id, messageObj.currentUser.user_id);

      if (response) {
        const newMessage = await MessageRepository.createMessage({
          chat_session_id: messageObj.chatSession.chat_session_id,
          participant_id: response.dataValues.participant_id,
          content: messageObj.message,
          read_status: false,
        })

        this.socket.to(`user:${messageObj.recepient_id}`).emit("receive-message", newMessage);
      }

    } catch (err) {
      console.log(err);
      throw new Error("Unable to send your message");
    }
  }

  joinSession = async (user_id: number) => {
    console.log("User joined: ", user_id)
    this.socket.join(`user:${user_id.toString()}`);
  }
}


export default SocketEventsClass;
