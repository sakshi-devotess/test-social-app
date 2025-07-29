import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { IInvoiceData, IPaymentReceiptProps } from './Payment.model';
import { formatInvoiceDate, getUserFullName } from '../../library/utilities/helperFunction';
import Loader from '../Loader';
const { width } = Dimensions.get('window');

const PaymentReceipt = ({ invoiceData }: IPaymentReceiptProps) => {
  const [invoice, setInvoice] = useState<IInvoiceData>();

  useEffect(() => {
    if (!invoiceData) return;
    const product = invoiceData?.companyHasUserProduct?.product;
    const intentRawData = invoiceData?.companyHasUserProduct?.payment_intent_data;
    const customerName = invoiceData?.companyHasUserProduct?.company_has_user
      ? getUserFullName(invoiceData.companyHasUserProduct.company_has_user)
      : '-';

    let intent;
    try {
      intent = intentRawData ? JSON.parse(intentRawData) : {};
    } catch (err) {
      console.error('Invalid payment_intent_data:', err);
      intent = {};
    }

    const parsedInvoice = {
      datePaid: formatInvoiceDate(intent?.created),
      to: customerName || '-',
      from: 'Dogpark',
      number: intent?.id ? `${intent.id}` : 'N/A',
      item: {
        name: product?.title ?? '',
        quantity: 1,
        unitPrice: Number(product?.price) || 0,
      },
      paymentCategory: intent?.payment_method_details?.klarna?.payment_method_category || 'Unknown',
      amountPaid: intent?.amount_received ? intent.amount_received / 100 : product?.price || 0,
    };

    setInvoice(parsedInvoice);
  }, [invoiceData]);

  const formatCurrency = (value: number) => `$${value.toFixed(2)}`;
  if (!invoice) return null;
  return (
    <ScrollView style={styles.container}>
      <Loader loading={!invoice}>
        <Text style={styles.title}>Paid on {invoice?.datePaid}</Text>

        {/* Summary Section */}
        <Text style={styles.sectionLabel}>SUMMARY</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.label}>To</Text>
          <Text style={styles.value}>{invoice.to}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.label}>From</Text>
          <Text style={styles.value}>{invoice.from}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.label}>Id</Text>
          <Text style={styles.value}>{invoice.number}</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.label}>Category</Text>
          <Text style={styles.value}>{invoice.paymentCategory}</Text>
        </View>

        <View style={styles.divider} />

        {/* Items Section */}
        <Text style={styles.sectionLabel}>ITEMS</Text>

        <View style={styles.itemRow}>
          <Text style={styles.itemName}>{invoice.item.name}</Text>
          <Text style={styles.amount}>{formatCurrency(invoice.item.unitPrice)}</Text>
        </View>
        <Text style={styles.qtyText}>Qty {invoice.item.quantity}</Text>

        <View style={styles.divider} />

        {/* Totals */}
        <View style={styles.totalRow}>
          <Text style={styles.label}>Total due</Text>
          <Text style={styles.amount}>{formatCurrency(invoice.item.unitPrice)}</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.label}>Amount paid</Text>
          <Text style={styles.amount}>{formatCurrency(Number(invoice.amountPaid))}</Text>
        </View>
      </Loader>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: width * 0.05,
    paddingTop: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 25,
  },
  sectionLabel: {
    fontSize: 13,
    color: '#888',
    fontWeight: '500',
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  summaryRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  label: {
    flex: 1,
    color: '#444',
    fontWeight: '500',
  },
  value: {
    flex: 2,
    color: '#000',
  },
  dateRange: {
    color: '#888',
    fontSize: 13,
    marginBottom: 10,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  itemName: {
    fontSize: 16,
  },
  qtyText: {
    fontSize: 13,
    color: '#888',
    marginBottom: 20,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  amount: {
    fontWeight: '500',
  },
  divider: {
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    marginVertical: 15,
  },
});

export default PaymentReceipt;
