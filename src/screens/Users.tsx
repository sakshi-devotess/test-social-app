import { useNavigation, NavigationProp } from '@react-navigation/native';
import React, { useState, useEffect, useCallback, useContext, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Alert } from 'react-native';
import { query, where, collection, onSnapshot } from 'firebase/firestore';
import Cell from '../components/Cell';
import { colors } from '../config/constants';
import ContactRow from '../components/ContactRow';
import { database } from '../config/firebase';
import { GET_All_USERS } from '../graphql/queries/User/user.query';
import { useLazyQuery } from '@apollo/client';
import { AuthenticatedUserContext } from '../contexts/AuthenticatedUserContext';
import { mutateFromFormData, MUTATION_TYPE_CREATE } from '../graphql/mutation.service';
import { GET_USER_CHATS } from '../graphql/queries/Chat/chat.query';

type RootStackParamList = {
  Chat: { id: string; chatName: string };
  Group: undefined;
};

const Users = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [existingChats, setExistingChats] = useState([]);
  const [getAllUser, { data: getUsers }] = useLazyQuery(GET_All_USERS);
  const [getUserChats, { data: chatData, error }] = useLazyQuery(GET_USER_CHATS);
  const { user } = useContext(AuthenticatedUserContext);
  const [chatId, setChatId] = useState(null);
  const [selectedUser, setSelectedUserData] = useState(null);

  useEffect(() => {
    getAllUser({
      variables: {
        companyHasUserId: user.companyHasUserId,
      },
    });

    // Get existing chats to avoid creating duplicate chats
    const collectionChatsRef = collection(database, 'chats');
    const q2 = query(
      collectionChatsRef,
      // where('users', 'array-contains', {
      //   email: auth?.currentUser?.email,
      //   name: auth?.currentUser?.displayName,
      //   deletedFromChat: false,
      // }),
      where('groupName', '==', '')
    );
    const unsubscribeChats = onSnapshot(q2, (snapshot) => {
      const existing = snapshot.docs.map((existingChat) => ({
        chatId: existingChat.id,
        userEmails: existingChat.data().users,
      }));
      setExistingChats(existing);
    });

    return () => {
      // unsubscribeUsers();
      unsubscribeChats();
    };
  }, []);

  useEffect(() => {
    if (chatId !== null && selectedUser !== null) {
      navigation.navigate('Chat', { id: chatId, chatName: handleName(selectedUser) });
    }
  }, [chatId, selectedUser]);

  const userData = useMemo(() => {
    if (getUsers?.getCurrentUser) {
      return getUsers.getCurrentUser.company_has_users[0].company.user;
    }
    return [];
  }, [getUsers]);

  const handleNewGroup = useCallback(() => {
    navigation.navigate('Group');
  }, [navigation]);

  const handleNewUser = useCallback(() => {
    alert('New user');
  }, []);

  const handleName = useCallback(
    (userData) => {
      const name = userData?.first_name + ' ' + userData?.last_name;
      if (userData) {
        return userData?.id === user?.id ? `(You)` : name;
      }
    },
    [user]
  );

  useEffect(() => {
    if (chatData) {
      const chatId = chatData?.getUserChat?.chat_id;
      setChatId(chatId);
    }
  }, [chatData]);

  const handleNavigate = useCallback(
    async (selectedUser) => {
      if (!selectedUser) return;
      const companyHasUserId = selectedUser?.company_has_users[0]?.id;

      setSelectedUserData(selectedUser);
      try {
        const { data } = await getUserChats({
          variables: {
            companyHasUserId: companyHasUserId,
          },
        });

        const existingChatId = data?.getUserChat?.chat_id;
        const chatName = handleName(selectedUser);

        if (existingChatId) {
          navigation.navigate('Chat', {
            id: existingChatId,
            chatName,
          });
          return;
        }

        const chatInput = {
          name: 'one-on-one',
          receiver_id: companyHasUserId,
          is_group: false,
        };

        const res = await mutateFromFormData(chatInput, 'Chat', MUTATION_TYPE_CREATE, ['id']);
        if (res?.success) {
          const newChatId = res?.response?.id;
          navigation.navigate('Chat', {
            id: newChatId,
            chatName,
          });
        } else {
          Alert.alert('Error', 'Failed to create chat.');
        }
      } catch (error) {
        console.error('Error navigating to chat:', error);
        Alert.alert('Error', 'Something went wrong while opening chat.');
      }
    },
    [getUserChats, navigation, handleName]
  );
  return (
    <SafeAreaView style={styles.container}>
      <Cell
        title="New group"
        icon="people"
        tintColor={colors.teal}
        onPress={handleNewGroup}
        style={{ marginTop: 5 }}
      />
      <Cell
        title="New user"
        icon="person-add"
        tintColor={colors.teal}
        onPress={handleNewUser}
        style={{ marginBottom: 10 }}
      />

      {userData.length === 0 ? (
        <View style={styles.blankContainer}>
          <Text style={styles.textContainer}>No registered users yet</Text>
        </View>
      ) : (
        <ScrollView>
          <View>
            <Text style={styles.textContainer}>Registered users</Text>
          </View>
          {userData.map((user) => (
            <React.Fragment key={user.id}>
              <ContactRow
                name={handleName(user)}
                onPress={() => handleNavigate(user)}
                showForwardIcon={false}
              />
            </React.Fragment>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  blankContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
  },
  textContainer: {
    fontSize: 16,
    fontWeight: '300',
    marginLeft: 16,
  },
});

export default Users;
