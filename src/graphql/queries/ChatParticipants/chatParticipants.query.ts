import { gql } from '@apollo/client';
import { CHAT_PARTICIPANTS_FIELDS } from './chatParticipants.fragment';

export const GET_All_CHAT_PARTICIPANTS = gql`
    ${CHAT_PARTICIPANTS_FIELDS}
    query getAllChatParticipants {
        getAllChatParticipants {
            ...ChatParticipantsFields
        }
    }
`;
