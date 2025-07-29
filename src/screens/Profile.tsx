import React, { useContext, useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Keyboard,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { colors, languages } from '../config/constants';
import { AuthenticatedUserContext } from '../contexts/AuthenticatedUserContext';
import { Controller, useForm } from 'react-hook-form';
import Input from '../components/Form/Input/Input';
import { mutateFromFormData, MUTATION_TYPE_UPDATE } from '../graphql/mutation.service';
import { MessageContext } from '../contexts/MessageContext';
import fileApiInstance from '../services/file/file.service';
import { getBase64FromUrl } from '../library/utilities/helperFunction';
import { setErrorsToForm } from '../library/utilities/message';
import AppButton from '../components/Button';
import FormPicker from '../components/Form/Picker/Picker';
import { changeLanguageAndFetchTranslations } from '../i18n/i18n';
import { LocalStorageService } from '../i18n/languageStorage';
import { useCapitalizedTranslation } from '../hooks/useCapitalizedTranslation';

interface IUser {
  first_name: string;
  last_name: string;
  profile_picture: string | null;
  language: string;
}
const Profile = () => {
  const { user, setUser } = useContext(AuthenticatedUserContext);
  const { pushMessageFromMutationResponse } = useContext(MessageContext);
  const [image, setImage] = useState<string | null>(null);
  const { t } = useCapitalizedTranslation();
  const values = {
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    profile_picture: null,
    language: user?.language,
  };

  const methods = useForm<IUser>({
    defaultValues: {
      first_name: '',
      last_name: '',
      profile_picture: null,
      language: user?.language,
    },
    values,
  });
  const {
    control,
    formState: { errors },
    setValue,
  } = methods;

  useEffect(() => {
    const fetchProfilePicture = async (fileId: number) => {
      if (fileId) {
        try {
          const fileUrl = await fileApiInstance.getFile(fileId);
          setImage(fileUrl);
          const logoBase64 = await getBase64FromUrl(fileUrl);
          methods.setValue('profile_picture', logoBase64);
        } catch (fileError) {
          console.error('Error fetching updated profile image:', fileError);
        }
      }
    };
    if (user?.file_id) {
      fetchProfilePicture(user.file_id);
    }
  }, [user?.file_id]);

  const handleChangeProfilePicture = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      base64: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      const mimeType = asset.mimeType ?? 'image/jpeg';
      const fullBase64 = `data:${mimeType};base64,${asset.base64}`;
      setImage(asset.uri);
      setValue('profile_picture', fullBase64);
    }
  };

  const initials = user?.username
    ?.split(' ')
    .map((name) => name[0])
    .join('');

  const onHandleProfileUpdate = async (data: IUser) => {
    mutateFromFormData(data, 'MyProfileUser', MUTATION_TYPE_UPDATE, ['file_id']).then(
      async (res) => {
        pushMessageFromMutationResponse(res.response);
        if (res.success) {
          const fileId = res?.response?.file_id;

          const updatedUserData = {
            ...user,
            first_name: data?.first_name ?? user?.first_name,
            last_name: data?.last_name ?? user?.last_name,
            file_id: fileId,
            language: data?.language ?? user?.language,
          };

          changeLanguageAndFetchTranslations(data?.language);
          LocalStorageService.setLanguage(data?.language);

          await setUser(updatedUserData);

          methods.reset();
          Keyboard.dismiss();
        } else {
          setErrorsToForm(res?.response, methods);
        }
      }
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Profile Avatar */}

      <View style={styles.avatarContainer}>
        <TouchableOpacity style={styles.avatar}>
          {image ? (
            <Image source={{ uri: image }} style={styles.avatarImage} />
          ) : (
            <Text style={styles.avatarLabel}>{initials}</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity style={styles.cameraIcon} onPress={handleChangeProfilePicture}>
          <Ionicons name="camera-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* User Info Cells */}
      <View style={styles.infoContainer}>
        <Controller
          control={control}
          name="first_name"
          rules={{ required: 'First name is required' }}
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder="First Name"
              value={value}
              onChange={onChange}
              attribute="first_name"
              errorMessage={errors.first_name?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="last_name"
          rules={{ required: 'Last name is required' }}
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder="Last Name"
              value={value}
              onChange={onChange}
              attribute="last_name"
              errorMessage={errors.last_name?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="language"
          render={({ field: { onChange, value } }) => (
            <FormPicker
              value={value}
              onChange={onChange}
              placeholder="Select Language"
              items={languages}
              attribute="language"
            />
          )}
        />

        <AppButton
          text={t('components.button.name.update')}
          onPress={methods.handleSubmit(onHandleProfileUpdate)}
          style={styles.button}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 60,
    height: 120,
    justifyContent: 'center',
    width: 120,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 20,
    position: 'relative',
  },
  avatarLabel: {
    color: 'white',
    fontSize: 36,
    fontWeight: 'bold',
  },
  cameraIcon: {
    alignItems: 'center',
    backgroundColor: colors.teal,
    borderRadius: 18,
    bottom: 4,
    elevation: 5,
    height: 36,
    justifyContent: 'center',
    position: 'absolute',
    right: 4,
    width: 36,
  },
  cell: {
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 0.5,
    marginBottom: 15,
    paddingHorizontal: 10,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  container: {
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    flex: 1,
  },
  infoContainer: {
    marginTop: 40,
    width: '90%',
  },
  avatarImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  button: {
    marginTop: 20,
  },
});

export default Profile;
