import React, { useState, useEffect } from 'react';
import { View, Image, Text, StyleSheet, ImageStyle } from 'react-native';
import Loader from './Loader';

interface ImagePreviewerProps {
  uri: string | null;
  style?: ImageStyle;
  getNewUri?: () => Promise<string | null>;
}

export default function ImagePreviewer({ uri, style, getNewUri }: ImagePreviewerProps) {
  const [imageUri, setImageUri] = useState<string | null>(uri);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    setImageUri(uri);
    setError(false);
    setLoading(true);
    setRetryCount(0);
  }, [uri]);

  const handleError = async () => {
    if (getNewUri && retryCount < 1) {
      try {
        const freshUri = await getNewUri();
        setRetryCount((prev) => prev + 1);
        setImageUri(freshUri);
        setLoading(true);
        setError(false);
        return;
      } catch (e) {
        console.warn('Failed to refetch image URI:', e);
      }
    }
    setLoading(false);
    setError(true);
  };

  return (
    <View>
      {!error && imageUri && <Loader size="small" loading={loading} />}

      {!error && imageUri ? (
        <Image
          source={{ uri: imageUri }}
          style={[style, loading && { opacity: 0 }]}
          onLoadEnd={() => setLoading(false)}
          onError={handleError}
        />
      ) : null}

      {error && <Text style={styles.fallbackText}>No image found</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  fallbackText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
});
