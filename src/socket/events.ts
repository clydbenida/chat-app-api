import { Socket } from "socket.io";
import MessageRepository from "../repository/MessageRepository";
import ParticipantRepository from "../repository/ParticipantRepository";
import { CreateMessageType } from "../types";

class SocketEventsClass {
  async createMessage(messageObj: CreateMessageType, socket: Socket) {
    try {
      console.log("messageObj", messageObj);
      const response = await ParticipantRepository.getParticipantId(messageObj.chatSession.chat_session_id, messageObj.currentUser.user_id);

      console.log(response);
      if (response) {
        const newMessage = await MessageRepository.createMessage({
          chat_session_id: messageObj.chatSession.chat_session_id,
          participant_id: response.dataValues.participant_id,
          content: messageObj.message,
          read_status: false,
        })

        socket.to(`chat_session:${messageObj.chatSession.chat_session_id}`).emit("receive-message", newMessage);
      }

    } catch (err) {
      console.log(err);
      throw new Error("Unable to send your message");
    }
  }

}

const SocketEvents = new SocketEventsClass();

export default SocketEvents;
