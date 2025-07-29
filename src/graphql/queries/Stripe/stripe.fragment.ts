import { gql } from '@apollo/client';

const STRIPE_PRODUCT_FIELDS = gql`
  fragment StripeProductFields on StripePlan {
    productId
    productName
    description
    prices {
      priceId
      unitAmount
      currency
      interval
      interval_count
    }
  }
`;

export const STRIPE_PLAN_FIELDS = gql`
  ${STRIPE_PRODUCT_FIELDS}
  fragment StripePlanResultFields on StripePlanResult {
    companyId
    companyName
    stripePublishKey
    plans {
      ...StripeProductFields
    }
  }
`;
