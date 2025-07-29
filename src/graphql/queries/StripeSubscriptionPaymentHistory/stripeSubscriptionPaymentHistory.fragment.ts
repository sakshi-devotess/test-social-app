import { gql } from '@apollo/client';

export const STRIPE_SUBSCRIPTION_PAYMENT_HISTORY_FIELDS = gql`
  fragment StripeSubscriptionPaymentHistoryFields on StripeSubscriptionPaymentHistory {
    id
    invoice_id
    amount
    status
    description
    invoice_data
    created
  }
`;

export const STRIPE_SUBSCRIPTION_PAYMENT_HISTORY_FIELDS_LIGHT = gql`
  fragment StripeSubscriptionPaymentHistoryFieldsWithId on StripeSubscriptionPaymentHistory {
    id
  }
`;
