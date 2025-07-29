import { gql } from '@apollo/client';

export const PRODUCT_SLOT_FIELDS = gql`
    fragment ProductSlotFields on ProductSlot {
        id
        product_id
        title
        start_date_time
        end_date_time
        created_by_company_has_user_id
        created
    }
`;

export const PRODUCT_SLOT_FIELDS_LIGHT = gql`
    fragment ProductSlotFieldsWithId on ProductSlot {
        id
    }
`;
