import React, { useContext, useEffect, useState } from 'react';
import {
  Alert,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Dimensions,
  SafeAreaView,
  Platform,
  PermissionsAndroid,
  Linking,
} from 'react-native';
import { colors, config } from '../config/constants'; // assuming you have a color palette
import dashboardBgImage from '../assets/dashboard-bg.jpg'; // background image
import { AntDesign, Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import { AuthenticatedUserContext } from '../contexts/AuthenticatedUserContext';
import * as Location from 'expo-location';
import { getDistance } from 'geolib';
import AppButton from '../components/Button';
import Loader from '../components/Loader';
import { useCapitalizedTranslation } from '../hooks/useCapitalizedTranslation';
import {
  getAuthUrl,
  KeychainService,
  SaltoHelper,
  SecureStoreManager,
} from '../helper/saltoHelper/saltoHelper';
import { useRoute } from '@react-navigation/native';
import { use } from 'i18next';
const { width, height } = Dimensions.get('window');

const Dashboard = () => {
  const { setUser, SetLoginState, user } = useContext(AuthenticatedUserContext);
  const route = useRoute();
  const [loading, setLoading] = useState(false);
  const { t } = useCapitalizedTranslation();
  const onSignOut = async () => {
    SecureStore.deleteItemAsync('userData');
    setUser(null);
    SetLoginState(false);

    await SecureStoreManager.delete(KeychainService.SaltoMKey);
    await SecureStoreManager.delete(KeychainService.SaltoDeviceId);
    await SecureStoreManager.delete(KeychainService.SaltoExpiryDate);
    SecureStore.deleteItemAsync('salto_code_verifier');
    SecureStore.deleteItemAsync('userData');
  };
  const MIN_DISTANCE = 100; // meters
  const predefinedLocation = {
    latitude: 21.2347241,
    longitude: 72.8713732,
  };

  async function requestLocationPermissionIfNeeded() {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, // still needed for BLE scan
      ]);

      const allGranted = Object.values(granted).every(
        (status) => status === PermissionsAndroid.RESULTS.GRANTED
      );

      if (!allGranted) {
        Alert.alert(
          'Permission Denied',
          'Location and Bluetooth permissions are required to access this feature.'
        );
      }
    }
  }

  const getAccessToken = async (code: string) => {
    const codeVerifier = await SecureStore.getItemAsync('salto_code_verifier');

    try {
      await SaltoHelper.tryAuthenticate({
        code: code,
        codeVerifier: codeVerifier,
        redirectUrl: config.saltoRedirectUri,
      });
      await SaltoHelper.tryUnlockDoor();
    } catch (error) {
      console.log('error :>> ', error);
      Alert.alert('Error-dashboard', error.message);
    } finally {
      // setLoading(false);
    }
  };
  useEffect(() => {
    if (route?.params?.code) {
      getAccessToken(route?.params?.code);
    }
  }, [route?.params]);

  const openLocation = async () => {
    // setLoading(true);
    await requestLocationPermissionIfNeeded();

    try {
      const makeRequest = async () => {
        try {
          const authUrl = await getAuthUrl({
            clientId: config.saltoClientId,
            redirectUri: config.saltoRedirectUri,
            state: 'b94679935253446094142ffd722db666',
          });

          Linking.openURL(authUrl);
        } catch (error) {
          console.error('Fetch error:', error);
        }
      };

      await makeRequest();
    } catch (error) {
      console.error(error);
    }
    //TODO: Temporary comminted out the location logic
    // try {
    //   setLoading(true);

    //   const { status } = await Location.requestForegroundPermissionsAsync();

    //   if (status !== 'granted') {
    //     Alert.alert('Permission Denied', 'We need location access to proceed.');
    //     setLoading(false);
    //     return;
    //   }

    //   const location = await Location.getCurrentPositionAsync({
    //     accuracy: Location.Accuracy.Highest,
    //   });
    //   console.log('latitude :>> ', location);

    //   const { latitude, longitude } = location.coords;

    //   const distance = getDistance({ latitude, longitude }, predefinedLocation);
    //   console.log('distance :>> ', distance);

    //   if (distance <= MIN_DISTANCE) {
    //     Alert.alert('✅ Access Granted', 'You are at the dog park.');
    //   } else {
    //     Alert.alert('❌ Access Denied', `You're ${distance} meters away.`);
    //   }
    // } catch (err) {
    //   console.error(err);
    //   Alert.alert('Error', 'Something went wrong while getting location.');
    // } finally {
    //   setLoading(false); // Hide loader after everything
    // }
  };
  if (!user?.first_name || !user?.last_name) {
    return <Loader loading={true} />;
  }
  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground source={dashboardBgImage} style={styles.headerBackground}>
        <View style={styles.topBar}>
          <View>
            <Text style={styles.headerText}>{t('components.dashboard.name')}</Text>
            <Text style={styles.usernameText}>
              {user?.first_name
                ? `${t('components.dashboard.welcomeMessage')}, ${user.first_name} ${user.last_name} 👋`
                : 'Loading user...'}
            </Text>
          </View>
          <TouchableOpacity onPress={async () => await onSignOut()} style={styles.settingsButton}>
            <Text style={styles.settingsText}>{t('components.button.name.logout')}</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
      <View style={styles.iconRow}>
        <TouchableOpacity style={styles.iconItem}>
          <View style={styles.iconBackground}>
            <AntDesign name="calendar" size={32} color="black" />
          </View>
          <Text style={styles.iconLabel}>{t('components.dashboard.features.book')}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconItem}>
          <View style={styles.iconBackground}>
            <Ionicons name="people-circle" size={32} color="black" />
          </View>
          <Text style={styles.iconLabel}>{t('components.dashboard.features.community')}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconItem}>
          <View style={styles.iconBackground}>
            <Ionicons name="checkmark-circle" size={32} color="black" />
          </View>
          <Text style={styles.iconLabel}>{t('components.dashboard.features.calender')}</Text>
        </TouchableOpacity>
      </View>

      <AppButton
        text={t('components.button.name.openLock')}
        onPress={openLocation}
        loading={loading}
        style={styles.mainButton}
      />

      <ScrollView
        contentContainerStyle={styles.bodyContainer}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <Text style={styles.sectionTitle}>Explore</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Nearby Parks</Text>
          <Text style={styles.cardSubtitle}>Find dog-friendly parks around you</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Upcoming Events</Text>
          <Text style={styles.cardSubtitle}>Join dog meetups & activities</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Check-In</Text>
          <Text style={styles.cardSubtitle}>Check into your favorite parks</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  iconBackground: {
    backgroundColor: colors.grey,
    padding: 12,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  headerBackground: {
    height: height * 0.25,
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.02,
    justifyContent: 'space-between',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
  },
  settingsButton: {
    backgroundColor: '#fff',
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  settingsText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: -40,
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: '#fff',
  },
  openButton: {
    marginVertical: 20,
    alignSelf: 'center',
    backgroundColor: '#007BFF',
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 50,
  },
  openButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  bodyContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.02,
    borderRadius: 15,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardSubtitle: {
    marginTop: 5,
    color: '#777',
    fontSize: 14,
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: width * 0.9,
    alignSelf: 'center',
    marginTop: height * 0.03,
  },
  iconItem: {
    alignItems: 'center',
  },
  iconLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 5,
  },
  mainButton: {
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 30,
    alignItems: 'center',
    margin: 20,
  },
  usernameText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Dashboard;
