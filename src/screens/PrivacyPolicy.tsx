import { SafeAreaView, StyleSheet } from 'react-native';
import WebView from 'react-native-webview';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { config } from '../config/constants';
import Loader from '../components/Loader';

const sections = [
  {
    id: 1,
    title: '1. Information We Collect',
    content: `DogPark may collect certain personal and non-personal information, including:
    • Location data (to show nearby parks or dog owners)
    • Photos (if you upload a profile or dog image)
    • Email address or username (for account login)
    • Device and usage data (for analytics and debugging)`,
  },
  {
    id: 2,
    title: '2. How We Use Your Information',
    content: `We use the collected information to:
    • Provide and improve app functionality
    • Connect users with nearby dog parks and other users
    • Send notifications (if enabled)
    • Analyze usage and improve performance`,
  },
  {
    id: 3,
    title: '3. Sharing Your Information',
    content: `We do not sell or rent your personal information. We may share data with:
    • Service providers for analytics and app infrastructure
    • Legal authorities if required by law`,
  },
  {
    id: 4,
    title: '4. Third-Party Services',
    content: `DogPark may use third-party tools (e.g., Firebase, Google Maps) that collect data as per their own privacy policies.`,
  },
];

const PrivacyPolicy = () => {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.safeArea}>
      <WebView
        originWhitelist={['*']}
        style={{ flex: 1, marginBottom: insets.bottom }}
        source={{ uri: `${config.webUrl}/privacy-policy` }}
        startInLoadingState={true}
        renderLoading={() => <Loader loading={true} size="large" color="#0000ff" />}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  intro: {
    fontSize: 16,
    marginBottom: 20,
    lineHeight: 22,
  },
  section: {
    marginBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  sectionContent: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22,
    color: '#444',
  },
  updated: {
    marginTop: 30,
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
});

export default PrivacyPolicy;
