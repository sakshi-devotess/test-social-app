/**
 * This file contains all of the functions that handle operations regarding the
 * usage of Salto's SDK, including registering the device, replacing expired
 * keys, and fetching the MKey to be used for unlocking doors. The objective is
 * to simplify how the main app interfaces with Salto, abstracting away all of
 * these operations as much as possible from the app.
 *
 * There are some baked-in assumptions like using the Keychain to store the MKey
 * and using the logged-in user's ID and current device ID to form the
 * installation UID for the SDK.
 */

// The object containing the native module that we have exposed to React Native
import { Alert, Linking, NativeModules, Platform } from 'react-native';
import { SaltoAPI } from './saltoApi';
import * as Device from 'expo-device';
import * as Application from 'expo-application';
import * as SecureStore from 'expo-secure-store';
import { config } from '../../config/constants';
import * as Crypto from 'expo-crypto';

// Helper functions to get the device's name and ID to be used for registration

// Helper package to handle dates and times

// Retrieve these from some secure storage like .env

// In this example, the MKey and its expiry date are stored in the device's
// Keychain

// Functions to interface with Salto's server

// Default number of days before a certificate's actual expiry for it to start
// getting considered as "expired"
const SALTO_CERT_EXPIRY_BUFFER_DAYS = 30;
const SALTO_PUBLIC_API_KEY_ACCEPT = config.saltoPublicApiKeyAccept || '';
export const KeychainService = {
  SaltoMKey: 'salto_mkey',
  SaltoDeviceId: 'salto_device_id',
  SaltoExpiryDate: 'salto_expiry_date',
  SaltoAccessToken: 'salto_access_token',
};

export const SecureStoreManager = {
  async store({ key, value }) {
    if (!key || value === undefined) return;
    await SecureStore.setItemAsync(key, value);
  },

  async retrieve(key) {
    return await SecureStore.getItemAsync(key);
  },

  async delete(key) {
    await SecureStore.deleteItemAsync(key);
  },
};

async function isMkeyExpired(expiryDateString, bufferDays = 30) {
  const now = new Date(); // current date and time
  const expiryDate = new Date(expiryDateString); // parse ISO or any date string

  // Create a new date representing (expiryDate - bufferDays)
  const bufferDate = new Date(expiryDate);
  bufferDate.setDate(bufferDate.getDate() - bufferDays);

  // Compare if current date is on or after the buffer date
  return now >= bufferDate;
}

async function getCurrentUserData() {
  const userDataString = await SecureStore.getItemAsync('userData');
  if (!userDataString) return null;

  try {
    return JSON.parse(userDataString);
  } catch (e) {
    console.error('Invalid userData in SecureStore:', e);
    return null;
  }
}

async function getDeviceName() {
  if (Device.deviceName) {
    return Device.deviceName;
  }

  return `${Device.manufacturer} ${Device.modelName}`;
}

export const SaltoHelper = {
  /**
   * This method attempts to store the Salto MKey required to unlock doors by
   * first checking if the device has been registered before. If it has, it
   * proceeds to fetch its MKey and store it and its expiry date onto the
   * Keychain. If it has not, it first registers the device and then fetch its
   * MKey and store it onto the Keychain. Returns the logged-in user.
   *
   * Note: this method throws, so wrap it around a catch block.
   */
  async tryAuthenticate({ code, codeVerifier, redirectUrl }) {
    const accessToken = await SaltoAPI.getAccessToken({
      code,
      codeVerifier,
      redirectUrl,
      clientId: config.saltoClientId,
    });

    Alert.alert('Success', 'Successfully authenticated with Salto!');
    // handle auth depending on whether device has previously been registered or not
    await SecureStoreManager.store({
      key: KeychainService.SaltoAccessToken,
      value: accessToken,
    });
    const registeredDevice = await _checkDeviceRegistration(accessToken);
    const saltoPublicKey = await _getSaltoPublicKey();

    let authResults;
    if (registeredDevice) {
      authResults = await _authRegisteredDevice({
        accessToken,
        saltoPublicKey,
        registeredDevice,
      });
    } else {
      authResults = await _authNewDevice(accessToken, saltoPublicKey);
    }

    // store the results of successfully authenticating with Salto onto Keychain
    await SecureStoreManager.store({
      key: KeychainService.SaltoMKey,
      value: authResults.mkey,
    });
    await SecureStoreManager.store({
      key: KeychainService.SaltoDeviceId,
      value: authResults.deviceId,
    });
    await SecureStoreManager.store({
      key: KeychainService.SaltoExpiryDate,
      value: authResults.mkeyExpiryDate,
    });
  },

  /**
   * Fetches the Salto mkey that's normally stored in the Keychain to determine
   * if the user has authenticated with Salto before or not. If they key doesn't
   * exist, the user has not yet been authenticated.
   *
   * @returns whether the user has authenticated with Salto previously
   */
  async tryHasAuthenticated() {
    const mkey = await SecureStoreManager.retrieve({
      key: KeychainService.SaltoMKey,
    });
    return !!mkey;
  },

  /**
   * If provided an expiry date argument, this method returns whether it is
   * within the buffer day count of expiration. Otherwise, it attempts to fetch
   * the `SaltoExpiryDate` and `SaltoMKey` services from the Keychain and check
   * that date instead.
   *
   * Throws if no arguments are given and no expiry date and mkey is found on
   * the Keychain.
   */
  async tryHasMkeyExpired(mkeyExpiryDate) {
    let expiryDate = mkeyExpiryDate;
    if (!expiryDate) {
      expiryDate = await SecureStoreManager.retrieve(KeychainService.SaltoExpiryDate);

      const mkey = await SecureStoreManager.retrieve(KeychainService.SaltoMKey);
      if (!mkey) {
        throw new Error('No key has been stored on the device.');
      }
    }

    if (!expiryDate) {
      throw new Error('No key has been stored on the device.');
    }

    // mkey has "expired" if it's currently within the specified buffer days
    return isMkeyExpired(expiryDate, SALTO_CERT_EXPIRY_BUFFER_DAYS);
  },

  /** Tries to unlock door using the MKey stored on the Keychain. */
  async tryUnlockDoor() {
    await _unlockDoorNative();
  },
};

