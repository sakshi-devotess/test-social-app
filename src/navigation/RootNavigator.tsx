import React, { useContext } from 'react';
import { AuthenticatedUserContext } from '../contexts/AuthenticatedUserContext';
import { NavigationContainer } from '@react-navigation/native';
import AuthNavigator from './AuthNavigator';
import AppRoutesNavigator from './AppRoutesNavigator';
import { StripeKeyProvider } from '../contexts/StripeContext';
import Loader from '../components/Loader';
import { config } from '../config/constants';

const linking = {
  prefixes: ['dogpark://', config.publicUrl],
  config: {
    screens: {
      ResetPassword: 'reset-password/:token',
      Main: {
        screens: {
          Tabs: {
            screens: {
              Dashboard: 'salto-callback',
            },
          },
        },
      },
    },
  },
};
const RootNavigator = () => {
  const { user, isAuthLoading } = useContext(AuthenticatedUserContext);
  if (isAuthLoading) {
    return <Loader loading={true} isShowLoaderText={true} />;
  }

  return (
    <NavigationContainer linking={linking}>
      {user ? (
        <StripeKeyProvider>
          <AppRoutesNavigator />
        </StripeKeyProvider>
      ) : (
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
};

export default RootNavigator;
