
import { Server } from "socket.io";
import { CreateMessageType } from "../types";
import SocketEventsClass from "./events";

export default function initSocket(io: Server) {
  io.on('connection', (socket) => {
    try {
      const SocketEvents = new SocketEventsClass(socket);
      console.log('a user connected');

      socket.on('send-message', SocketEvents.createMessage);

      socket.on('join-session', SocketEvents.joinSession);
    } catch (err) {
      console.log(err);

      socket.emit("error-socket", { message: err });
    }
  })
}
