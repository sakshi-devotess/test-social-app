import React from 'react';
import {
  Modal,
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Text,
} from 'react-native';
import { IPaymentReceiptModalProps } from './Payment.model';
import PaymentReceipt from './PaymentReceipt';

const screenHeight = Dimensions.get('window').height;

const PaymentReceiptModal = ({ visible, onClose, invoiceData }: IPaymentReceiptModalProps) => {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.modalContent, { maxHeight: screenHeight * 0.9 }]}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <PaymentReceipt invoiceData={invoiceData} />

            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '100%',
    overflow: 'hidden',
  },
  scrollContent: {
    paddingBottom: 40,
    flexGrow: 1,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#007aff',
    alignItems: 'center',
    paddingVertical: 10,
    marginHorizontal: 20,
    borderRadius: 8,
  },
  closeText: {
    color: '#fff',
    fontWeight: '500',
  },
});

export default PaymentReceiptModal;
