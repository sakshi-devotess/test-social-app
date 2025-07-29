import { createContext, useMemo, useState, useEffect, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { config } from '../config/constants';
import * as SecureStore from 'expo-secure-store';

interface ISocketContext {
  socket: Socket | null;
  companyHasUserId: number | null;
  getCompanyHasUserId: (id: number | null) => void;
}

export const SocketContext = createContext<ISocketContext>({
  socket: null,
  companyHasUserId: null,
  getCompanyHasUserId: () => {},
});

const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [companyHasUserId, setCompanyHasUserId] = useState<number | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const setupSocket = async () => {
      try {
        const storedData = await SecureStore.getItemAsync('userData');
        if (!storedData) {
          console.warn('No user data in SecureStore');
          return;
        }

        const parsedData = JSON.parse(storedData);
        const access_token = parsedData?.access_token;
        const userId = parsedData?.companyHasUserId;

        if (!userId) {
          console.warn('User ID missing from stored data');
          return;
        }

        setCompanyHasUserId(userId);

        const socketConnection = io(config.webSocketDomain, {
          transports: ['websocket'],
          path: config.webSocketPath,
          query: {
            companyHasUserId: String(userId),
            access_token,
          },
        });

        setSocket(socketConnection);

        socketConnection.on('connect', () => {
          console.log('Connected to socket server');
        });

        socketConnection.on('disconnect', () => {
          console.log('Disconnected from socket server');
        });
      } catch (err) {
        console.error('Socket connection error:', err);
      }
    };

    setupSocket();

    return () => {
      socket?.disconnect();
      setSocket(null);
    };
  }, []);

  const getCompanyHasUserId = (id: number | null) => {
    setCompanyHasUserId(id);
  };

  const value = useMemo(
    () => ({
      socket,
      companyHasUserId,
      getCompanyHasUserId,
    }),
    [socket, companyHasUserId]
  );

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};

export default SocketProvider;
