import { gql } from '@apollo/client';
export const USER_FIELDS = gql`
  fragment UserFields on User {
    id
    username
    first_name
    last_name
    created_by_company_has_user_id
    password
    active
    language
    file_id
  }
`;

export const USER_FIELDS_LIGHT = gql`
  fragment UserFieldsWithId on User {
    id
  }
`;

export const USER_ID_INCLUDE_FALSE = gql`
  fragment UserFieldsWithIdIncludeFalse on User {
    id @include(if: false)
  }
`;

export const USER_FIELDS_WITH_VALID_EMAILS = gql`
  ${USER_FIELDS}
  fragment UserFieldsWithValidEmails on User {
    ...UserFields
  }
`;

export const USER_FIELDS_LIGHT_WITH_NAME = gql`
  fragment UserFieldsWithIdAndName on User {
    id
    first_name
    last_name
  }
`;
