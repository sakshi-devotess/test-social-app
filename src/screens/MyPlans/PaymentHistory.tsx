import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
  Platform,
  ActivityIndicator,
  PermissionsAndroid,
  Share,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { formatInvoiceDate, formatPrice } from '../../library/utilities/helperFunction';
import Loader from '../../components/Loader';
import { INVOICE_STATUS } from '../../config/constants';
import { IPlanPrice, IStripeSubscriptionPaymentHistory } from './MyPlan.model';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import RNBlobUtil from 'react-native-blob-util';
import EmptyComponent from '../../components/EmptyComponent';
const PaymentHistory = ({ navigation }) => {
  const { params } = useRoute();
  const { planData } = params;
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState([]);
  const [downloadingInvoiceId, setDownloadingInvoiceId] = useState<number | null>(null);
  const paymentHistories = planData?.stripe_subscription_payment_histories || [];

  useEffect(() => {
    if (paymentHistories.length > 0) {
      const parsedInvoices = paymentHistories.map((history: IStripeSubscriptionPaymentHistory) => {
        const invoice = JSON.parse(history.invoice_data);
        return {
          id: history.id,
          amount: invoice.amount_paid || Number(history.amount) * 100,
          created: invoice.period_end,
          status: invoice.status,
          currency: invoice.currency,
          invoiceUrl: invoice.invoice_pdf,
        };
      });

      setInvoices(parsedInvoices);
    }

    setLoading(false);
  }, [paymentHistories]);

  const renderHeader = () => (
    <View style={styles.planSummaryCard}>
      <View style={styles.headerRow}>
        <Text style={styles.planName}>{planData?.productName}</Text>

        {planData?.prices?.map((price: IPlanPrice) => {
          const interval =
            price.interval_count > 1
              ? ` / ${price.interval_count} ${price.interval}s`
              : ` / ${price.interval}`;
          return (
            <Text key={price.priceId} style={styles.planPrice}>
              {formatPrice(price.unitAmount, price.currency)}
              {interval}
            </Text>
          );
        })}
      </View>
    </View>
  );

  const downloadAndSharePDF = async (pdfUrl: string, invoiceId: number) => {
    setDownloadingInvoiceId(invoiceId);
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
      );

      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert('Permission Required', 'Storage permission is needed to save the file.');
        return;
      }

      const path = `${RNBlobUtil.fs.dirs.LegacyDownloadDir}/invoice_${invoiceId}.pdf`;

      RNBlobUtil.config({
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          title: 'Invoice PDF',
          description: 'Invoice downloaded',
          mime: 'application/pdf',
          mediaScannable: true,
          path: path,
        },
      })
        .fetch('GET', pdfUrl)
        .then((res) => {
          console.log('File downloaded to:', res.path());
          Alert.alert('Download complete', `Saved to Downloads folder:\n${res.path()}`);
        })
        .catch((error) => {
          console.error('Download error:', error);
          Alert.alert('Download failed', 'Unable to download the PDF file.');
        })
        .finally(() => {
          setDownloadingInvoiceId(null);
        });
    } else {
      //TODO : Need to test on iOS
      const filePath = `${RNBlobUtil.fs.dirs.DocumentDir}/invoice_${invoiceId}.pdf`;

      RNBlobUtil.config({
        fileCache: true,
        path: filePath,
      })
        .fetch('GET', pdfUrl)
        .then((res) => {
          console.log('File saved to:', res.path());
          Share.share({
            url: `file://${res.path()}`,
            title: 'Your Receipt',
            message: 'Here is your receipt.',
          });
        })
        .catch((error) => {
          console.error('Download error:', error);
          Alert.alert('Download failed', 'Unable to download the PDF file.');
        })
        .finally(() => {
          setDownloadingInvoiceId(null);
        });
    }
  };
  const renderInvoiceCard = ({ item }) => (
    <View style={styles.invoiceCard}>
      <View style={styles.invoiceHeader}>
        <Text style={styles.invoiceAmount}>{formatPrice(item.amount, item.currency)}</Text>
        <View style={styles.container}></View>
        <View style={styles.invoiceButtonsContainer}>
          <TouchableOpacity
            style={[styles.invoiceButton]}
            onPress={() => navigation.navigate('Invoice', { invoiceUrl: item.invoiceUrl })}
          >
            <FontAwesome5 name="file-invoice" size={14} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.invoiceButton, styles.invoiceButtonSecondary]}
            disabled={downloadingInvoiceId === item.id}
            onPress={() => downloadAndSharePDF(item.invoiceUrl, item.id)}
          >
            {downloadingInvoiceId === item.id ? (
              <ActivityIndicator size="small" color="#333" />
            ) : (
              <Feather name="download" size={14} color="#333" />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.invoiceMeta}>
        <View style={styles.dateBadge}>
          <Text style={styles.dateText}>{formatInvoiceDate(item?.created)}</Text>
        </View>
        <Text
          style={[
            styles.invoiceStatus,
            { color: item.status === INVOICE_STATUS.PAID ? '#34A853' : '#F44336' },
          ]}
        >
          {item.status.toUpperCase()}
        </Text>
      </View>
    </View>
  );
  return (
    <View style={styles.container}>
      <Loader loading={loading}>
        <FlatList
          data={invoices}
          keyExtractor={(item) => item?.id}
          ListHeaderComponent={renderHeader}
          renderItem={renderInvoiceCard}
          ListEmptyComponent={EmptyComponent('No invoices found')}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      </Loader>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  planSummaryCard: {
    marginBottom: 16,
    padding: 10,
    borderRadius: 12,
    backgroundColor: '#f5f9ff',
    borderColor: '#d6d5d2',
    borderWidth: 1,
  },
  planName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
    flexShrink: 1,
  },
  planDetails: {
    fontSize: 14,
    color: '#333',
  },
  statusBadge: {
    fontWeight: '600',
    color: '#34a853',
  },
  invoiceCard: {
    backgroundColor: '#fdfdfd',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  invoiceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  invoiceAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#007AFF',
  },
  downloadIcon: {
    fontSize: 18,
    color: '#555',
    marginLeft: 10,
  },
  invoiceMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateBadge: {
    backgroundColor: '#e8f0fe',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  dateText: {
    fontSize: 13,
    color: '#333',
    fontWeight: '500',
  },
  invoiceStatus: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  planPrice: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 10,
  },
  priceBlock: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    marginTop: 10,
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
  },
  invoiceButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
    gap: 5,
  },
  invoiceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007aff',
    paddingVertical: 5,
    paddingHorizontal: 9,
    borderRadius: 6,
  },
  invoiceButtonSecondary: {
    backgroundColor: '#f0f0f0',
  },
});

export default PaymentHistory;
