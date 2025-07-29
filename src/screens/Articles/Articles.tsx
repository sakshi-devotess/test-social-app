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
  Dimensions,
} from 'react-native';
import { ARTICLE_STATUS, ArticleTabStatus } from '../../config/constants';
import ArticleCard from '../../components/Article/ArticleCard';
import { useQuery } from '@apollo/client';
import { mutateFromFormData, MUTATION_TYPE_CREATE } from '../../graphql/mutation.service';
import Loader from '../../components/Loader';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { confirmPayment } from '@stripe/stripe-react-native';
import PaymentResultModal from '../../components/PaymentResult/PaymentResultModal';
import AppButton from '../../components/Button';
import { GET_COMPANY_HAS_USER_HAS_ARTICLES } from '../../graphql/queries/CompanyHasUserHasProduct/companyHasUserHasProduct.query';
import fileApiInstance from '../../services/file/file.service';
import { ICompanyHasUserHasProduct, IProduct } from './Articles.model';
import { GET_ARTICLES } from '../../graphql/queries/Product/product.query';
import EmptyComponent from '../../components/EmptyComponent';
import { useStripeKey } from '../../contexts/StripeContext';
import FilterModal from '../../components/FilterModal/FilterModal';
import FilterButton from '../../components/FilterButton/FilterButton';
import { useCapitalizedTranslation } from '../../hooks/useCapitalizedTranslation';
import { MessageContext } from '../../contexts/MessageContext';
const { width } = Dimensions.get('window');

