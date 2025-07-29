import React, { useContext } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import MessageBubble from './MessageBubble';
import { AuthenticatedUserContext } from '../../contexts/AuthenticatedUserContext';
import { IChatMessage } from '../../hooks/chat';

interface Props {
  messages: IChatMessage[];
}

const MessageList: React.FC<Props> = ({ messages }) => {
  const { user } = useContext(AuthenticatedUserContext);
  const sortedMessages = [...messages].sort((a, b) => b.id - a.id);
  return (
    <FlatList
      contentContainerStyle={styles.container}
      data={sortedMessages}
      renderItem={({ item }) => (
        <MessageBubble
          message={item?.message}
          isOwnMessage={item?.sender_id === user?.companyHasUserId}
          created={item?.created}
        />
      )}
      keyExtractor={(item) => item.id.toString()}
      inverted
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
});

export default MessageList;
