import { StyleSheet, Text, View } from 'react-native';

const EmptyComponent = (text: string) => (
  <View style={styles.emptyContainer}>
    <Text style={styles.emptyText}>{text || 'No data available'}</Text>
  </View>
);

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#555',
  },
});
export default EmptyComponent;
