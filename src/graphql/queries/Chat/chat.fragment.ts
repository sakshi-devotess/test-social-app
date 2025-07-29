import { gql } from '@apollo/client';

export const CHAT_FIELDS = gql`
    fragment ChatFields on Chat {
        id
        name
        is_group
        created
        created_by_company_has_user_id
    }
`;

export const CHAT_FIELDS_LIGHT = gql`
    fragment ChatFieldsWithId on Chat {
        id
    }
`;
