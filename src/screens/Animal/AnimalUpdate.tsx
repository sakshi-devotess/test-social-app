import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import AnimalForm from './AnimalForm';
import { mutateFromFormData, MUTATION_TYPE_UPDATE } from '../../graphql/mutation.service';
import { GET_ANIMAL_LIGHT } from '../../graphql/queries/Animal/animal.query';
import { useLazyQuery } from '@apollo/client';
import { getBase64FromUrl } from '../../library/utilities/helperFunction';
import fileApiInstance from '../../services/file/file.service';
import { setErrorsToForm } from '../../library/utilities/message';
import { MessageContext } from '../../contexts/MessageContext';
import { IAnimal, IUpdateAnimal } from './Animal.model';

export default function AnimalUpdate(props: IUpdateAnimal) {
  const { data, setAnimalDialog } = props;
  const [getAnimal] = useLazyQuery(GET_ANIMAL_LIGHT);
  const { pushMessageFromMutationResponse } = useContext(MessageContext);
  const [image, setImage] = useState(null);
  const initialValues = {
    name: data?.name ?? '',
    breed_type: data?.breed_type ?? null,
    animal_image: data?.animal_image ?? '',
  };

  const methods = useForm({
    values: initialValues,
  });

  useEffect(() => {
    if (!data) return;
    const fetchImages = async () => {
      try {
        const res = await fileApiInstance.getFile(data?.file_id);
        setImage(res);
        const logoBase64 = await getBase64FromUrl(res);
        methods.setValue('animal_image', logoBase64);
      } catch (error) {
        console.error('Error fetching file:', error);
      }
    };

    fetchImages();
  }, [data]);

  const onSubmit = async (formData: IAnimal) => {
    const res = await mutateFromFormData(
      { ...formData, id: data?.id },
      'Animal',
      MUTATION_TYPE_UPDATE
    );
    pushMessageFromMutationResponse(res?.response);
    if (res?.success) {
      getAnimal({
        variables: { id: data?.id },
      });
      setAnimalDialog(false);
    } else {
      setErrorsToForm(res?.response, methods);
    }
  };

  const handleClose = () => {
    methods.reset();
    setAnimalDialog(false);
  };

  return (
    <AnimalForm
      image={image}
      setImage={setImage}
      methods={methods}
      onSubmit={onSubmit}
      handleClose={handleClose}
      isEdit={true}
    />
  );
}
