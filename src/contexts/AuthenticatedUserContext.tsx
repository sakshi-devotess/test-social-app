import React, { useMemo, useState, useEffect, createContext, PropsWithChildren } from 'react';
import * as SecureStore from 'expo-secure-store';
import { GET_CURRENT_USER } from '../graphql/queries/User/user.query';
import { useQuery } from '@apollo/client';
import { setLogoutFn } from '../library/utilities/logoutUser';
import { changeLanguageAndFetchTranslations } from '../i18n/i18n';

export interface ICurrentUser {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  mobilephone: string;
  active: boolean;
  validEmails: string[];
  password?: string;
  companyHasUserId?: number;
  __typename?: string;
  company_has_users: any[];
  company_id?: number;
  language?: string;
  file_id?: number;
}

interface IAuthContext {
  user: ICurrentUser | null;
  setUser: (user: ICurrentUser | null) => void;
  SetLoginState: (loggedIn: boolean) => void;
  isAuthLoading?: boolean;
}

export const AuthenticatedUserContext = createContext<IAuthContext>({
  user: null,
  setUser: () => {},
  SetLoginState: () => {},
});

export const AuthenticatedUserProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const [user, setUser] = useState<ICurrentUser | null>(null);
  const [isLogin, SetLoginState] = useState<boolean>(false);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const stored = await SecureStore.getItemAsync('userData');
        if (stored) {
          const parsedUser = JSON.parse(stored);
          if (parsedUser?.companyHasUserId) {
            setUser(parsedUser);
            SetLoginState(true);
          }
        }
      } catch (error) {
        console.error('Error accessing SecureStore:', error);
      } finally {
        setIsAuthLoading(false);
      }
    };
    checkUser();
  }, []);

  const { data } = useQuery(GET_CURRENT_USER, {
    skip: !isLogin,
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    const loadUserData = async () => {
      if (data && isLogin) {
        const response: any = Object.values(data)[0];
        const sortedCompanyHasUsers = [...response.company_has_users].sort(
          (a, b) => Number(a.created) - Number(b.created)
        );
        const defaultCompanyHasUserId = sortedCompanyHasUsers[0]?.id;
        const selectedCompanyHasUserId = user?.companyHasUserId || defaultCompanyHasUserId;

        const companyHasUser = response.company_has_users.find(
          (cu: any) => cu.id === selectedCompanyHasUserId
        );

        const currentUser: ICurrentUser = {
          ...response,
          companyHasUserId: selectedCompanyHasUserId,
          company_id: companyHasUser?.company_id,
        };
        const userLang = response?.language;
        const stored = await SecureStore.getItemAsync('userData');
        if (stored) {
          const parsedUser = JSON.parse(stored);
          const updatedUserData = {
            ...parsedUser,
            ...currentUser,
          };
          await SecureStore.setItemAsync('userData', JSON.stringify(updatedUserData));
        }
        setUser(currentUser);
        if (userLang) {
          await changeLanguageAndFetchTranslations(userLang);
        }
      }
    };
    loadUserData();
  }, [data, isLogin]);

  useEffect(() => {
    setLogoutFn(async () => {
      await SecureStore.deleteItemAsync('userData');
      setUser(null);
      SetLoginState(false);
    });
  }, []);

  const value = useMemo(
    () => ({ user, setUser, SetLoginState, isAuthLoading }),
    [user, isLogin, isAuthLoading]
  );

  return (
    <AuthenticatedUserContext.Provider value={value}>{children}</AuthenticatedUserContext.Provider>
  );
};
