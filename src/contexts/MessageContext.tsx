import React, { createContext, useCallback, useMemo, ReactNode } from 'react';
import Toast from 'react-native-toast-message';
import { pushMessage } from '../library/utilities/message';

export const MessageContext = createContext({
  pushMessageFromMutationResponse: (_mutationResponse: any) => {},
  pushMessageFromRequest: (_response: any) => {},
});

type MessageProviderProps = {
  children: ReactNode;
};

const MessageProvider: React.FC<MessageProviderProps> = ({ children }) => {
  const pushMessageFromMutationResponse = useCallback((mutationResponse: any) => {
    pushMessage(mutationResponse);
  }, []);

  const pushMessageFromRequest = useCallback((response: any) => {
    pushMessage(response);
  }, []);

  const contextValue = useMemo(
    () => ({
      pushMessageFromMutationResponse,
      pushMessageFromRequest,
    }),
    [pushMessageFromMutationResponse, pushMessageFromRequest]
  );

  return (
    <MessageContext.Provider value={contextValue}>
      {children}
      <Toast />
    </MessageContext.Provider>
  );
};

export default MessageProvider;
