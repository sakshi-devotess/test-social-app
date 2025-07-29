import { gql } from '@apollo/client';

export const PRODUCT_FIELDS = gql`
    fragment ProductFields on Product {
        id
        company_id
        title
        description
        price
        start_time
        end_time
        status
        organizer_company_has_user_id
        created_by_company_has_user_id
        created
        type
        file_id
    }
`;

export const PRODUCT_FIELDS_LIGHT = gql`
    fragment ProductFieldsWithId on Product {
        id
    }
`;
