import React, { useMemo } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { Controller, FormProvider } from 'react-hook-form';
import Input from '../../components/Form/Input/Input';
import FormPicker from '../../components/Form/Picker/Picker';
import ImagePickerInput from '../../components/Form/Image/ImagePickerInput';
import { GET_ANIMAL_BREED_TYPES } from '../../graphql/queries/Animal/animal.query';
import { useQuery } from '@apollo/client';
import { IAnimalForm } from './Animal.model';
import AppButton from '../../components/Button';
import { getDialogHeader } from '../../library/utilities/helperFunction';
import { useCapitalizedTranslation } from '../../hooks/useCapitalizedTranslation';

export default function AnimalForm(props: IAnimalForm) {
  const { image, setImage, methods, onSubmit, handleClose, isEdit } = props;
  const { data } = useQuery(GET_ANIMAL_BREED_TYPES);
  const { t } = useCapitalizedTranslation();
  const animalBreedTypes = useMemo(() => data?.getAnimalBreedTypes?.options ?? [], [data]);
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
      <View style={styles.container}>
        <Text style={styles.modalTitle}>
          {getDialogHeader('objects.animal.headingLabels.singular', t)}
        </Text>
        <FormProvider {...methods}>
          <Controller
            control={methods.control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <Input placeholder="Name" value={value} onChange={onChange} attribute="name" />
            )}
          />

          <View style={styles.fieldSpacing}>
            <Controller
              control={methods.control}
              name="breed_type"
              render={({ field: { onChange, value } }) => (
                <FormPicker
                  value={value}
                  onChange={onChange}
                  placeholder={t('objects.animal.attributes.breedType')}
                  items={animalBreedTypes}
                  attribute="breed_type"
                  searchable={true}
                />
              )}
            />
          </View>

          <Controller
            control={methods.control}
            name="animal_image"
            render={({ field: { onChange, value } }) => (
              <ImagePickerInput
                attribute="animal_image"
                image={image}
                setImage={setImage}
                onChange={onChange}
                value={value}
              />
            )}
          />

          <AppButton
            text={isEdit ? t('components.button.name.edit') : t('components.button.name.create')}
            onPress={methods.handleSubmit(onSubmit)}
          />
          <AppButton
            text={t('components.button.name.cancel')}
            onPress={handleClose}
            variant="cancel"
            style={styles.closeButton}
            textStyle={{ color: '#555' }}
          />
        </FormProvider>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  container: {
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
  },
  closeButton: {
    alignItems: 'center',
    marginTop: 10,
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  fieldSpacing: {
    marginBottom: 10,
  },
});
