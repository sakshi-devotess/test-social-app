import { gql } from '@apollo/client';
import { COMPANY_HAS_USER_FIELDS_LIGHT } from '../CompanyHasUser/companyHasUser.fragment';
import { USER_FIELDS } from '../User/user.fragment';
import { COMPANY_FIELDS } from './company.fragment';

export const GET_All_ADMIN_COMPANIES_LIGHT = gql`
  ${COMPANY_FIELDS}
  ${COMPANY_HAS_USER_FIELDS_LIGHT}
  ${USER_FIELDS}
  query getAllAdminCompany($isAllCompany: Boolean = false) {
    getAllAdminCompany(isAllCompany: $isAllCompany) {
      ...CompanyFields
      created_by_company_has_user {
        ...CompanyHasUserFieldsWithId
        user {
          ...UserFields
        }
      }
    }
  }
`;
