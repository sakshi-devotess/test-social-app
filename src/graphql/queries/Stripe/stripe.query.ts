import { gql } from '@apollo/client';
import { STRIPE_PLAN_FIELDS } from './stripe.fragment';

export const GET_All_STRIPE_PLANS = gql`
  ${STRIPE_PLAN_FIELDS}
  query getAllPlans {
    getAllPlans {
      ...StripePlanResultFields
    }
  }
`;
