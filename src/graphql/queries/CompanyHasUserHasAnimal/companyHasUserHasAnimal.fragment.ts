import { gql } from '@apollo/client';

export const COMPANY_HAS_USER_HAS_ANIMAL_FIELDS = gql`
  fragment CompanyHasUserHasAnimalFields on CompanyHasUserHasAnimal {
    id
    animal_id
    company_has_user_id
    created
  }
`;

export const COMPANY_HAS_USER_HAS_ANIMAL_FIELDS_LIGHT = gql`
  fragment CompanyHasUserHasAnimalFieldsWithId on CompanyHasUserHasAnimal {
    id
  }
`;
