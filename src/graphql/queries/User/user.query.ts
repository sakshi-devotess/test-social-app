import { gql } from '@apollo/client';
import { USER_FIELDS, USER_FIELDS_LIGHT, USER_FIELDS_WITH_VALID_EMAILS } from './user.fragment';
import {
  COMPANY_HAS_USER_FIELDS,
  COMPANY_HAS_USER_FIELDS_LIGHT,
} from '../CompanyHasUser/companyHasUser.fragment';
import { COMPANY_FIELDS, COMPANY_FIELDS_LIGHT } from '../Company/company.fragment';

export const GET_CURRENT_USER = gql`
  ${USER_FIELDS_WITH_VALID_EMAILS}
  ${COMPANY_HAS_USER_FIELDS}
  ${COMPANY_FIELDS}
  query getCurrentUser {
    getCurrentUser {
      ...UserFieldsWithValidEmails
      company_has_users {
        ...CompanyHasUserFields
        company {
          ...CompanyFields
        }
      }
    }
  }
`;

export const GET_All_USERS = gql`
  ${USER_FIELDS_LIGHT}
  ${COMPANY_HAS_USER_FIELDS_LIGHT}
  ${COMPANY_FIELDS_LIGHT}
  ${USER_FIELDS}
  query getAllUser($companyHasUserId: Float) {
    getCurrentUser {
      ...UserFieldsWithId
      company_has_users(id: $companyHasUserId) {
        ...CompanyHasUserFieldsWithId
        company {
          ...CompanyFieldsWithId
          user {
            ...UserFields
            company_has_users {
              ...CompanyHasUserFieldsWithId
            }
          }
        }
      }
    }
  }
`;