const _RNSaltoModule = NativeModules.RNSaltoModule;

function getDeviceUniqueId() {
  if (Platform.OS === 'android') {
    return Application.getAndroidId() || 'UNKNOWN_ANDROID_ID123';
  } else if (Platform.OS === 'ios') {
    return Application.getIosIdForVendorAsync();
  } else {
    throw new Error('Unsupported platform');
  }
}

/** Helper function to check if current device has been registered before. */
async function _checkDeviceRegistration(accessToken) {
  const deviceUniqueId = getDeviceUniqueId();
  const devices = await SaltoAPI.getUserDevices({ accessToken });
  return devices.find((d) => d.device_uid === deviceUniqueId);
}

/** Helper function to fetch the MKey for this already-registered device. */
async function _authRegisteredDevice({ accessToken, saltoPublicKey, registeredDevice }) {
  let mkeyExpiryDate = registeredDevice?.mkey?.expiry_date;

  const mKeyHasExpired = await SaltoHelper.tryHasMkeyExpired(mkeyExpiryDate);
  // if the registered device's previous mkey has expired, get a new one
  if (mKeyHasExpired) {
    mkeyExpiryDate = await SaltoAPI.replaceUserCert({
      accessToken,
      id: registeredDevice.id,
      publicKey: saltoPublicKey,
    });
  }

  // obtain the mkey for this device
  const mkey = await SaltoAPI.getMKeyWithId({
    accessToken,
    id: registeredDevice.id,
  });
  return { mkey, mkeyExpiryDate, deviceId: registeredDevice.id };
}

/** Helper function to register the current device and fetch its MKey. */
async function _authNewDevice(accessToken, saltoPublicKey) {
  const deviceName = await getDeviceName();
  const deviceUniqueId = getDeviceUniqueId();
  // register the device first
  const { id, expiryDate } = await SaltoAPI.registerUserDevice({
    accessToken,
    publicKey: saltoPublicKey,
    deviceName,
    deviceUid: deviceUniqueId,
  });

  // obtain the newly-registered device's mkey
  const mkey = await SaltoAPI.getMKeyWithId({
    accessToken,
    id,
  });

  return { mkey, mkeyExpiryDate: expiryDate, deviceId: id };
}

/** Helper function to call the native module to unlock the door. */
async function _unlockDoorNative() {
  try {
    const mkey = await SecureStoreManager.retrieve(KeychainService.SaltoMKey);
    const installationId = await _getSaltoInstallationId();
    const response = await _RNSaltoModule.openDoor(
      // installationId,
      // SALTO_PUBLIC_API_KEY_ACCEPT,
      mkey
    );
    console.log('object :>> ', response);
  } catch (error) {
    console.log('err 22:>> ', error);
    Alert.alert('Error1', error.message);
    if (error?.message?.includes('Invalid MKEY')) {
      const token = await SecureStoreManager.retrieve(KeychainService.SaltoAccessToken);
      const registeredDevice = await _checkDeviceRegistration(token);
      await SaltoAPI.deleteUserDevice({
        accessToken: token,
        deviceId: registeredDevice.id,
      });
    } else {
      Alert.alert('Unlock Error', error.message);
    }
  }
}

/** Helper function to call the native module to get the public key. */
async function _getSaltoPublicKey() {
  const saltoInstallationId = await _getSaltoInstallationId();
  return _RNSaltoModule.getPublicKey(saltoInstallationId, SALTO_PUBLIC_API_KEY_ACCEPT);
}

/** Helper function to form the user-device combination as installation ID. */
async function _getSaltoInstallationId() {
  const userData = await getCurrentUserData();
  const companyHasUserId = userData?.companyHasUserId;
  const deviceUniqueId = getDeviceUniqueId();
  return `${companyHasUserId ?? ''}-${deviceUniqueId}`;
}

export const getAuthUrl = async ({ clientId, redirectUri, state }) => {
  const { codeVerifier, codeChallenge } = await generateCodeVerifierAndChallenge();
  await SecureStore.setItemAsync('salto_code_verifier', codeVerifier);
  const query = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'user_api.full_access openid profile offline_access',
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
    response_mode: 'query',
    state,
  });

  return `${config.saltoIdentityUrl}/connect/authorize/callback?${query.toString()}`;
};

export const generateCodeVerifierAndChallenge = async () => {
  const randomBytes = Crypto.getRandomBytes(32);
  const codeVerifier = btoa(String.fromCharCode(...randomBytes))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  const hashed = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, codeVerifier, {
    encoding: Crypto.CryptoEncoding.BASE64,
  });

  const codeChallenge = hashed.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

  return { codeVerifier, codeChallenge };
};
