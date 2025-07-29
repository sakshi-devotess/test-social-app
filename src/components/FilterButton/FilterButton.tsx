import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface FilterButtonProps {
  count?: number;
  onPress: () => void;
}

const FilterButton: React.FC<FilterButtonProps> = ({ count = 0, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      {count > 0 && (
        <View style={styles.filterBadge}>
          <Text style={styles.filterBadgeText}>{count}</Text>
        </View>
      )}
      <Ionicons name="filter-outline" size={24} color="#007aff" style={styles.filterIcon} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginRight: 16,
  },
  filterBadge: {
    position: 'absolute',
    right: width * 0.03,
    top: -4,
    backgroundColor: '#ff3b30',
    borderRadius: 8,
    paddingHorizontal: width * 0.015,
    paddingVertical: 2,
    zIndex: 10,
  },
  filterBadgeText: {
    color: '#fff',
    fontSize: width * 0.03,
    fontWeight: 'bold',
  },
  filterIcon: {},
});

export default FilterButton;
