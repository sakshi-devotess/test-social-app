import { gql } from '@apollo/client';

export const COMPANY_HAS_USER_HAS_PRODUCT_FIELDS = gql`
    fragment CompanyHasUserHasProductFields on CompanyHasUserHasProduct {
        id
        product_id
        company_has_user_id
        status
        created
        created_by_company_has_user_id
        payment_intent_id
        payment_intent_data
    }
`;

export const COMPANY_HAS_USER_HAS_PRODUCT_FIELDS_LIGHT = gql`
    fragment CompanyHasUserHasProductFieldsWithId on CompanyHasUserHasProduct {
        id
    }
`;
