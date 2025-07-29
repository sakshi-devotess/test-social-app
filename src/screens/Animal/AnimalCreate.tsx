import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import AnimalForm from './AnimalForm';
import { mutateFromFormData, MUTATION_TYPE_CREATE } from '../../graphql/mutation.service';
import { useLazyQuery } from '@apollo/client';
import { GET_COMPANY_HAS_USER_WISE_ANIMALS } from '../../graphql/queries/Animal/animal.query';
import { AuthenticatedUserContext } from '../../contexts/AuthenticatedUserContext';
import { setErrorsToForm } from '../../library/utilities/message';
import { IAnimal, ICreateAnimal } from './Animal.model';
import { MessageContext } from '../../contexts/MessageContext';

export default function AnimalCreate(props: ICreateAnimal) {
  const { setAnimalDialog } = props;
  const { user } = useContext(AuthenticatedUserContext);
  const { pushMessageFromMutationResponse } = useContext(MessageContext);
  const [image, setImage] = useState(null);
  const [getCompanyHasUserWiseAnimals] = useLazyQuery(GET_COMPANY_HAS_USER_WISE_ANIMALS);
  const methods = useForm<IAnimal>({
    defaultValues: { name: '', breed_type: null, animal_image: null },
  });

  const onSubmit = async (formData: IAnimal) => {
    const res = await mutateFromFormData(formData, 'Animal', MUTATION_TYPE_CREATE);
    pushMessageFromMutationResponse(res?.response);
    if (res?.success) {
      setAnimalDialog(false);
      methods.reset();
      getCompanyHasUserWiseAnimals({
        variables: { companyHasUserId: user?.companyHasUserId },
      });
    } else {
      setErrorsToForm(res?.response, methods);
    }
  };

  const handleClose = () => {
    setAnimalDialog(false);
    methods.reset();
  };

  return (
    <AnimalForm
      image={image}
      setImage={setImage}
      methods={methods}
      onSubmit={onSubmit}
      handleClose={handleClose}
    />
  );
}
