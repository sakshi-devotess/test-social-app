import { gql } from '@apollo/client';
import { COMPANY_HAS_USER_HAS_ANIMAL_FIELDS } from './companyHasUserHasAnimal.fragment';

export const GET_All_COMPANY_HAS_USER_HAS_ANIMALS = gql`
    ${COMPANY_HAS_USER_HAS_ANIMAL_FIELDS}
    query getAllCompanyHasUserHasAnimal {
        getAllCompanyHasUserHasAnimal {
            ...CompanyHasUserHasAnimalFields
        }
    }
`;
