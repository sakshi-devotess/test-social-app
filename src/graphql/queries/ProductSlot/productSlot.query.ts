import { gql } from '@apollo/client';
import { PRODUCT_SLOT_FIELDS } from './productSlot.fragment';
import { COMPANY_HAS_USER_FIELDS_LIGHT } from '../CompanyHasUser/companyHasUser.fragment';
import { USER_FIELDS_LIGHT_WITH_NAME } from '../User/user.fragment';

export const GET_All_PRODUCT_SLOTS = gql`
  ${PRODUCT_SLOT_FIELDS}
  ${COMPANY_HAS_USER_FIELDS_LIGHT}
  ${USER_FIELDS_LIGHT_WITH_NAME}
  query getAllProductSlot {
    getAllProductSlot {
      ...ProductSlotFields
      created_by_company_has_user {
        ...CompanyHasUserFieldsWithId
        user {
          ...UserFieldsWithIdAndName
        }
      }
    }
  }
`;

export const GET_PRODUCT_WISE_PRODUCT_SLOTS = gql`
  ${PRODUCT_SLOT_FIELDS}
  ${COMPANY_HAS_USER_FIELDS_LIGHT}
  ${USER_FIELDS_LIGHT_WITH_NAME}
  query getProductWiseProductSlots($productId: Float!) {
    getProductWiseProductSlots(product_id: $productId) {
      ...ProductSlotFields
      created_by_company_has_user {
        ...CompanyHasUserFieldsWithId
        user {
          ...UserFieldsWithIdAndName
        }
      }
    }
  }
`;
