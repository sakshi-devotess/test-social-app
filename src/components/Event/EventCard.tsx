import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
  Alert,
  ActivityIndicator,
  Share,
  ScrollView,
} from 'react-native';
import {
  dateTimeTemplate,
  getEventStatusLabel,
  getFileById,
  getStatusLabel,
  getUserFullName,
} from '../../library/utilities/helperFunction';
import { EVENT_STATUS, EventTabStatus, MAX_DESCRIPTION_LINES } from '../../config/constants';
import { Feather, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { IEventCardProps } from '../../screens/Event/Event.model';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNBlobUtil from 'react-native-blob-util';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import ImagePreviewer from '../ImagePreviewer';
import { useCapitalizedTranslation } from '../../hooks/useCapitalizedTranslation';

const EventCard = (props: IEventCardProps) => {
  const {
    event,
    activeTab,
    selectedEventId,
    toggleSelection,
    handleKnowMore,
    imageUrl,
    onViewInvoice,
    isExpanded,
    onToggleExpand,
  } = props;
  const navigation = useNavigation<NavigationProp<any>>();
  const { t } = useCapitalizedTranslation();
  const [showToggle, setShowToggle] = useState(false);
  const [companyHasUserProductId, setCompanyHasUserProductId] = useState<number | null>(null);
  const isUpcomingTab = useMemo(() => activeTab === EventTabStatus.UPCOMING, [activeTab]);

  const receiptUrl = useMemo(() => {
    if (!event) return;
    const intentRawData = event?.companyHasUserProduct?.payment_intent_data;

    let intent;
    try {
      intent = intentRawData ? JSON.parse(intentRawData) : {};
    } catch (err) {
      console.error('Invalid payment_intent_data:', err);
      intent = {};
    }
    return intent?.receipt_url || '';
  }, [event]);

  const companyHasUserHasProductStatus = useMemo(() => {
    return getStatusLabel(event?.companyHasUserProduct?.status);
  }, [event?.companyHasUserProduct?.status]);

  const eventStatus = useMemo(() => {
    if (event?.status === EVENT_STATUS.PLANNED) return null;
    return getEventStatusLabel(event?.status);
  }, [event.status]);

  const isEventSelected = useMemo(() => {
    return isUpcomingTab && selectedEventId === event.id;
  }, [isUpcomingTab, selectedEventId, event.id]);

  const downloadReceipt = async (receiptUrl: string, companyHasUserProductId: number) => {
    setCompanyHasUserProductId(companyHasUserProductId);
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert('Permission Denied', 'Storage permission is required to save the receipt.');
          return;
        }
      }

      const fileName = `Receipt_${companyHasUserProductId}.pdf`;
      const response = await fetch(receiptUrl);
      const html = await response.text();

      const options = {
        html: html,
        fileName: fileName,
        directory: 'Download',
      };

      const file = await RNHTMLtoPDF.convert(options);
      if (!file?.filePath) return;
      if (Platform.OS === 'android') {
        const downloadDest = `${RNBlobUtil.fs.dirs.LegacyDownloadDir}/${fileName}`;

        await RNBlobUtil.fs.cp(file.filePath, downloadDest);

        RNBlobUtil.android.addCompleteDownload({
          title: 'Receipt',
          description: 'Your receipt has been downloaded.',
          mime: 'application/pdf',
          path: downloadDest,
          showNotification: true,
        });

        Alert.alert('Success', `Receipt saved to Downloads:\n${downloadDest}`);
        console.log('Saved to Downloads:', downloadDest);
      } else {
        //TODO: Need to test on iOS (Downloading functionality)
        await Share.share({
          url: `file://${file.filePath}`,
          title: 'Your Receipt',
          message: 'Here is your event receipt.',
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to generate PDF');
      console.error('PDF error:', error);
    } finally {
      setCompanyHasUserProductId(null);
    }
  };

  const renderEventSchedules = () => {
    if (!event.product_slots || event.product_slots.length === 0) {
      return <Text style={styles.noScheduleText}>{t('objects.event.messages.noSchedules')}</Text>;
    }

    return (
      <View style={styles.scheduleWrapper}>
        <Text style={styles.scheduleHeader}>{t('objects.event.attributes.schedules')}:</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={true}
          contentContainerStyle={styles.scrollContent}
          style={styles.scrollContainer}
        >
          {event.product_slots.map((slot) => (
            <View key={slot.id} style={styles.scheduleCard}>
              <Text style={styles.scheduleTitle}>{slot.title}</Text>
              <Text style={styles.scheduleDate}>
                Start Time : {dateTimeTemplate(slot.start_date_time)}
              </Text>
              <Text style={styles.scheduleDate}>
                End Time : {dateTimeTemplate(slot.start_date_time)}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderEventInfo = () => (
    <View style={styles.rowLayout}>
      <ImagePreviewer
        uri={imageUrl}
        style={styles.eventThumbnail}
        getNewUri={() => getFileById(event?.file_id!)}
      />
      <View style={styles.eventInfo}>
        <Text style={styles.cardTitle}>📝 {event.title}</Text>
        <Text style={styles.cardDate}>
          📅 {dateTimeTemplate(event.start_time)} - {dateTimeTemplate(event.end_time)}
        </Text>
        <Text style={styles.cardPrice}>💰 {event.price ? `${event.price}` : 'Free'}</Text>
        <Text
          style={styles.cardDescription}
          numberOfLines={MAX_DESCRIPTION_LINES}
          onTextLayout={(e) => {
            if (!showToggle && e?.nativeEvent?.lines?.length > MAX_DESCRIPTION_LINES) {
              setShowToggle(true);
            }
          }}
        >
          {event.description}
        </Text>

        {showToggle && (
          <TouchableOpacity onPress={() => handleKnowMore?.(event)}>
            <Text style={styles.knowMoreText}>{t('components.button.name.knowMore')}</Text>
          </TouchableOpacity>
        )}
        {eventStatus && (
          <View style={styles.footerStatusRow}>
            <Text style={styles.footerStatusLabel}>{t('objects.event.attributes.status')}:</Text>
            <View style={[styles.statusTagSmall, { backgroundColor: eventStatus.color }]}>
              <Text style={styles.statusTextSmall}>{eventStatus.label}</Text>
            </View>
          </View>
        )}
        <Text style={styles.cardOrganizer}>
          {t('objects.event.attributes.organizedBy')}{' '}
          {getUserFullName(event?.organizer_company_has_user)}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={[styles.card, isEventSelected && styles.cardSelected]}>
      {isEventSelected && isUpcomingTab && (
        <View style={styles.checkIcon}>
          <MaterialIcons name="check-circle" size={24} color="#007aff" />
        </View>
      )}

      {companyHasUserHasProductStatus && activeTab === EventTabStatus.MYEVENT && (
        <View style={styles.topRightLabel}>
          <View
            style={[styles.statusTag, { backgroundColor: companyHasUserHasProductStatus.color }]}
          >
            <Text style={styles.statusText}>{companyHasUserHasProductStatus.label}</Text>
          </View>
        </View>
      )}
      {isUpcomingTab ? (
        <Pressable
          onPress={() => toggleSelection(event.id, event?.company?.stripe_publish_key)}
          style={styles.pressableArea}
        >
          {renderEventInfo()}
        </Pressable>
      ) : (
        renderEventInfo()
      )}

      <View style={styles.invoiceButtonsContainer}>
        {activeTab === EventTabStatus.MYEVENT && (
          <>
            <TouchableOpacity style={styles.invoiceButton} onPress={() => onViewInvoice(event)}>
              <Feather name="eye" size={14} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.invoiceButton, { backgroundColor: '#e1e2f2' }]}
              onPress={() => navigation.navigate('ReceiptWebView', { receiptUrl })}
            >
              <FontAwesome5 name="file-invoice" size={14} color="#000" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.invoiceButton, styles.invoiceButtonSecondary]}
              onPress={() => downloadReceipt(receiptUrl, event?.companyHasUserProduct?.id)}
            >
              {companyHasUserProductId === event?.companyHasUserProduct?.id ? (
                <ActivityIndicator size="small" color="#333" />
              ) : (
                <Feather name="download" size={14} color="#333" />
              )}
            </TouchableOpacity>
          </>
        )}

        <TouchableOpacity onPress={() => onToggleExpand && onToggleExpand(event.id)}>
          <MaterialIcons
            name={isExpanded ? 'expand-less' : 'expand-more'}
            size={22}
            color="#007aff"
          />
        </TouchableOpacity>
      </View>

      {isExpanded && renderEventSchedules()}
    </View>
  );
};

export default React.memo(EventCard);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginHorizontal: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
  },
  cardSelected: {
    borderWidth: 2,
    borderColor: '#007aff',
    backgroundColor: '#e0f0ff',
    shadowColor: '#007aff',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
    flexShrink: 1,
    paddingRight: 8,
  },
  cardDate: {
    fontSize: 13,
    color: '#555',
    marginBottom: 4,
  },
  cardPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  cardDescription: {
    fontSize: 14,
    color: '#444',
    marginVertical: 6,
  },
  cardOrganizer: {
    fontSize: 13,
    color: '#999',
    fontStyle: 'italic',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
  },
  footerStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  footerStatusLabel: {
    fontSize: 13,
    color: '#666',
    marginRight: 4,
  },
  statusTagSmall: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  statusTextSmall: {
    fontSize: 11,
    color: '#fff',
    fontWeight: '500',
  },
  checkIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  knowMoreText: {
    color: '#007aff',
    fontSize: 14,
    fontWeight: '500',
  },
  eventImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 10,
  },
  rowLayout: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },

  eventThumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 10,
  },

  eventInfo: {
    flex: 1,
    flexDirection: 'column',
  },
  topRightLabel: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 2,
  },

  invoiceButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
    gap: 10,
  },
  invoiceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007aff',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  invoiceButtonSecondary: {
    backgroundColor: '#f0f0f0',
  },
  scheduleWrapper: {
    marginTop: 10,
  },
  scheduleHeader: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#003366',
    marginBottom: 6,
    paddingHorizontal: 4,
  },
  scrollContainer: {
    maxHeight: 150,
    width: '100%',
  },
  scrollContent: {
    paddingHorizontal: 8,
    flexDirection: 'row',
  },

  scheduleCard: {
    backgroundColor: '#e6f0ff',
    padding: 14,
    borderRadius: 10,
    width: 220,
    marginRight: 12,
    borderColor: '#007aff33',
    borderWidth: 1,
    elevation: 2,
  },
  scheduleTitle: {
    fontWeight: 'bold',
    fontSize: 12,
    marginBottom: 6,
    color: '#003366',
  },
  scheduleDate: {
    fontSize: 12,
    color: '#444',
  },
  pressableArea: {
    flex: 1,
  },
  noScheduleText: {
    fontSize: 12,
    color: '#000',
    padding: 5,
  },
});
