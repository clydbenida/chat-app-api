import express from 'express';
import { createServer } from "node:http";
import { Server } from 'socket.io';
import cors from "cors";
import router from './src/routes';
import { testConnection } from './src/db';
import { UserAttributes } from './src/models/User';
import initSocket from './src/socket';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  }
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(router);
initSocket(io);

server.listen(4000, () => {
  console.log('listening on port 4000');
  testConnection();
});
