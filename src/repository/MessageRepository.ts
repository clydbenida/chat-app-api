import Message, { MessageCreateAttributes } from "../models/Message";

class MessageRepositoryClass {
  async createMessage(newMessage: MessageCreateAttributes) {
    return Message.create({
      ...newMessage,
    });
  }

  async getMessages(limit = 10, offset = 0, chat_session_id: number) {
    try {
      return Message.findAndCountAll({
        where: {
          chat_session_id: chat_session_id,
        },
        limit,
        offset,
        order: [['createdAt', 'DESC']]
      });
    } catch (err) {
      console.log(err);
    }
  }
}

const MessageRepository = new MessageRepositoryClass();

export default MessageRepository;