const Articles = () => {
  const { t } = useCapitalizedTranslation();
  const { pushMessageFromMutationResponse } = useContext(MessageContext);
  const [activeTab, setActiveTab] = useState<string>(ArticleTabStatus.NEW);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { data, refetch: refetchArticles } = useQuery(GET_ARTICLES);
  const { data: companyWiseArticleData, refetch } = useQuery(GET_COMPANY_HAS_USER_HAS_ARTICLES);
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const [selectedArticleId, setSelectedArticleId] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedArticleDetails, setSelectedArticleDetails] = useState<{
    title: string;
    description: string;
  } | null>(null);
  const [articleImages, setArticleImages] = useState<Record<number, string>>({});
  const [filterVisible, setFilterVisible] = useState(false);
  const [filters, setFilters] = useState({
    name: '',
  });
  const { setPublishableKey } = useStripeKey();

  useEffect(() => {
    if (isFocused) {
      setLoading(true);
      Promise.all([refetchArticles(), refetch()]).finally(() => {
        setLoading(false);
      });
    } else {
      setLoading(false);
      setSelectedArticleId(null);
      setPaymentStatus(null);
      setErrorMessage(null);
      setPaymentLoading(false);
      setFilters({ name: '' });
      setFilterVisible(false);
    }
  }, [isFocused]);

  const filteredArticles = useMemo(() => {
    const upcomingArticles = data?.getArticles || [];

    const subscribedArticleIds = (companyWiseArticleData?.getCompanyHasUserHasArticles || []).map(
      (companyHasUserArticle: ICompanyHasUserHasProduct) => companyHasUserArticle.product_id
    );
    const subscribedSet = new Set(subscribedArticleIds);

    const onlyUpcoming = upcomingArticles.filter(
      (article: IProduct) =>
        !subscribedSet.has(article.id) && article.status === ARTICLE_STATUS.PLANNED
    );
    const myArticles = (companyWiseArticleData?.getCompanyHasUserHasArticles || [])
      .map((subArticle: ICompanyHasUserHasProduct) => {
        const matchedArticle = upcomingArticles.find(
          (article: IProduct) => article.id === subArticle.product_id
        );
        if (!matchedArticle) return null;

        return {
          ...matchedArticle,
          companyHasUserProduct: subArticle,
        };
      })
      .filter(Boolean);

    let filteredArticle = activeTab === ArticleTabStatus.NEW ? onlyUpcoming : myArticles;
    if (filters.name !== '') {
      filteredArticle = filteredArticle.filter((article: IProduct) =>
        article.title.toLowerCase().includes(filters.name.toLowerCase())
      );
    }
    return filteredArticle;
  }, [activeTab, data, companyWiseArticleData, filters]);

  const handleArticleParticipation = (articleId: number) => {
    Alert.alert(
      'Confirm',
      'Are you sure you want to subscribe for this article?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => {
            handleArticleParticipationPayment(articleId);
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleArticleParticipationPayment = async (articleId: number) => {
    setPaymentLoading(true);
    try {
      mutateFromFormData(
        {
          productId: articleId,
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
        setSelectedArticleId(null);
      });
    } catch (error) {
      console.error('Error creating Klarna payment intent:', error);
    }
  };

  const toggleArticleSelection = (articleId: number, companyPublishKey: string) => {
    setSelectedArticleId((prev) => (prev === articleId ? null : articleId));
    setPaymentLoading(false);
    setPublishableKey(companyPublishKey);
  };

  const handleKnowMore = (article: IProduct) => {
    setSelectedArticleDetails({
      title: article.title,
      description: article.description,
    });
    setModalVisible(true);
  };

  useEffect(() => {
    if (!isFocused || !data?.getArticles) return;
    const preloadImages = async () => {
      if (!data?.getArticles) return;
      const entries = await Promise.all(
        data.getArticles.map(async (article: IProduct) => {
          if (!article.file_id) return [article.id, null];
          try {
            const fileUrl = await fileApiInstance.getFile(article.file_id);
            return [article.id, fileUrl];
          } catch (err) {
            console.error('Failed to preload image:', err);
            return [article.id, null];
          }
        })
      );
      setArticleImages(Object.fromEntries(entries));
    };

    preloadImages();
  }, [data, isFocused]);

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
            style={[styles.tab, activeTab === ArticleTabStatus.NEW && styles.activeTab]}
            onPress={() => setActiveTab(ArticleTabStatus.NEW)}
          >
            <Text
              style={[styles.tabText, activeTab === ArticleTabStatus.NEW && styles.activeTabText]}
            >
              {t('objects.article.attributes.upcomingArticle')}
            </Text>
          </Pressable>
          <Pressable
            style={[styles.tab, activeTab === ArticleTabStatus.MY_ARTICLES && styles.activeTab]}
            onPress={() => setActiveTab(ArticleTabStatus.MY_ARTICLES)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === ArticleTabStatus.MY_ARTICLES && styles.activeTabText,
              ]}
            >
              {t('objects.article.attributes.myArticles')}
            </Text>
          </Pressable>
        </View>

        <FlatList
          key={activeTab}
          data={filteredArticles}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ArticleCard
              article={item}
              activeTab={activeTab}
              paymentLoading={paymentLoading}
              handleArticleParticipation={handleArticleParticipation}
              toggleSelection={toggleArticleSelection}
              selectedArticleId={selectedArticleId}
              handleKnowMore={handleKnowMore}
              imageUrl={articleImages[item.id]}
            />
          )}
          ListEmptyComponent={EmptyComponent(
            activeTab === ArticleTabStatus.NEW
              ? t('objects.article.messages.noUpcomingArticles')
              : t('objects.article.messages.noMyArticles')
          )}
        />
        {activeTab === ArticleTabStatus.NEW && selectedArticleId !== null && (
          <View style={styles.stickyButtonContainer}>
            <AppButton
              text={t('components.button.name.subscribeAndPay')}
              onPress={() => {
                handleArticleParticipation(selectedArticleId);
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
              <Text style={styles.modalTitle}>{selectedArticleDetails?.title}</Text>
              <Text style={styles.modalDescription}>{selectedArticleDetails?.description}</Text>
              <AppButton
                text={t('components.button.name.close')}
                onPress={() => setModalVisible(false)}
                style={{ marginTop: 20 }}
              />
            </View>
          </View>
        </Modal>
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

export default Articles;
