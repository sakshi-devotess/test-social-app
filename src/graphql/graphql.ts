import {
  ApolloClient,
  from,
  fromPromise,
  HttpLink,
  InMemoryCache,
  Observable,
} from '@apollo/client/main.cjs';
import { config } from '../config/constants';
import { setContext } from '@apollo/client/link/context';
import * as SecureStore from 'expo-secure-store';
import { onError } from '@apollo/client/link/error';
import authApiInstance from '../services/auth/auth';
import { GraphQLQueryFailPopUp } from '../library/utilities/message';
import { persistCache, AsyncStorageWrapper } from 'apollo3-cache-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

let refreshPromise: Promise<{
  access_token: string;
  refresh_token: string;
}> | null = null;

const getNewToken = (
  oldRefreshToken: string,
  parsedData: any
): Promise<{
  access_token: string;
  refresh_token: string;
}> => {
  if (refreshPromise) return refreshPromise;
  refreshPromise = authApiInstance
    .refreshToken(oldRefreshToken)
    .then(async (response) => {
      const { access_token, refresh_token: newRefreshToken } = response;
      const updatedUserData = {
        ...parsedData,
        access_token,
        refresh_token: newRefreshToken,
      };

      await SecureStore.setItemAsync('userData', JSON.stringify(updatedUserData));

      return {
        access_token,
        refresh_token: newRefreshToken,
      };
    })
    .catch(async (err) => {
      console.error('Refresh failed:', err);
      await SecureStore.deleteItemAsync('userData');
      throw err;
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
};

const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  console.log('graphQLErrors :>> ', graphQLErrors);
  if (graphQLErrors) {
    for (let err of graphQLErrors) {
      switch (err?.extensions?.code) {
        case 'UNAUTHENTICATED': {
          //get refresh token from store
          const refreshAndRetry = async () => {
            try {
              const storedData = await SecureStore.getItemAsync('userData');
              if (!storedData) throw new Error('No user data in SecureStore');

              const parsedData = JSON.parse(storedData);
              const { access_token } = await getNewToken(parsedData.refresh_token, parsedData);

              // Update request with new token
              const oldHeaders = operation.getContext().headers;
              operation.setContext({
                headers: {
                  ...oldHeaders,
                  authorization: `Bearer ${access_token}`,
                },
              });
              return access_token;
            } catch (error) {
              console.error('Token refresh failed:', error);
              await SecureStore.deleteItemAsync('userData');
              return null;
            }
          };

          return fromPromise(refreshAndRetry())
            .filter((token) => Boolean(token))
            .flatMap(() => forward(operation));
        }
        case 'FORBIDDEN':
          alert('Forbidden to access the resource');
          break;
      }
    }

    const definitions: any = operation.query.definitions[0];
    if (definitions.operation !== 'mutation') {
      return new Observable((observer) => {
        const timer = setTimeout(() => {
          forward(operation).subscribe((res) => {
            if (res.errors) {
              GraphQLQueryFailPopUp(res.errors);
            }
            observer.next(res);
            observer.complete();
          });
        }, 1000); // Introduce a 1-second delay
        return () => {
          clearTimeout(timer);
        };
      });
    }
  }
  if (networkError) console.log(`[Network error]: ${networkError}`);
});
const httpLink = new HttpLink({ uri: config.graphQlUrl, fetch });

const authLink = setContext(async (_, { headers }) => {
  // get the authentication token from local storage if it exists
  const storedUserData = await SecureStore.getItemAsync('userData');
  const token = storedUserData ? JSON.parse(storedUserData)?.access_token : null;

  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});
const cache = new InMemoryCache();
persistCache({
  cache,
  storage: new AsyncStorageWrapper(AsyncStorage),
});
export const client = new ApolloClient({
  cache: cache,
  link: authLink.concat(from([errorLink, httpLink])),

  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'network-only',
      nextFetchPolicy: 'cache-and-network',
      errorPolicy: 'all',
    },
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
});
