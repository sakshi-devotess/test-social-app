import { gql } from '@apollo/client';
import { COMPANY_HAS_USER_HAS_PRODUCT_FIELDS } from './companyHasUserHasProduct.fragment';
import { PRODUCT_FIELDS } from '../Product/product.fragment';
import { COMPANY_FIELDS_LIGHT_WITH_NAME_AND_KEY } from '../Company/company.fragment';
import { COMPANY_HAS_USER_FIELDS_LIGHT } from '../CompanyHasUser/companyHasUser.fragment';
import { USER_FIELDS_LIGHT_WITH_NAME } from '../User/user.fragment';

export const GET_All_COMPANY_HAS_USER_HAS_PRODUCTS = gql`
  ${COMPANY_HAS_USER_HAS_PRODUCT_FIELDS}
  query getAllCompanyHasUserHasProduct {
    getAllCompanyHasUserHasProduct {
      ...CompanyHasUserHasProductFields
    }
  }
`;

export const GET_COMPANY_HAS_USER_HAS_EVENTS = gql`
  ${COMPANY_HAS_USER_HAS_PRODUCT_FIELDS}
  ${PRODUCT_FIELDS}
  ${COMPANY_FIELDS_LIGHT_WITH_NAME_AND_KEY}
  ${COMPANY_HAS_USER_FIELDS_LIGHT}
  ${USER_FIELDS_LIGHT_WITH_NAME}
  query getCompanyHasUserHasEvents {
    getCompanyHasUserHasEvents {
      ...CompanyHasUserHasProductFields
      product {
        ...ProductFields
        company {
          ...CompanyFieldsWithIdAndNameAndKey
        }
        organizer_company_has_user {
          ...CompanyHasUserFieldsWithId
          user {
            ...UserFieldsWithIdAndName
          }
        }
      }
      company_has_user {
        ...CompanyHasUserFieldsWithId
        user {
          ...UserFieldsWithIdAndName
        }
      }
    }
  }
`;

export const GET_COMPANY_HAS_USER_HAS_ARTICLES = gql`
  ${COMPANY_HAS_USER_HAS_PRODUCT_FIELDS}
  ${PRODUCT_FIELDS}
  ${COMPANY_FIELDS_LIGHT_WITH_NAME_AND_KEY}
  ${COMPANY_HAS_USER_FIELDS_LIGHT}
  ${USER_FIELDS_LIGHT_WITH_NAME}
  query getCompanyHasUserHasArticles {
    getCompanyHasUserHasArticles {
      ...CompanyHasUserHasProductFields
      product {
        ...ProductFields
        company {
          ...CompanyFieldsWithIdAndNameAndKey
        }
        organizer_company_has_user {
          ...CompanyHasUserFieldsWithId
          user {
            ...UserFieldsWithIdAndName
          }
        }
      }
    }
  }
`;
