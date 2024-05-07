
import { Server } from "socket.io";
import SocketEvents from "./events";
import { CreateMessageType } from "../types";

export default function initSocket(io: Server) {
  io.on('connection', (socket) => {
    try {
      console.log('a user connected');

      socket.on('send-message', (messageObj: CreateMessageType) => SocketEvents.createMessage(messageObj, socket));

      socket.on('remove-online-user', (username: string) => {
        console.log(`User remove ${username} disconnected`)
      });

      socket.on('join-session', (chat_session_id: number) => {
        socket.join(`chat_session:${chat_session_id.toString()}`);
      });
    } catch (err) {
      console.log(err);

      socket.emit("error-socket", { message: err });
    }
  })
}
