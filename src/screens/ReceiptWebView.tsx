// screens/ReceiptWebView.tsx

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import Loader from '../components/Loader';

const ReceiptWebView = ({ route }: any) => {
  const { receiptUrl } = route.params;
  const [loading, setLoading] = React.useState(true);
  const handleNavStateChange = (navState: any) => {
    if (navState.loading === false) {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {loading && <Loader loading={loading} size="large" color="#0000ff" />}
      <WebView source={{ uri: receiptUrl }} onNavigationStateChange={handleNavStateChange} />
    </View>
  );
};

export default ReceiptWebView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
