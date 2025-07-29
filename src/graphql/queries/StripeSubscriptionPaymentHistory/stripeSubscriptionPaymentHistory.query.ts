import { gql } from '@apollo/client';
import { STRIPE_SUBSCRIPTION_PAYMENT_HISTORY_FIELDS } from './stripeSubscriptionPaymentHistory.fragment';

export const GET_All_STRIPE_SUBSCRIPTION_PAYMENT_HISTORIES = gql`
  ${STRIPE_SUBSCRIPTION_PAYMENT_HISTORY_FIELDS}
  query getAllStripeSubscriptionPaymentHistory {
    getAllStripeSubscriptionPaymentHistory {
      ...StripeSubscriptionPaymentHistoryFields
    }
  }
`;

export const GET_All_STRIPE_SUBSCRIPTION_PAYMENT_HISTORY_STATUS = gql`
  query getSubscriptionPaymentHistoryStatus {
    getSubscriptionPaymentHistoryStatus {
      options {
        label
        value
      }
    }
  }
`;
