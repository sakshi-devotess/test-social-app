import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  onSend: (message: string) => void;
  onEmojiPress?: () => void;
}

const InputBar: React.FC<Props> = ({ onSend, onEmojiPress }) => {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (text.trim()) {
      onSend(text.trim());
      setText('');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onEmojiPress}>
        <Ionicons name="happy-outline" size={24} color="gray" />
      </TouchableOpacity>
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="Type a message"
        style={styles.input}
      />
      <TouchableOpacity onPress={handleSend}>
        <Ionicons name="send" size={24} color="#0084ff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 8,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    marginHorizontal: 8,
    padding: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
  },
});

export default InputBar;
