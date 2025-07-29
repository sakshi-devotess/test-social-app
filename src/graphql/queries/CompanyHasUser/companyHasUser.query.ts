// import { gql } from '@apollo/client';
// import { COMPANY_HAS_USER_FIELDS_LIGHT } from './companyHasUser.fragment';
// import { USER_FIELDS, USER_FIELDS_LIGHT } from '../User/user.fragment';
// import { COMPANY_FIELDS_LIGHT } from '../Company/company.fragment';

// export const GET_COMPANY_HAS_USERS = gql`
//   ${USER_FIELDS_LIGHT}
//   ${COMPANY_HAS_USER_FIELDS_LIGHT}
//   ${COMPANY_FIELDS_LIGHT}
//   ${USER_FIELDS}
//   query getAllUser($companyHasUserId: Float) {
//     getCurrentUser {
//       ...UserFieldsWithId
//       company_has_users(id: $companyHasUserId) {
//         ...CompanyHasUserFieldsWithId
//         company {
//           ...CompanyFieldsWithId
//           company_has_users {
//             ...CompanyHasUserFieldsWithId
//             user {
//               ...UserFields
//             }
//           }
//         }
//       }
//     }
//   }
// `;
