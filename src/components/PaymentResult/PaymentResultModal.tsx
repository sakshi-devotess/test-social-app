import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  GestureResponderEvent,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface PaymentResultModalProps {
  visible: boolean;
  success: boolean;
  onClose: (event: GestureResponderEvent) => void;
  errorMessage?: string | null;
}
const PaymentResultModal: React.FC<PaymentResultModalProps> = ({
  visible,
  success,
  onClose,
  errorMessage,
}) => {
  let message: string;
  if (success) {
    message = 'Payment Successful.';
  } else {
    message = errorMessage ?? 'Please try again.';
  }

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.modalContainer}>
        <View style={[styles.modalBox, success ? styles.successBox : styles.errorBox]}>
          <Ionicons
            name={success ? 'checkmark-circle-outline' : 'close-circle-outline'}
            size={70}
            color={success ? '#34A853' : '#EA4335'}
            style={styles.icon}
          />
          <Text style={[styles.title, success ? styles.successText : styles.errorText]}>
            {success ? 'Yeah!' : 'Oh no!'}
          </Text>
          <Text style={styles.message}>{message}</Text>
          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>{success ? 'Done' : 'Cancel'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default PaymentResultModal;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    width: 300,
    padding: 25,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
  },
  icon: {
    width: 70,
    height: 70,
    marginBottom: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  message: {
    fontSize: 16,
    color: '#555',
    marginVertical: 10,
    textAlign: 'center',
  },
  successBox: {
    borderColor: '#34A853',
    borderWidth: 2,
  },
  errorBox: {
    borderColor: '#EA4335',
    borderWidth: 2,
  },
  successText: {
    color: '#34A853',
  },
  errorText: {
    color: '#EA4335',
  },
  button: {
    marginTop: 15,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 5,
    backgroundColor: '#f0f0f0',
  },
  buttonText: {
    fontWeight: 'bold',
    color: '#333',
  },
});
