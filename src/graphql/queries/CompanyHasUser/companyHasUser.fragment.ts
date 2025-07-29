import { gql } from '@apollo/client';

export const COMPANY_HAS_USER_FIELDS = gql`
  fragment CompanyHasUserFields on CompanyHasUser {
    id
    created_by_company_has_user_id
    company_id
    user_id
    email
    phone
    mobilephone
    active
    created
  }
`;

export const COMPANY_HAS_USER_FIELDS_LIGHT = gql`
  fragment CompanyHasUserFieldsWithId on CompanyHasUser {
    id
  }
`;
