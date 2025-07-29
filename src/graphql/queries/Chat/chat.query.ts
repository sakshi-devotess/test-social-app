import { gql } from '@apollo/client';
import { CHAT_FIELDS } from './chat.fragment';
import { CHAT_PARTICIPANTS_FIELDS } from '../ChatParticipants/chatParticipants.fragment';
import { CHAT_MESSAGES_FIELDS } from '../ChatMessages/chatMessages.fragment';

export const GET_All_CHATS = gql`
  ${CHAT_FIELDS}
  query getAllChat {
    getAllChat {
      ...ChatFields
    }
  }
`;

export const GET_CHAT_BY_CHAT_ID = gql`
  ${CHAT_FIELDS}
  ${CHAT_MESSAGES_FIELDS}
  query getChat($chatId: Float!) {
    getChat(id: $chatId) {
      ...ChatFields
      chat_messages {
        ...ChatMessagesFields
      }
    }
  }
`;

export const GET_USER_CHATS = gql`
  ${CHAT_PARTICIPANTS_FIELDS}
  query getUserChat($companyHasUserId: Float!) {
    getUserChat(companyHasUserId: $companyHasUserId) {
      ...ChatParticipantsFields
    }
  }
`;
