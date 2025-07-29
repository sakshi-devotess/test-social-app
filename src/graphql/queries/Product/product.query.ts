import { gql } from '@apollo/client';
import { PRODUCT_FIELDS } from './product.fragment';
import { COMPANY_FIELDS_LIGHT_WITH_NAME_AND_KEY } from '../Company/company.fragment';
import { COMPANY_HAS_USER_FIELDS_LIGHT } from '../CompanyHasUser/companyHasUser.fragment';
import { USER_FIELDS_LIGHT_WITH_NAME } from '../User/user.fragment';
import { PRODUCT_SLOT_FIELDS } from '../ProductSlot/productSlot.fragment';

export const GET_All_PRODUCTS = gql`
  ${PRODUCT_FIELDS}
  query getAllProduct {
    getAllProduct {
      ...ProductFields
    }
  }
`;

export const GET_EVENTS = gql`
  ${PRODUCT_FIELDS}
  ${COMPANY_FIELDS_LIGHT_WITH_NAME_AND_KEY}
  ${COMPANY_HAS_USER_FIELDS_LIGHT}
  ${USER_FIELDS_LIGHT_WITH_NAME}
  ${PRODUCT_SLOT_FIELDS}
  query getEvents {
    getEvents {
      ...ProductFields
      product_slots {
        ...ProductSlotFields
      }
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
`;

export const GET_ARTICLES = gql`
  ${PRODUCT_FIELDS}
  ${COMPANY_FIELDS_LIGHT_WITH_NAME_AND_KEY}
  ${COMPANY_HAS_USER_FIELDS_LIGHT}
  ${USER_FIELDS_LIGHT_WITH_NAME}
  query getArticles {
    getArticles {
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
`;
