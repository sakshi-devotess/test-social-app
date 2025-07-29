import Constants from 'expo-constants';
export const colors = {
  primary: '#2196f3',
  border: '#565656',
  red: '#EF5350',
  pink: '#EC407A',
  teal: '#26A69A',
  grey: '#BDBDBD',
};

export const config = {
  graphQlUrl: Constants.expoConfig?.extra?.url?.graphql,
  publicUrl: Constants.expoConfig?.extra?.url?.api,
  // graphQlUrl: 'http://192.168.29.112:6010/graphql',
  // publicUrl: 'http://192.168.29.112:6010',
  webUrl: Constants.expoConfig?.extra?.url?.webUrl,
  webSocketDomain: Constants.expoConfig?.extra?.socket?.webSocketDomain,
  webSocketPath: Constants.expoConfig?.extra?.socket?.webSocketPath,
  stripePublicKey: Constants.expoConfig?.extra?.stripe?.publishableKey,
  saltoPublicApiKeyAccept: Constants.expoConfig?.extra?.salto?.publicApiKeyAccept,
  saltoIdentityUrl: Constants.expoConfig?.extra?.salto?.saltoIdentityUrl,
  saltoClientId: Constants.expoConfig?.extra?.salto?.clientId,
  saltoRedirectUri: Constants.expoConfig?.extra?.salto?.redirectUri,
};

export const clientTypes = {
  WEB: 'web',
  MOBILE: 'mobile',
};

export const EventTabStatus = {
  UPCOMING: 'Upcoming',
  MYEVENT: 'My Event',
};

export const COMPANY_HAS_USER_HAS_EVENT_STATUS = Object.freeze({
  REQUEST: 0,
  CONFIRMED: 1,
  PAID: 2,
  REJECTED: 3,
  CANCELLED: 10,
});

export const EVENT_STATUS = Object.freeze({
  PLANNED: 0,
  COMPLETED: 1,
  CANCELLED: 10,
});

export const PRODUCT_TYPE = Object.freeze({
  EVENT: 1,
  ARTICLE: 2,
});

export const ArticleTabStatus = {
  NEW: 'NEW',
  MY_ARTICLES: 'My Articles',
};

export const ARTICLE_STATUS = Object.freeze({
  PLANNED: 0,
  COMPLETED: 1,
  CANCELLED: 10,
});

export const MAX_DESCRIPTION_LINES = 2;

export const INVOICE_STATUS = Object.freeze({
  PAID: 'paid',
  UNPAID: 'unpaid',
});

export const languages = [
  {
    label: 'Svenska',
    value: 'sv',
  },
  {
    label: 'English',
    value: 'en',
  },
];

export const LANGUAGE_CODES = [
  'af', // Afrikaans
  'sq', // Albanian
  'am', // Amharic
  'ar', // Arabic
  'hy', // Armenian
  'az', // Azerbaijani
  'eu', // Basque
  'be', // Belarusian
  'bn', // Bengali
  'bs', // Bosnian
  'bg', // Bulgarian
  'ca', // Catalan
  'ceb', // Cebuano
  'ny', // Chichewa
  'zh', // Chinese
  'co', // Corsican
  'hr', // Croatian
  'cs', // Czech
  'da', // Danish
  'nl', // Dutch
  'en', // English
  'eo', // Esperanto
  'et', // Estonian
  'tl', // Filipino
  'fi', // Finnish
  'fr', // French
  'fy', // Frisian
  'gl', // Galician
  'ka', // Georgian
  'de', // German
  'el', // Greek
  'gu', // Gujarati
  'ht', // Haitian Creole
  'ha', // Hausa
  'haw', // Hawaiian
  'iw', // Hebrew
  'hi', // Hindi
  'hmn', // Hmong
  'hu', // Hungarian
  'is', // Icelandic
  'ig', // Igbo
  'id', // Indonesian
  'ga', // Irish
  'it', // Italian
  'ja', // Japanese
  'jv', // Javanese
  'kn', // Kannada
  'kk', // Kazakh
  'km', // Khmer
  'ko', // Korean
  'ku', // Kurdish (Kurmanji)
  'ky', // Kyrgyz
  'lo', // Lao
  'la', // Latin
  'lv', // Latvian
  'lt', // Lithuanian
  'lb', // Luxembourgish
  'mk', // Macedonian
  'mg', // Malagasy
  'ms', // Malay
  'ml', // Malayalam
  'mt', // Maltese
  'mi', // Maori
  'mr', // Marathi
  'mn', // Mongolian
  'my', // Myanmar (Burmese)
  'ne', // Nepali
  'no', // Norwegian
  'ps', // Pashto
  'fa', // Persian
  'pl', // Polish
  'pt', // Portuguese
  'pa', // Punjabi
  'ro', // Romanian
  'ru', // Russian
  'sm', // Samoan
  'gd', // Scots Gaelic
  'sr', // Serbian
  'st', // Sesotho
  'sn', // Shona
  'sd', // Sindhi
  'si', // Sinhala
  'sk', // Slovak
  'sl', // Slovenian
  'so', // Somali
  'es', // Spanish
  'su', // Sundanese
  'sw', // Swahili
  'sv', // Swedish
  'tg', // Tajik
  'ta', // Tamil
  'te', // Telugu
  'th', // Thai
  'tr', // Turkish
  'uk', // Ukrainian
  'ur', // Urdu
  'uz', // Uzbek
  'vi', // Vietnamese
  'cy', // Welsh
  'xh', // Xhosa
  'yi', // Yiddish
  'yo', // Yoruba
  'zu', // Zulu
];
