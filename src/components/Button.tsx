import React, { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';

type Variant = 'primary' | 'secondary' | 'danger' | 'cancel';

interface ButtonProps {
  text: string;
  onPress: () => Promise<void> | void;
  loading?: boolean;
  disabled?: boolean;
  variant?: Variant;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disableForMs?: number;
}

const AppButton: React.FC<ButtonProps> = ({
  text,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
  style,
  textStyle,
  disableForMs = 1000,
}) => {
  const [tempDisabled, setTempDisabled] = useState(false);
  const [internalLoading, setInternalLoading] = useState(false);

  const handlePress = async () => {
    if (disableForMs > 0) {
      setTempDisabled(true);
      setTimeout(() => setTempDisabled(false), disableForMs);
    }

    setInternalLoading(true);
    await onPress?.();
    setInternalLoading(false);
  };

  const isDisabled = disabled || loading || internalLoading || tempDisabled;
  const isLoading = loading || internalLoading;

  const variantStyles = {
    primary: { backgroundColor: '#007bff', textColor: '#fff' },
    secondary: { backgroundColor: '#ddd', textColor: '#fff' },
    danger: { backgroundColor: '#dc3545', textColor: '#fff' },
    cancel: { backgroundColor: '#f0f0f0', textColor: '#333' },
  };

  const { backgroundColor, textColor } = variantStyles[variant];

  return (
    <Pressable
      onPress={handlePress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor, opacity: pressed ? 0.8 : 1 },
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {isLoading && <ActivityIndicator size="small" color="#fff" style={styles.loader} />}
      <View>
        <Text style={[styles.text, { color: textColor }, textStyle]}>{text}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 10,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loader: {
    right: 10,
  },
});

export default AppButton;
