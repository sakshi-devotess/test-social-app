import 'dotenv/config';
import process from 'process';

export default {
  expo: {
    plugins: [
      'expo-build-properties',
      '@config-plugins/react-native-blob-util',
      '@config-plugins/react-native-pdf',
    ],
    name: 'dogpark-social-app',
    slug: 'dogpark-social-app',
    version: '1.0.1',
    orientation: 'portrait',
    icon: 'src/assets/icon.png',
    userInterfaceStyle: 'light',
    entryPoint: './src/App.tsx',
    scheme: 'dogpark',
    deepLinking: true,
    splash: {
      image: 'src/assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      buildNumber: '2',
      supportsTablet: true,
      bundleIdentifier: 'com.dogpark.socialapp',
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
        NSLocationWhenInUseUsageDescription:
          "We use your location to verify you're at the dog park.",
        NSBluetoothAlwaysUsageDescription: 'We use Bluetooth to connect to nearby devices.',
        NSBluetoothPeripheralUsageDescription: 'We use Bluetooth to communicate with devices.',
      },
    },
    android: {
      permissions: [
        'BLUETOOTH',
        'BLUETOOTH_ADMIN',
        'BLUETOOTH_CONNECT',
        'BLUETOOTH_SCAN',
        'ACCESS_FINE_LOCATION',
      ],
      adaptiveIcon: {
        foregroundImage: 'src/assets/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      package: 'com.ctere1.reactnativechat',
    },
    web: {
      favicon: 'src/assets/favicon.png',
    },
    newArchEnabled: true,
    extra: {
      apiKey: process.env.EXPO_PUBLIC_API_KEY,
      authDomain: process.env.EXPO_PUBLIC_AUTH_DOMAIN,
      projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
      storageBucket: process.env.EXPO_PUBLIC_STORAGE_BUCKET,
      messagingSenderId: process.env.EXPO_PUBLIC_MESSAGING_SENDER_ID,
      appId: process.env.EXPO_PUBLIC_APP_ID,
      measurementId: process.env.EXPO_PUBLIC_MEASUREMENT_ID,
      eas: {},
      url: {
        api: process.env.REACT_APP_PUBLIC_URL,
        graphql: process.env.REACT_APP_GRAPHQL_URL,
        webUrl: process.env.REACT_APP_WEB_URL,
      },
      socket: {
        webSocketDomain: process.env.REACT_APP_SOCKET_DOMAIN,
        webSocketPath: process.env.REACT_APP_SOCKET_PATH,
      },
      stripe: {
        publishableKey: process.env.STRIPE_PUBLIC_KEY,
      },
      salto: {
        publicApiKeyAccept: process.env.SALTO_PUBLIC_API_KEY_ACCEPT,
        saltoIdentityUrl: process.env.SALTO_IDENTITY_URL,
        clientId: process.env.SALTO_CLIENT_ID,
        redirectUri: process.env.REDIRECT_URI,
      },
    },
  },
};
