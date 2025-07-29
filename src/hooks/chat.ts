import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { mutateFromFormData, MUTATION_TYPE_CREATE } from '../graphql/mutation.service';
import { generateUUID } from '../library/utilities/helperFunction';
import { useLazyQuery } from '@apollo/client';
import { GET_CHAT_BY_CHAT_ID } from '../graphql/queries/Chat/chat.query';
import { SocketContext } from '../contexts/SocketContext';

export interface IChatMessage {
  sender_id: number | string;
  chat_id: number | string;
  message: string;
  messageId?: number;
  id: number;
  created?: number | string;
  isPending?: boolean;
}

export const useChatMessages = ({ chatRoomId }: { chatRoomId: number | string }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<IChatMessage[]>([]);
  const [getChat, { data: chatdata }] = useLazyQuery(GET_CHAT_BY_CHAT_ID);
  const { socket } = useContext(SocketContext);
  const isUnmounted = useRef(false);
  useEffect(
    () => () => {
      isUnmounted.current = true;
    },
    []
  );
  useEffect(() => {
    if (!socket) {
      return;
    }

    const newMessageHandler = async (chatMessage) => {
      if (chatMessage.chat_id !== chatRoomId) {
        return;
      }

      const existingMessage = chatMessages?.find((v) => v.id === chatMessage.id);
      if (existingMessage) {
        if (!existingMessage.isPending) {
          return;
        }

        const preparedMessage = {
          ...chatMessage,
          isPending: false,
        };
        if (!isUnmounted.current) {
          setChatMessages((prev) => [
            preparedMessage,
            ...prev.filter((v) => v.id !== preparedMessage.id),
          ]);
        }

        return;
      }

      if (!isUnmounted.current) {
        setChatMessages((prev) => (prev ? [chatMessage, ...prev] : [chatMessage]));
      }
    };

    socket.on('newChatMessage', newMessageHandler);

    // eslint-disable-next-line consistent-return
    return () => {
      socket.off('newChatMessage', newMessageHandler);
    };
  }, [chatMessages, socket, chatRoomId]);
  const createChatMessage = useCallback(
    async (newMessage, cb) => {
      try {
        const messageId = generateUUID();
        const preparedNewMessage = {
          ...newMessage,
          id: messageId,
          isPending: true,
        };
        setChatMessages((prev) => (prev ? [preparedNewMessage, ...prev] : [preparedNewMessage]));
        const res = await mutateFromFormData(
          preparedNewMessage,
          'ChatMessages',
          MUTATION_TYPE_CREATE,
          ['id']
        );
        if (res.success) {
        }
      } catch (error) {
        console.error('Error creating chat message:', error);
      }
    },

    [chatMessages]
  );
  useEffect(() => {
    if (chatdata) {
      const chatMessages = chatdata.getChat.chat_messages;
      setChatMessages(chatMessages);
    }
  }, [chatdata]);
  const fetchChatMessages = async () => {
    if (chatRoomId) {
      getChat({
        variables: {
          chatId: chatRoomId,
        },
        fetchPolicy: 'network-only',
      });
    }

    // setIsLoading(true);
    // let chatRoomMessagesResponse = [];
    // if(chatRoomId){

    // }

    // const preparedChatMessagesPromises = chatRoomMessagesResponse.map((chatMessage) =>
    //   prepareChatMessage(chatMessage)
    // );
    // let preparedChatMessages = (await Promise.all(preparedChatMessagesPromises))
    //   // eslint-disable-next-line no-nested-ternary
    //   .sort((a, b) => (a.sentAt < b.sentAt ? 1 : b.sentAt < a.sentAt ? -1 : 0));

    // if (filterFn && typeof filterFn === 'function') {
    //   preparedChatMessages = filterFn(preparedChatMessages);
    // }

    // if (!isUnmounted.current) {
    //   setChatMessages((prev) =>{
    //     if(initial){
    //       return preparedChatMessages
    //     }
    //     return [...prev, ...preparedChatMessages]
    //   });
    // }
    // setIsLoading(false);
  };

  useEffect(() => {
    fetchChatMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatRoomId]);

  return useMemo(() => {
    const messages = chatMessages;
    return [
      messages,
      {
        createChatMessage,
      },
    ];
  }, [chatMessages]);
};
