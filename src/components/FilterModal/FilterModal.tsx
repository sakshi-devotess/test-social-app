import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import AppButton from '../Button';
import { useCapitalizedTranslation } from '../../hooks/useCapitalizedTranslation';

const { width } = Dimensions.get('window');

export default function FilterModal({ visible, onClose, onApply, initialFilters }) {
  const [localFilters, setLocalFilters] = useState(initialFilters);
  const { t } = useCapitalizedTranslation();
  const applyFilters = () => {
    onApply(localFilters);
    onClose();
  };

  const resetFilters = () => {
    const reset = {
      name: '',
    };
    setLocalFilters(reset);
    onApply(reset);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('components.filter.name')}</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>X</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container}>
        <Text style={styles.sectionTitle}>{t('components.filter.byName')}</Text>

        <TextInput
          placeholder="Name"
          value={localFilters.name}
          onChangeText={(text) => setLocalFilters((prev) => ({ ...prev, name: text }))}
          style={styles.searchInput}
        />
      </ScrollView>

      <View style={styles.footer}>
        <AppButton
          text={t('components.button.name.reset')}
          variant="secondary"
          onPress={resetFilters}
          textStyle={styles.resetButtonText}
          style={styles.resetButton}
        />
        <AppButton
          text={t('components.button.name.apply')}
          onPress={applyFilters}
          textStyle={styles.applyText}
          style={styles.applyButton}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', marginVertical: 10 },
  searchInput: {
    backgroundColor: '#f0f0f0',
    padding: 8,
    borderRadius: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  resetButton: {
    flex: 1,
    marginRight: 10,
  },
  resetButtonText: {
    fontSize: width * 0.045,
    color: '#333',
    fontWeight: 'bold',
  },
  applyButton: {
    flex: 1,
  },
  applyText: {
    color: '#fff',
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },
});
