import { gql } from '@apollo/client';
import { ANIMAL_FIELDS } from './animal.fragment';
import { USER_FIELDS_LIGHT } from '../User/user.fragment';
import { COMPANY_HAS_USER_FIELDS_LIGHT } from '../CompanyHasUser/companyHasUser.fragment';
import { COMPANY_FIELDS_LIGHT_WITH_NAME } from '../Company/company.fragment';

export const GET_All_ANIMALS = gql`
  ${ANIMAL_FIELDS}
  query getAllAnimal {
    getAllAnimal {
      ...AnimalFields
    }
  }
`;

export const GET_ANIMAL_TYPES = gql`
  query getAnimalTypes {
    getAnimalTypes {
      options {
        label
        value
      }
    }
  }
`;

export const GET_ANIMAL_BREED_TYPES = gql`
  query getAnimalBreedTypes {
    getAnimalBreedTypes {
      options {
        label
        value
      }
    }
  }
`;

export const GET_COMPANY_HAS_USER_WISE_ANIMALS = gql`
  ${USER_FIELDS_LIGHT}
  ${COMPANY_HAS_USER_FIELDS_LIGHT}
  ${ANIMAL_FIELDS}
  ${COMPANY_FIELDS_LIGHT_WITH_NAME}
  query getCompanyHasUserWiseAnimals {
    getCurrentUser {
      ...UserFieldsWithId
      company_has_users {
        ...CompanyHasUserFieldsWithId
        company {
          ...CompanyFieldsWithIdAndName
        }
        company_has_user_has_animals {
          id
          animal {
            ...AnimalFields
          }
        }
      }
    }
  }
`;

export const GET_ANIMAL_LIGHT = gql`
  ${ANIMAL_FIELDS}
  query getAnimal($id: Float!) {
    getAnimal(id: $id) {
      ...AnimalFields
    }
  }
`;
