import axios, { AxiosResponse } from 'axios';
import { config } from '../../config/constants';
import * as SecureStore from 'expo-secure-store';
import { pushMessage } from '../utilities/message';
import { logout } from '../utilities/logoutUser';
import Toast from 'react-native-toast-message';

const request = axios.create({
  baseURL: config.publicUrl,
  timeout: 1 * 60 * 1000, // 1 minute
  headers: {
    Accept: 'application/json',
  },
  // withCredentials: true,
});
request.interceptors.request.use(
  async (config) => {
    try {
      const storedData = await SecureStore.getItemAsync('userData');
      if (!storedData) throw new Error('No user data in SecureStore');

      const parsedData = JSON.parse(storedData);
      const { access_token } = parsedData;

      if (access_token && config.headers) {
        config.headers.Authorization = `Bearer ${access_token}`;
      }
      return config;
    } catch (error) {
      console.warn('Interceptor auth error:', error);
      return config; // allow request to go through even if token fails
    }
  },
  (error) => Promise.reject(error)
);
request.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const { response } = error;
    const prevRequestConfig = error.config;
    switch (response?.status) {
      case 401:
        await logout();
        break;
      case 400:
        pushMessage(response.data);
        break;
      default:
        Toast.show({
          type: 'error',
          text1: 'Something went wrong',
          visibilityTime: 5000,
        });
        break;
    }
    return Promise.reject(error);
  }
);

export default request;
