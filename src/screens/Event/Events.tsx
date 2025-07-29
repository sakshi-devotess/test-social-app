import React, { useContext, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  SafeAreaView,
  Alert,
  Modal,
  LayoutAnimation,
  Dimensions,
} from 'react-native';
import { EVENT_STATUS, EventTabStatus } from '../../config/constants';
import EventCard from '../../components/Event/EventCard';
import { useQuery } from '@apollo/client';
import { mutateFromFormData, MUTATION_TYPE_CREATE } from '../../graphql/mutation.service';
import { ICompanyHasUserHasProduct, IProduct } from './Event.model';
import Loader from '../../components/Loader';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { confirmPayment } from '@stripe/stripe-react-native';
import PaymentResultModal from '../../components/PaymentResult/PaymentResultModal';
import AppButton from '../../components/Button';
import { GET_EVENTS } from '../../graphql/queries/Product/product.query';
import { GET_COMPANY_HAS_USER_HAS_EVENTS } from '../../graphql/queries/CompanyHasUserHasProduct/companyHasUserHasProduct.query';
import fileApiInstance from '../../services/file/file.service';
import PaymentReceiptModal from '../../components/Payment/PaymentReceiptModal';
import EmptyComponent from '../../components/EmptyComponent';
import { useStripeKey } from '../../contexts/StripeContext';
import FilterModal from '../../components/FilterModal/FilterModal';
import FilterButton from '../../components/FilterButton/FilterButton';
import { useCapitalizedTranslation } from '../../hooks/useCapitalizedTranslation';
import { MessageContext } from '../../contexts/MessageContext';
const { width } = Dimensions.get('window');

