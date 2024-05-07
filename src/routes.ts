import express from 'express';
import GlobalController from './controllers';

const router = express.Router();

router.get("/", GlobalController.getHelloWorld);

router.post("/register", GlobalController.registerUser);

router.get("/online-users", GlobalController.getOnlineUsers);

router.get("/chat_session", GlobalController.getChatSessions);

router.post("/chat_session", GlobalController.createChatSession)

router.get("/messages", GlobalController.getMessages);

export default router;
