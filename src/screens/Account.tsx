import React, { useContext } from 'react';
import { View, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import Cell from '../components/Cell';
import { colors } from '../config/constants';
import { AuthenticatedUserContext } from '../contexts/AuthenticatedUserContext';
import { useCapitalizedTranslation } from '../hooks/useCapitalizedTranslation';

const Account = ({ navigation }) => {
  const { setUser, SetLoginState } = useContext(AuthenticatedUserContext);
  const { t } = useCapitalizedTranslation();
  const onSignOut = () => {
    SecureStore.deleteItemAsync('userData');
    setUser(null);
    SetLoginState(false);
  };

  const deleteAccount = () => {
    Alert.alert('Account Deleted Touched');
  };

  return (
    <View>
      <Cell
        title="Blocked Users"
        icon="close-circle-outline"
        tintColor={colors.primary}
        onPress={() => {
          Alert.alert('Blocked users touched');
        }}
        style={{ marginTop: 20 }}
      />
      <Cell
        title={t('menu.appMenu.privacyPolicy')}
        icon="shield-checkmark-outline"
        tintColor={colors.grey}
        onPress={() => {
          navigation.navigate('PrivacyPolicy');
        }}
        showForwardIcon={false}
      />
      <Cell
        title={t('menu.appMenu.changePassword')}
        icon="key-outline"
        tintColor={colors.primary}
        onPress={() => {
          navigation.navigate('ChangePassword');
        }}
        showForwardIcon={false}
      />
      <Cell
        title={t('components.button.name.logout')}
        icon="log-out-outline"
        tintColor={colors.grey}
        onPress={() => {
          Alert.alert(
            'Logout?',
            'You have to login again',
            [
              {
                text: t('components.button.name.logout'),
                onPress: () => {
                  onSignOut();
                },
              },
              {
                text: t('components.button.name.cancel'),
              },
            ],
            { cancelable: true }
          );
        }}
        showForwardIcon={false}
      />
      <Cell
        title="Delete my account"
        icon="trash-outline"
        tintColor={colors.red}
        onPress={() => {
          Alert.alert(
            'Delete account?',
            'Deleting your account will erase your message history',
            [
              {
                text: 'Delete my account',
                onPress: () => {
                  deleteAccount();
                },
              },
              {
                text: 'Cancel',
              },
            ],
            { cancelable: true }
          );
        }}
        showForwardIcon={false}
        style={{ marginTop: 20 }}
      />
    </View>
  );
};

export default Account;