const Events = () => {
  const { t } = useCapitalizedTranslation();
  const { pushMessageFromMutationResponse } = useContext(MessageContext);
  const [activeTab, setActiveTab] = useState<string>(EventTabStatus.UPCOMING);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { data, refetch: refetchEvents } = useQuery(GET_EVENTS);
  const { data: companyWiseEventData, refetch } = useQuery(GET_COMPANY_HAS_USER_HAS_EVENTS);
  const isFocused = useIsFocused();
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEventDetails, setSelectedEventDetails] = useState<{
    title: string;
    description: string;
  } | null>(null);
  const [eventImages, setEventImages] = useState<Record<number, string>>({});
  const [selectedInvoice, setSelectedInvoice] = useState<IProduct | null>(null);
  const [expandedCardId, setExpandedCardId] = useState<number | null>(null);
  const [viewInvoiceModal, setViewInvoiceModal] = useState(false);
  const navigation = useNavigation();
  const [filterVisible, setFilterVisible] = useState(false);
  const [filters, setFilters] = useState({
    name: '',
  });
  const { setPublishableKey } = useStripeKey();
  useEffect(() => {
    if (isFocused) {
      setLoading(true);
      Promise.all([refetchEvents(), refetch()]).finally(() => {
        setLoading(false);
      });
    } else {
      setLoading(false);
      setSelectedEventId(null);
      setPaymentStatus(null);
      setErrorMessage(null);
      setPaymentLoading(false);
      setFilters({ name: '' });
      setFilterVisible(false);
    }
  }, [isFocused]);
  const filteredEvents = useMemo(() => {
    const upcomingEvents = data?.getEvents || [];

    const subscribedEventIds = (companyWiseEventData?.getCompanyHasUserHasEvents || []).map(
      (companyHasUserEvent: ICompanyHasUserHasProduct) => companyHasUserEvent.product_id
    );
    const subscribedSet = new Set(subscribedEventIds);

    const onlyUpcoming = upcomingEvents.filter(
      (event: IProduct) => !subscribedSet.has(event.id) && event.status === EVENT_STATUS.PLANNED
    );
    const myEvents = (companyWiseEventData?.getCompanyHasUserHasEvents || [])
      .map((subEvent: ICompanyHasUserHasProduct) => {
        const matchedEvent = upcomingEvents.find(
          (event: IProduct) => event.id === subEvent.product_id
        );
        if (!matchedEvent) return null;

        return {
          ...matchedEvent,
          companyHasUserProduct: subEvent,
        };
      })
      .filter(Boolean);
    let filteredList = activeTab === EventTabStatus.UPCOMING ? onlyUpcoming : myEvents;

    if (filters.name !== '') {
      filteredList = filteredList.filter((event: IProduct) =>
        event.title.toLowerCase().includes(filters.name.toLowerCase())
      );
    }
    return filteredList;
  }, [activeTab, data, companyWiseEventData, filters]);

  const handleEventParticipation = (eventId: number) => {
    Alert.alert(
      'Confirm Participation',
      'Are you sure you want to participate in this event?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => {
            handleEventParticipationPayment(eventId);
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleEventParticipationPayment = async (eventId: number) => {
    setPaymentLoading(true);
    try {
      mutateFromFormData(
        {
          productId: eventId,
        },
        'KlarnaPaymentIntent',
        MUTATION_TYPE_CREATE,
        ['clientSecret', 'customerEmail', 'name']
      ).then(async (res) => {
        pushMessageFromMutationResponse(res?.response);
        const clientSecret = res?.response?.clientSecret;
        const customerEmail = res?.response?.customerEmail;
        const name = res?.response?.name;
        if (!clientSecret) return;
        //TODO : Modify this when account is changed to Sweden
        const { error, paymentIntent } = await confirmPayment(clientSecret, {
          paymentMethodType: 'Klarna',
          paymentMethodData: {
            billingDetails: {
              email: customerEmail,
              address: {
                country: 'US',
              },
              name: name,
            },
          },
        });

        if (error) {
          setPaymentStatus('error');
          setErrorMessage(error.message);
        } else if (paymentIntent) {
          setPaymentStatus('success');
          refetch();
        }
        setPaymentLoading(false);
        setSelectedEventId(null);
      });
    } catch (error) {
      console.error('Error creating Klarna payment intent:', error);
    }
  };
  const appliedFilterCount = Object.values(filters).filter(
    (val) => val && val.trim() !== ''
  ).length;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <FilterButton count={appliedFilterCount} onPress={() => setFilterVisible(true)} />
      ),
    });
  }, [navigation, appliedFilterCount]);

  const toggleEventSelection = (eventId: number, companyPublishKey: string) => {
    setSelectedEventId((prev) => (prev === eventId ? null : eventId));
    setPaymentLoading(false);
    setPublishableKey(companyPublishKey);
  };

  const handleKnowMore = (event: IProduct) => {
    setSelectedEventDetails({
      title: event.title,
      description: event.description,
    });
    setModalVisible(true);
  };

  const preloadImages = async () => {
    if (!data?.getEvents) return;
    const entries = await Promise.all(
      data.getEvents.map(async (event: IProduct) => {
        if (!event.file_id) return [event.id, null];
        try {
          const fileUrl = await fileApiInstance.getFile(event.file_id);
          return [event.id, fileUrl];
        } catch (err) {
          console.error('Failed to preload image:', err);
          return [event.id, null];
        }
      })
    );
    setEventImages(Object.fromEntries(entries));
  };
  useEffect(() => {
    if (!isFocused || !data?.getEvents) return;

    preloadImages();
  }, [data, isFocused]);

  const onViewInvoice = (event: IProduct) => {
    setSelectedInvoice(event);
    setViewInvoiceModal(true);
  };

  const toggleExpanded = (id: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedCardId((prev) => (prev === id ? null : id));
  };

  return (
    <SafeAreaView style={styles.container}>
      <Loader loading={loading}>
        <FilterModal
          visible={filterVisible}
          onClose={() => setFilterVisible(false)}
          onApply={(filters) => {
            setFilters(filters);
          }}
          initialFilters={filters}
        />
        <View style={styles.tabBar}>
          <Pressable
            style={[styles.tab, activeTab === EventTabStatus.UPCOMING && styles.activeTab]}
            onPress={() => setActiveTab(EventTabStatus.UPCOMING)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === EventTabStatus.UPCOMING && styles.activeTabText,
              ]}
            >
              {t('objects.event.attributes.upcomingEvents')}
            </Text>
          </Pressable>
          <Pressable
            style={[styles.tab, activeTab === EventTabStatus.MYEVENT && styles.activeTab]}
            onPress={() => setActiveTab(EventTabStatus.MYEVENT)}
          >
            <Text
              style={[styles.tabText, activeTab === EventTabStatus.MYEVENT && styles.activeTabText]}
            >
              {t('objects.event.attributes.myEvents')}
            </Text>
          </Pressable>
        </View>

        <FlatList
          data={filteredEvents}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const isExpanded = expandedCardId === item.id;
            return (
              <EventCard
                event={item}
                activeTab={activeTab}
                paymentLoading={paymentLoading}
                toggleSelection={toggleEventSelection}
                selectedEventId={selectedEventId}
                handleKnowMore={handleKnowMore}
                imageUrl={eventImages[item.id]}
                onViewInvoice={onViewInvoice}
                isExpanded={isExpanded}
                onToggleExpand={() => toggleExpanded(item.id)}
              />
            );
          }}
          ListEmptyComponent={EmptyComponent(
            activeTab === EventTabStatus.UPCOMING
              ? t('objects.event.messages.noUpcomingEvents')
              : t('objects.event.messages.noMyEvents')
          )}
        />
        {activeTab === EventTabStatus.UPCOMING && selectedEventId !== null && (
          <View style={styles.stickyButtonContainer}>
            <AppButton
              text={t('components.button.name.participantAndPay')}
              onPress={() => {
                handleEventParticipation(selectedEventId);
              }}
              style={styles.participateButton}
              loading={paymentLoading}
            />
          </View>
        )}
        <PaymentResultModal
          visible={paymentStatus !== null}
          success={paymentStatus === 'success'}
          onClose={() => setPaymentStatus(null)}
          errorMessage={errorMessage!}
        />
        <Modal
          visible={modalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{selectedEventDetails?.title}</Text>
              <Text style={styles.modalDescription}>{selectedEventDetails?.description}</Text>
              <AppButton
                text="Close"
                onPress={() => setModalVisible(false)}
                style={{ marginTop: 20 }}
              />
            </View>
          </View>
        </Modal>

        <PaymentReceiptModal
          visible={viewInvoiceModal}
          onClose={() => setViewInvoiceModal(false)}
          invoiceData={selectedInvoice}
        />
      </Loader>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    margin: 16,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
    borderColor: '#007aff',
    borderWidth: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#007aff',
  },
  tabText: {
    color: '#000',
    fontWeight: '600',
  },
  activeTabText: {
    color: '#fff',
    fontWeight: '600',
  },
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
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
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
  subscribeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  subscribeText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
    marginBottom: 6,
  },
  cardDate: {
    fontSize: 13,
    color: '#555',
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
  participateButton: {
    marginTop: 15,
    backgroundColor: '#007aff',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  stickyButtonContainer: {
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '60%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 14,
    color: '#444',
  },
  filterBadge: {
    position: 'absolute',
    right: width * 0.09,
    top: -2,
    backgroundColor: '#ff3b30',
    borderRadius: 8,
    paddingHorizontal: width * 0.015,
    paddingVertical: 2,
    zIndex: 10,
  },
  filterBadgeText: {
    color: '#fff',
    fontSize: width * 0.03,
    fontWeight: 'bold',
  },
  filterIcon: { marginRight: 16 },
});

export default Events;
