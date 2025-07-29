import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { languageService } from '../services/language/language.service';
import { LocalStorageService } from './languageStorage';
import { LANGUAGE_CODES } from '../config/constants';
import * as Network from 'expo-network';
import { TranslationStorage } from './translaionStorage';
i18n
  .use(initReactI18next)
  .init({
    fallbackLng: 'sv',
    debug: false,
    keySeparator: '.',
    interpolation: {
      escapeValue: false,
    },
  })
  .then(async () => {
    const lang = await LocalStorageService.getLanguage();
    changeLanguageAndFetchTranslations(lang);
  });

export const changeLanguageAndFetchTranslations = async (language: string) => {
  const lang = LANGUAGE_CODES.includes(language) ? language : 'sv';

  const netInfo = await Network.getNetworkStateAsync();
  const isOnline = netInfo.isConnected && netInfo.isInternetReachable;
  let translations;

  if (isOnline) {
    try {
      translations = await languageService.fetchTranslations(lang);
      await TranslationStorage.set(lang, translations);
      console.log(`[i18n] Fetched and cached "${lang}" translations`);
    } catch (err) {
      console.warn(`[i18n] Fetch failed. Falling back to cached "${lang}" translations.`, err);
      translations = await TranslationStorage.get(lang);
    }
  } else {
    console.log(`[i18n] Offline. Loading cached translations for "${lang}".`);
    translations = await TranslationStorage.get(lang);
  }

  if (translations) {
    i18n.addResourceBundle(lang, 'translation', translations, true);
    await i18n.changeLanguage(lang);
  } else {
    console.warn(`[i18n] No translations available for "${lang}"`);
  }
};

export default i18n;
