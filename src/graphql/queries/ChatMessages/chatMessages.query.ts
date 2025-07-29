import { gql } from '@apollo/client';
import { CHAT_MESSAGES_FIELDS } from './chatMessages.fragment';

export const GET_All_CHAT_MESSAGES = gql`
    ${CHAT_MESSAGES_FIELDS}
    query getAllChatMessages {
        getAllChatMessages {
            ...ChatMessagesFields
        }
    }
`;
