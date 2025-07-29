import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  GestureResponderEvent,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type ConfirmDeleteModalProps = {
  visible: boolean;
  onClose: () => void;
  onConfirm: (e: GestureResponderEvent) => void;
  entityName?: string;
  type?: 'Delete' | 'Archive' | 'Remove';
  title?: string;
  message?: string;
};

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  visible,
  onClose,
  onConfirm,
  entityName = 'record',
  type = 'Delete',
  title,
  message,
}) => {
  const insets = useSafeAreaInsets();

  const capitalizedType = type.charAt(0).toUpperCase() + type.slice(1);
  const defaultTitle = title || `${capitalizedType} Confirmation`;
  const defaultMessage = message || `Are you sure you want to ${type.toLowerCase()} ${entityName}?`;

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <View style={[styles.overlay, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>{defaultTitle}</Text>
          <Text style={styles.message}>{defaultMessage}</Text>

          <View style={styles.actions}>
            <TouchableOpacity onPress={onClose} style={[styles.button, styles.cancelButton]}>
              <Text style={[styles.buttonText, styles.cancelText]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onConfirm} style={[styles.button, styles.confirmButton]}>
              <Text style={[styles.buttonText, styles.confirmText]}>{capitalizedType}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmDeleteModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    zIndex: 10,
    elevation: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 12,
  },
  message: {
    fontSize: 15,
    textAlign: 'center',
    color: '#555',
    marginBottom: 24,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#eee',
  },
  confirmButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '500',
  },
  cancelText: {
    color: '#333',
  },
  confirmText: {
    color: '#fff',
  },
  closeArea: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
  },
});
