import { Op } from "sequelize";
import Participant from "../models/Participant";
import User from "../models/User";

class ParticipantRepositoryClass {
  async createParticipant(chat_session_id: number, user_id: number) {
    try {
      return Participant.create({
        chat_session_id,
        user_id,
      }, { raw: true });
    } catch (err) {
      console.log(err);
    }
  }

  async getParticipantId(chat_session_id: number, user_id: number) {
    try {
      return Participant.findOne({
        attributes: ['participant_id'],
        where: {
          user_id,
          chat_session_id,
        },
      })
    } catch (err) {
      console.log(err);
    }
  }

  async getParticipants(chat_session_id: number) {
    try {
      return Participant.findAll({
        include: [User],
        where: {
          chat_session_id: chat_session_id,
        }
      });
    } catch (err) {
      console.log(err);
    }
  }
}

const ParticipantRepository = new ParticipantRepositoryClass();

export default ParticipantRepository
