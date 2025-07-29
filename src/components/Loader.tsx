import React, { ReactNode } from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';

interface WithLoaderProps {
  loading: boolean;
  children?: ReactNode;
  size?: 'small' | 'large';
  color?: string;
  isShowLoaderText?: boolean;
}

const Loader: React.FC<WithLoaderProps> = ({
  loading,
  children,
  size = 'large',
  color = '#0000ff',
  isShowLoaderText = false,
}) => {
  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size={size} color={color} />
        {isShowLoaderText && <Text style={styles.loaderText}>Please wait...</Text>}
      </View>
    );
  }

  return <>{children}</>;
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    marginTop: 12,
    fontSize: 16,
    color: '#555',
  },
});

export default Loader;
