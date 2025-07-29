import { useLazyQuery } from '@apollo/client';
import { useIsFocused } from '@react-navigation/native';
import { useContext, useEffect, useMemo, useState } from 'react';
import { GET_COMPANY_HAS_USER_WISE_SUBSCRIPTIONS_WITH_PAYMENT_HISTORY } from '../../graphql/queries/CompanyHasUserHasSubscription/companyHasUserHasSubscription.query';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { formatPrice } from '../../library/utilities/helperFunction';
import Loader from '../../components/Loader';
import PaymentResultModal from '../../components/PaymentResult/PaymentResultModal';
import { AuthenticatedUserContext } from '../../contexts/AuthenticatedUserContext';
import { colors } from '../../config/constants';
import { GET_All_STRIPE_PLANS } from '../../graphql/queries/Stripe/stripe.query';
import { ICompanyHasUserHasSubscription, IPlan, IPlanPrice } from './MyPlan.model';
import EmptyComponent from '../../components/EmptyComponent';

const MyPlans = ({ navigation }) => {
  const { user } = useContext(AuthenticatedUserContext);
  const isFocused = useIsFocused();
  const [getAllPlans, { data: stripePlansData }] = useLazyQuery(GET_All_STRIPE_PLANS);
  const [getActiveSub, { data: activeSubData }] = useLazyQuery(
    GET_COMPANY_HAS_USER_WISE_SUBSCRIPTIONS_WITH_PAYMENT_HISTORY
  );
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  useEffect(() => {
    if (isFocused && user?.companyHasUserId) {
      getAllPlans();
      getActiveSub({
        variables: {
          companyHasUserId: user?.companyHasUserId,
        },
      });
    }
  }, [user?.companyHasUserId, isFocused]);

  const activePriceIds = useMemo(() => {
    if (!activeSubData?.getCompanyHasUserWiseSubscription) return [];

    return activeSubData.getCompanyHasUserWiseSubscription
      .flatMap((companyHasUserHasSubscription: ICompanyHasUserHasSubscription) => {
        try {
          const parsed = JSON.parse(companyHasUserHasSubscription?.stripe_payment_data);
          return parsed?.items?.data?.map((item) => item?.plan?.id);
        } catch {
          return [];
        }
      })
      .filter(Boolean);
  }, [activeSubData]);

  const filteredPlans = useMemo(() => {
    if (!stripePlansData?.getAllPlans || !activeSubData?.getCompanyHasUserWiseSubscription)
      return [];

    const enrichedPlans = stripePlansData.getAllPlans.map((plan: IPlan) => {
      const matchingPrice = plan.prices?.find((price: IPlanPrice) =>
        activePriceIds.includes(price.priceId)
      );

      if (!matchingPrice) return null;

      const matchingSub = activeSubData.getCompanyHasUserWiseSubscription.find(
        (companyHasUserHasSubscription: ICompanyHasUserHasSubscription) => {
          try {
            const parsed = JSON.parse(companyHasUserHasSubscription?.stripe_payment_data);
            return parsed?.items?.data?.some((item) => item?.plan?.id === matchingPrice.priceId);
          } catch {
            return false;
          }
        }
      );

      return {
        ...plan,
        stripe_subscription_payment_histories:
          matchingSub?.stripe_subscription_payment_histories || [],
      };
    });

    setLoading(false);
    return enrichedPlans.filter(Boolean);
  }, [stripePlansData, activeSubData, activePriceIds]);

  const renderPrice = (price: IPlanPrice) => {
    const intervalText =
      price?.interval_count > 1
        ? ` / ${price.interval_count} ${price.interval}${price.interval_count > 1 ? 's' : ''}`
        : ` / ${price.interval}`;

    return (
      <View key={price.priceId} style={styles.priceBlock}>
        <Text style={styles.planPrice}>
          {formatPrice(price.unitAmount, price.currency)}
          {intervalText}
        </Text>
      </View>
    );
  };

  const renderItem = ({ item }: { item: IPlan }) => (
    <View style={styles.cardContainer}>
      <View style={styles.headerRow}>
        <Text style={styles.planTitle}>{item?.productName}</Text>
        {item?.prices?.map(renderPrice)}
      </View>

      <Text style={styles.planDescription}>{item?.description}</Text>

      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.navigate('PaymentHistory', { planData: item })}
        >
          <Text style={styles.iconButtonText}>View</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => console.log('Manage subscription')}
        >
          <Text style={styles.iconButtonText}>Manage</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.iconButton]}
          onPress={() => console.log('Cancel subscription')}
        >
          <Text style={[styles.iconButtonText]}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Loader loading={loading}>
        <FlatList
          data={filteredPlans || []}
          keyExtractor={(item) => item.productId}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={EmptyComponent('No plans available')}
        />

        <PaymentResultModal
          visible={paymentStatus !== null}
          success={paymentStatus === 'success'}
          onClose={() => setPaymentStatus(null)}
        />
      </Loader>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flex: 1,
  },
  planCard: {
    padding: 20,
    marginBottom: 16,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: colors.border,
  },

  button: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  loadingContainer: {
    alignItems: 'center',
    color: colors.teal,
    flex: 1,
    justifyContent: 'center',
  },
  activePlan: {
    backgroundColor: '#E6F4EA',
    paddingVertical: 10,
    borderRadius: 30,
    alignItems: 'center',
    borderColor: '#34A853',
    borderWidth: 1,
    marginTop: 5,
  },
  activeText: {
    color: '#34A853',
    fontWeight: '600',
  },
  intervalTag: {
    backgroundColor: '#e1f5fe',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  intervalText: {
    color: '#039be5',
    fontWeight: '600',
    fontSize: 12,
  },

  priceBlock: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    marginTop: 10,
  },
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#eee',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  planTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  planDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  planPrice: {
    fontSize: 14,
    color: '#007aff',
    fontWeight: '600',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    flexWrap: 'wrap',
  },
  iconText: {
    fontSize: 14,
    fontWeight: '500',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  iconButton: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 10,
    backgroundColor: '#f1f5f9',
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  cancelButton: {
    backgroundColor: '#fff0f0',
    borderColor: '#eb7875',
  },
  iconButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default MyPlans;
