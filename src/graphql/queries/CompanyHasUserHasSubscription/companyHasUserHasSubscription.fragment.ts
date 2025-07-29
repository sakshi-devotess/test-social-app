import { gql } from '@apollo/client';

export const COMPANY_HAS_USER_HAS_SUBSCRIPTION_FIELDS = gql`
  fragment CompanyHasUserHasSubscriptionFields on CompanyHasUserHasSubscription {
    id
    company_has_user_id
    active
    stripe_payment_id
    stripe_payment_data
    type
  }
`;

export const COMPANY_HAS_USER_HAS_SUBSCRIPTION_FIELDS_LIGHT = gql`
  fragment CompanyHasUserHasSubscriptionFieldsWithId on CompanyHasUserHasSubscription {
    id
  }
`;
