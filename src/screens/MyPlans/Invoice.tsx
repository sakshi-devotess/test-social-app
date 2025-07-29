import { useRoute } from '@react-navigation/native';
import { useState } from 'react';
import { Dimensions, SafeAreaView } from 'react-native';
import Pdf from 'react-native-pdf';
import Loader from '../../components/Loader';
import React from 'react';
import { StyleSheet } from 'react-native';

const Invoice = () => {
  const { params } = useRoute();
  const { invoiceUrl } = params || {};
  const [loading, setLoading] = useState(true);
  return (
    <SafeAreaView style={styles.container}>
      {loading && <Loader loading={loading} />}
      <Pdf
        source={{
          uri: invoiceUrl || 'https://example.com/sample.pdf',
        }}
        onLoadComplete={(numberOfPages, filePath) => {
          console.log(`✅ PDF loaded with ${numberOfPages} pages`);
        }}
        trustAllCerts={false}
        onPageChanged={(page, numberOfPages) => {
          console.log(`Current page: ${page}`);
          setLoading(false);
        }}
        onPressLink={(uri) => {
          console.log(`Link pressed: ${uri}`);
        }}
        onError={(error) => {
          console.error('❌ PDF load error:', error);
        }}
        style={styles.pdf}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loaderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
  },
});

export default Invoice;
