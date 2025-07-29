import { gql } from '@apollo/client';

export const CHAT_PARTICIPANTS_FIELDS = gql`
    fragment ChatParticipantsFields on ChatParticipants {
        id
        chat_id
        company_has_user_id
        is_admin
        created
        created_by_company_has_user_id
    }
`;

export const CHAT_PARTICIPANTS_FIELDS_LIGHT = gql`
    fragment ChatParticipantsFieldsWithId on ChatParticipants {
        id
    }
`;
