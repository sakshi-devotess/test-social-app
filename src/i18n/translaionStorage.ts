// TranslationStorage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const TRANSLATION_PREFIX = 'translations_';

export class TranslationStorage {
  /**
   * Get cached translations for a specific language
   * @param language - e.g., 'en', 'sv'
   */
  static async get(language: string): Promise<any | null> {
    try {
      const key = `${TRANSLATION_PREFIX}${language}`;
      const stored = await AsyncStorage.getItem(key);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error(`[TranslationStorage] Failed to get translations for "${language}":`, error);
      return null;
    }
  }

  /**
   * Save translations for a specific language to cache
   * @param language - e.g., 'en', 'sv'
   * @param data - translation object
   */
  static async set(language: string, data: any): Promise<void> {
    try {
      const key = `${TRANSLATION_PREFIX}${language}`;
      await AsyncStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`[TranslationStorage] Failed to save translations for "${language}":`, error);
    }
  }

  /**
   * Clear cached translations for a specific language
   * @param language - e.g., 'en', 'sv'
   */
  static async clear(language: string): Promise<void> {
    try {
      const key = `${TRANSLATION_PREFIX}${language}`;
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`[TranslationStorage] Failed to clear translations for "${language}":`, error);
    }
  }

  /**
   * Clear all cached translations
   */
  static async clearAll(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const translationKeys = keys.filter((key) => key.startsWith(TRANSLATION_PREFIX));
      await AsyncStorage.multiRemove(translationKeys);
    } catch (error) {
      console.error(`[TranslationStorage] Failed to clear all cached translations:`, error);
    }
  }
}
