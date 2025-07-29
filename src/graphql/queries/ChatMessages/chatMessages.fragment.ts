import { gql } from '@apollo/client';

export const CHAT_MESSAGES_FIELDS = gql`
    fragment ChatMessagesFields on ChatMessages {
        id
        chat_id
        sender_id
        message
        file_id
        created
        read_type
        created_by_company_has_user_id
    }
`;

export const CHAT_MESSAGES_FIELDS_LIGHT = gql`
    fragment ChatMessagesFieldsWithId on ChatMessages {
        id
    }
`;
