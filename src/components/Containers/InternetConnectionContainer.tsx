import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import * as SecureStore from 'expo-secure-store';
import { LocalStorageService } from '../../i18n/languageStorage';
import { TranslationStorage } from '../../i18n/translaionStorage';
import * as Network from 'expo-network';

const InternetConnectionContainer = ({ children }) => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [hasRequiredCache, setHasRequiredCache] = useState<boolean | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const netInfo = await Network.getNetworkStateAsync();
        setIsConnected(netInfo.isConnected ?? false);

        const storedUser = await SecureStore.getItemAsync('userData');
        const lang = await LocalStorageService.getLanguage();
        const translations = await TranslationStorage.get(lang);
        setHasRequiredCache(!!storedUser && !!translations);
      } catch (err) {
        console.error('Failed to check offline state:', err);
        setHasRequiredCache(false);
        setIsConnected(false);
      }
    };

    init();
  }, []);

  if (isConnected === null || hasRequiredCache === null) return null;

  if (!isConnected && !hasRequiredCache) {
    return (
      <View style={styles.container}>
        <View style={styles.messageContainer}>
          <Text style={styles.messageText}>
            Internet is required to use this app. Please check your connection and try again.
          </Text>
        </View>
      </View>
    );
  }

  return children;
};

InternetConnectionContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

export default InternetConnectionContainer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  messageContainer: {
    padding: 20,
    borderRadius: 8,
    backgroundColor: '#f8d7da',
    borderColor: '#f5c6cb',
    borderWidth: 1,
  },
  messageText: {
    color: '#721c24',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});
