import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Text, Image, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useFormContext } from 'react-hook-form';
import Loader from '../../Loader';
import { useCapitalizedTranslation } from '../../../hooks/useCapitalizedTranslation';

interface ImagePickerInputProps {
  attribute: string;
  label?: string;
  previewStyle?: object;
  value: string;
  onChange: (val: string) => void;
  setImage: (val: any) => void;
  image: any;
  errorMessage?: string;
}

export default function ImagePickerInput({
  attribute,
  label,
  onChange,
  previewStyle,
  setImage,
  image,
  errorMessage,
}: ImagePickerInputProps) {
  let formContext;
  try {
    formContext = useFormContext();
  } catch (e) {
    formContext = null;
  }
  let error: string =
    (errorMessage ?? String(formContext?.formState?.errors?.[attribute]?.message || '')) || '';
  const [loading, setLoading] = useState(false);
  const [errorLoading, setErrorLoading] = useState(false);
  const { t } = useCapitalizedTranslation();
  const selectImage = async () => {
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
      onChange(fullBase64); // Set base64 in form
    } else {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (image) {
      setErrorLoading(false);
      setLoading(true);
    }
  }, [image]);
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity onPress={selectImage} style={styles.button}>
        <Text style={styles.buttonText}>
          {image ? t('components.upload.updateImage') : t('components.upload.chooseImage')}
        </Text>
      </TouchableOpacity>
      {!errorLoading && <Loader size="small" loading={loading} />}
      {image && !errorLoading ? (
        <View style={styles.previewContainer}>
          <Image
            source={{ uri: image }}
            style={[styles.imagePreview, previewStyle, loading && { opacity: 0 }]}
            onLoadEnd={() => setLoading(false)}
            onError={() => {
              setLoading(false);
              setErrorLoading(true);
            }}
          />
        </View>
      ) : null}

      {errorLoading && <Text style={styles.errorFallbackText}>No image found</Text>}

      {!!error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    marginLeft: 4,
    color: '#444',
  },
  button: {
    backgroundColor: '#eee',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#1e90ff',
    fontWeight: '600',
  },
  errorText: {
    color: 'red',
    fontSize: 10,
  },
  previewContainer: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    position: 'relative',
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 10,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  loader: {
    zIndex: 1,
  },
  errorFallbackText: {
    color: '#999',
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
  },
});
