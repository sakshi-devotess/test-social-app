import { registerRootComponent } from 'expo';
import { MenuProvider } from 'react-native-popup-menu';
import React, { useCallback, useEffect, useState } from 'react';
import { UnreadMessagesProvider } from './contexts/UnreadMessagesContext';
import { AuthenticatedUserProvider } from './contexts/AuthenticatedUserContext';
import RootNavigator from './navigation/RootNavigator';
import { ApolloProvider } from '@apollo/client/main.cjs';
import { client } from './graphql/graphql';
import Toast from 'react-native-toast-message';
import SocketProvider from './contexts/SocketContext';
import i18n from './i18n/i18n';
import MessageProvider from './contexts/MessageContext';
import Loader from './components/Loader';
import InternetConnectionContainer from './components/Containers/InternetConnectionContainer';

const App = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  useEffect(() => {
    const handleI18nInit = () => setIsInitialized(true);
    i18n.store.on('added', handleI18nInit);

    return () => {
      i18n.store.off('added', handleI18nInit);
    };
  }, []);
  const renderRoutes = useCallback(() => {
    if (!isInitialized) return <Loader loading={!isInitialized} />;

    return (
      <InternetConnectionContainer>
        <MenuProvider>
          <ApolloProvider client={client}>
            <AuthenticatedUserProvider>
              <SocketProvider>
                <MessageProvider>
                  <UnreadMessagesProvider>
                    <RootNavigator />
                    <Toast />
                  </UnreadMessagesProvider>
                </MessageProvider>
              </SocketProvider>
            </AuthenticatedUserProvider>
          </ApolloProvider>
        </MenuProvider>
      </InternetConnectionContainer>
    );
  }, [isInitialized]);
  return <>{renderRoutes()}</>;
};

export default registerRootComponent(App);
