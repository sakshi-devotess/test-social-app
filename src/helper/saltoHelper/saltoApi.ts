/**
 * This file contains the functions that interface with Salto's server to carry
 * out operations like registering a user device, replacing a user's cert, and
 * retrieving a user's MKey.
 */

export const SaltoAPI = {
  getAccessToken,
  getUserDevices,
  registerUserDevice,
  replaceUserCert,
  getMKeyWithId,
  deleteUserDevice,
};

const SaltoAuthUrl = 'https://identity-acc.eu.my-clay.com/connect/token';
const SaltoBaseUrl = 'https://clp-accept-user.saltoks.com/v1.2';

async function getAccessToken({ code, codeVerifier, redirectUrl, clientId }) {
  const formBody = Object.entries({
    grant_type: 'authorization_code',
    code,
    code_verifier: codeVerifier,
    redirect_uri: redirectUrl,
    client_id: clientId,
    client_secret: '',
  })
    .map(([key, value]) => encodeURIComponent(key) + '=' + encodeURIComponent(value))
    .join('&');

  const url = SaltoAuthUrl;
  const options = {
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
    body: formBody,
  };
  const response = await _handleResponse(await fetch(url, options));
  return response.access_token;
}

/** Retrieves the list of registered devices for the user owning the token. */
async function getUserDevices({ accessToken }) {
  const url = `${SaltoBaseUrl}/me/devices`;
  const options = {
    method: 'get',
    headers: _getHeaders(accessToken),
  };
  const response = await _handleResponse(await fetch(url, options));
  return response.items;
}

/**
 * Registers the user's device and returns the created device ID and expiry date
 * of the generated certificate/MKey.
 */
async function registerUserDevice({ accessToken, deviceName, deviceUid, publicKey }) {
  const url = `${SaltoBaseUrl}/me/devices`;
  const options = {
    method: 'post',
    headers: _getHeaders(accessToken),
    body: JSON.stringify({
      device_name: deviceName,
      device_uid: deviceUid,
      public_key: publicKey,
    }),
  };

  const response = await _handleResponse(await fetch(url, options));
  return { id: response.id, expiryDate: response?.mkey?.expiry_date };
}

/**
 * Replaces the device's existing certificate and returns the expiry date of
 * the new one.
 */
async function replaceUserCert({ accessToken, id, publicKey }) {
  const url = `${SaltoBaseUrl}/me/devices/${id}/certificate`;
  const options = {
    method: 'put',
    headers: _getHeaders(accessToken),
    body: JSON.stringify({
      public_key: publicKey,
    }),
  };

  const response = await _handleResponse(await fetch(url, options));
  return response.mkey?.expiry_date;
}

/** Returns the MKey corresponding to the provided device ID. */
async function getMKeyWithId({ accessToken, id }) {
  const url = `${SaltoBaseUrl}/me/devices/${id}/mkey`;
  const options = {
    method: 'get',
    headers: _getHeaders(accessToken),
  };

  const response = await _handleResponse(await fetch(url, options));
  return response.mkey_data;
}

/** Helper function to form the header required to call Salto's endpoints. */
function _getHeaders(accessToken) {
  return {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken}`,
  };
}

/** Helper function to handle response from calling Salto's endpoints. */
async function _handleResponse(response) {
  const responseJson = await response.json();
  if (!response.ok) {
    if (responseJson.ErrorCode) {
      return Promise.reject(new Error(responseJson.Message));
    } else {
      return Promise.reject(new Error('Something went wrong.'));
    }
  }
  return responseJson;
}

async function deleteUserDevice({ accessToken, deviceId }) {
  const url = `${SaltoBaseUrl}/me/devices/${deviceId}`;
  const options = {
    method: 'delete',
    headers: _getHeaders(accessToken),
  };

  const response = await fetch(url, options);
  console.log('response1 :>> ', response);
  if (!response.ok) {
    const responseJson = await response.json().catch(() => null);
    const errorMessage = responseJson?.Message || 'Failed to delete device from Salto.';
    throw new Error(errorMessage);
  }

  return true;
}
