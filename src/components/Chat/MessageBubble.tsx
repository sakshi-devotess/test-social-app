import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { dateTemplate } from '../../library/utilities/helperFunction';

interface MessageBubbleProps {
  message: string;
  isOwnMessage: boolean;
  created?: number;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isOwnMessage, created }) => {
  return (
    <View style={[styles.container, isOwnMessage ? styles.right : styles.left]}>
      <Text style={styles.text}>{message}</Text>
      <Text style={styles.time}>{dateTemplate(created?.toString() || '')}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    maxWidth: '70%',
    padding: 10,
    borderRadius: 16,
    marginVertical: 4,
  },
  left: {
    backgroundColor: '#000000',
    alignSelf: 'flex-start',
  },
  right: {
    backgroundColor: '#0084ff',
    alignSelf: 'flex-end',
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
  },
  time: {
    fontSize: 10,
    color: '#fff',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
});

export default MessageBubble;
