import { gql } from '@apollo/client';
import { COMPANY_HAS_USER_HAS_SUBSCRIPTION_FIELDS } from './companyHasUserHasSubscription.fragment';
import { STRIPE_SUBSCRIPTION_PAYMENT_HISTORY_FIELDS } from '../StripeSubscriptionPaymentHistory/stripeSubscriptionPaymentHistory.fragment';
import { COMPANY_HAS_USER_FIELDS_LIGHT } from '../CompanyHasUser/companyHasUser.fragment';
import { COMPANY_FIELDS_LIGHT } from '../Company/company.fragment';

export const GET_COMPANY_HAS_USER_WISE_SUBSCRIPTIONS = gql`
  ${COMPANY_HAS_USER_HAS_SUBSCRIPTION_FIELDS}
  query getCompanyHasUserWiseSubscription($companyHasUserId: Float!) {
    getCompanyHasUserWiseSubscription(companyHasUserId: $companyHasUserId) {
      ...CompanyHasUserHasSubscriptionFields
    }
  }
`;

export const GET_COMPANY_HAS_USERS_WISE_SUBSCRIPTIONS = gql`
  ${COMPANY_HAS_USER_HAS_SUBSCRIPTION_FIELDS}
  ${COMPANY_HAS_USER_FIELDS_LIGHT}
  ${COMPANY_FIELDS_LIGHT}
  query getCompanyHasUsersWiseSubscription {
    getCompanyHasUsersWiseSubscription {
      ...CompanyHasUserHasSubscriptionFields
      company_has_user {
        ...CompanyHasUserFieldsWithId
        company {
          ...CompanyFieldsWithId
        }
      }
    }
  }
`;

export const GET_COMPANY_HAS_USER_WISE_SUBSCRIPTIONS_WITH_PAYMENT_HISTORY = gql`
  ${COMPANY_HAS_USER_HAS_SUBSCRIPTION_FIELDS}
  ${STRIPE_SUBSCRIPTION_PAYMENT_HISTORY_FIELDS}
  query getCompanyHasUserWiseSubscription($companyHasUserId: Float!) {
    getCompanyHasUserWiseSubscription(companyHasUserId: $companyHasUserId) {
      ...CompanyHasUserHasSubscriptionFields
      stripe_subscription_payment_histories {
        ...StripeSubscriptionPaymentHistoryFields
      }
    }
  }
`;
