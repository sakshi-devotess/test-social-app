import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFormContext } from 'react-hook-form';

interface FormInputProps {
  value: string;
  onChange: (text: string) => void;
  placeholder: string;
  secureTextEntry?: boolean;
  errorMessage?: string;
  keyboardType?:
    | 'default'
    | 'email-address'
    | 'numeric'
    | 'phone-pad'
    | 'decimal-pad'
    | 'number-pad';
  textContentType?: 'none' | 'username' | 'password' | 'name';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoCorrect?: boolean;
  attribute?: string;
}

export default function Input({
  value,
  onChange,
  placeholder,
  secureTextEntry = false,
  errorMessage,
  keyboardType = 'default',
  textContentType = 'none',
  autoCapitalize = 'none',
  autoCorrect = false,
  attribute = '',
}: FormInputProps) {
  let formContext;
  try {
    formContext = useFormContext();
  } catch (e) {
    formContext = null;
  }

  const [isSecure, setIsSecure] = useState(secureTextEntry);

  const error: string =
    errorMessage ?? String(formContext?.formState?.errors?.[attribute]?.message || '');

  return (
    <View style={styles.inputWrapper}>
      <View style={[styles.inputContainer, error ? styles.inputContainerError : null]}>
        <TextInput
          style={styles.textInput}
          placeholder={placeholder}
          value={value}
          onChangeText={onChange}
          secureTextEntry={isSecure}
          keyboardType={keyboardType}
          textContentType={textContentType}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          placeholderTextColor="#999"
        />
        {secureTextEntry && (
          <TouchableOpacity onPress={() => setIsSecure(!isSecure)}>
            <Ionicons
              name={isSecure ? 'eye-off' : 'eye'}
              size={18}
              color="gray"
              style={styles.icon}
            />
          </TouchableOpacity>
        )}
      </View>
      {!!error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  inputWrapper: {
    marginBottom: 15,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F6F7FB',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingHorizontal: 14,
    height: 50,
  },
  inputContainerError: {
    borderColor: 'red',
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  icon: {
    marginLeft: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});
