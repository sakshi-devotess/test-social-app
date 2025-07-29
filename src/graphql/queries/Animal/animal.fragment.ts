import { gql } from '@apollo/client';

export const ANIMAL_FIELDS = gql`
  fragment AnimalFields on Animal {
    id
    file_id
    name
    type
    created
    breed_type
    created_by_company_has_user_id
  }
`;

export const ANIMAL_FIELDS_LIGHT = gql`
  fragment AnimalFieldsWithId on Animal {
    id
  }
`;
