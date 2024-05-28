import { Model } from "sequelize";
import { ChatSessionAttribute } from "../models/ChatSession";
import { ParticipantAttributes, ParticipantCreateAttributes } from "../models/Participant";
import { UserAttributes } from "../models/User";

export type ParsedParticipantType = {
  user_id: number;
  participant_id: number;
  username: string;
  nickname?: string;
}

export interface CreateMessageType {
  message: string,
  chatSession: ChatSessionType;
  currentUser: UserAttributes;
  recepient_id?: number;
}

export interface ChatSessionType extends ChatSessionAttribute {
  participants: ParticipantType[];
}

export interface ParticipantType extends Model<ParticipantAttributes, ParticipantCreateAttributes> {
  user?: UserAttributes;
}

export type ChatSessionTypes = 'private' | 'group';

export interface GetChatSessionsParams {
  user_id?: number;
  chat_session_id?: number;
}
