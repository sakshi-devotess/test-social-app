import { gql } from '@apollo/client';

export const COMPANY_FIELDS = gql`
  fragment CompanyFields on Company {
    id
    name
    organization_number
    active
    created_by_company_has_user_id
    our_reference_company_has_user_id
    company_type_id
    created
    logo_file_id
    stripe_publish_key
  }
`;

export const COMPANY_FIELDS_LIGHT = gql`
  fragment CompanyFieldsWithId on Company {
    id
  }
`;

export const COMPANY_FIELDS_LIGHT_WITH_NAME = gql`
  fragment CompanyFieldsWithIdAndName on Company {
    id
    name
  }
`;

export const COMPANY_FIELDS_LIGHT_WITH_NAME_AND_KEY = gql`
  fragment CompanyFieldsWithIdAndNameAndKey on Company {
    id
    name
    stripe_publish_key
  }
`;
