import AsyncStorage from '@react-native-async-storage/async-storage';

export class LocalStorageService {
  static async setLanguage(language: string) {
    await AsyncStorage.setItem('language', language);
  }
  static async getLanguage() {
    return (await AsyncStorage.getItem('language')) ?? 'sv';
  }
}
