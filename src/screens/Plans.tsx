import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { AuthenticatedUserContext } from '../contexts/AuthenticatedUserContext';
import { colors } from '../config/constants';
import { GET_All_STRIPE_PLANS } from '../graphql/queries/Stripe/stripe.query';
import { useLazyQuery } from '@apollo/client';
import { mutateFromFormData, MUTATION_TYPE_CREATE } from '../graphql/mutation.service';
import { useStripe } from '@stripe/stripe-react-native';
import { GET_COMPANY_HAS_USERS_WISE_SUBSCRIPTIONS } from '../graphql/queries/CompanyHasUserHasSubscription/companyHasUserHasSubscription.query';
import PaymentResultModal from '../components/PaymentResult/PaymentResultModal';
import Loader from '../components/Loader';
import AppButton from '../components/Button';
import { useIsFocused } from '@react-navigation/native';
import { formatPrice } from '../library/utilities/helperFunction';
import EmptyComponent from '../components/EmptyComponent';
import { useStripeKey } from '../contexts/StripeContext';
import { MessageContext } from '../contexts/MessageContext';
import { useCapitalizedTranslation } from '../hooks/useCapitalizedTranslation';

const Plans = () => {
  const { user } = useContext(AuthenticatedUserContext);
  const { t } = useCapitalizedTranslation();
  const { pushMessageFromMutationResponse } = useContext(MessageContext);
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const isFocused = useIsFocused();
  const [getAllPlans, { data: stripePlansData }] = useLazyQuery(GET_All_STRIPE_PLANS);
  const [getActiveSub, { data: activeSubData, refetch }] = useLazyQuery(
    GET_COMPANY_HAS_USERS_WISE_SUBSCRIPTIONS
  );
  const [loading, setLoading] = useState(true);
  const [activePriceIdsByCompany, setActivePriceIdsByCompany] = useState<string[]>([]);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const { setPublishableKey } = useStripeKey();

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

  useEffect(() => {
    if (activeSubData?.getCompanyHasUsersWiseSubscription) {
      const groupedByCompany: Record<number, string[]> = {};

      activeSubData.getCompanyHasUsersWiseSubscription.forEach((subscription) => {
        const parsed = JSON.parse(subscription?.stripe_payment_data || '{}');
        const priceIds = parsed?.items?.data?.map((item) => item?.plan?.id).filter(Boolean);
        const companyId = subscription?.company_has_user?.company?.id;
        if (companyId && priceIds?.length) {
          if (!groupedByCompany[companyId]) {
            groupedByCompany[companyId] = [];
          }
          groupedByCompany[companyId].push(...priceIds);
        }
      });

      setActivePriceIdsByCompany(groupedByCompany);
    }
  }, [activeSubData]);

  useEffect(() => {
    if (stripePlansData) {
      setLoading(false);
    }
  }, [stripePlansData]);
  const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
  const handleSubscribe = async (priceId: string, companyId: number, publishableKey: string) => {
    if (publishableKey) {
      setPublishableKey(publishableKey);
      await wait(500);
    }
    try {
      const res = await mutateFromFormData(
        {
          priceId: priceId,
          companyId: companyId,
        },
        'SubscriptionSession',
        MUTATION_TYPE_CREATE,
        ['clientSecret']
      );

      if (res?.response?.clientSecret) {
        const clientSecret = res?.response?.clientSecret;
        const { error: initError } = await initPaymentSheet({
          paymentIntentClientSecret: clientSecret,
          merchantDisplayName: 'MyApp',
        });
        if (initError) throw new Error(initError.message);

        const { error: paymentError } = await presentPaymentSheet();
        if (paymentError) {
          setPaymentStatus('error');
        } else {
          setPaymentStatus('success');
          refetch();
        }
      } else {
        pushMessageFromMutationResponse(res.response);
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw error;
    }
  };

  const renderPrice = (price, companyId, stripePublishKey) => {
    const isActive = activePriceIdsByCompany[companyId]?.includes(price.priceId);
    const intervalText =
      price?.interval_count > 1
        ? ` / ${price.interval_count} ${price.interval}${price.interval_count > 1 ? 's' : ''}`
        : ` / ${price.interval}`;

    return (
      <View key={price.priceId}>
        {isActive ? (
          <View style={styles.activePlan}>
            <Text style={styles.activeText}>✅ Current Plan</Text>
          </View>
        ) : (
          <AppButton
            text={`${formatPrice(price.unitAmount, price.currency)}${intervalText}`}
            onPress={() => handleSubscribe(price.priceId, companyId, stripePublishKey)}
            textStyle={styles.buttonText}
          />
        )}
      </View>
    );
  };

  const renderCompanyPlan = ({ item }) => {
    let { companyId, stripePublishKey, plans, companyName } = item;
    if (!plans || plans.length === 0 || !stripePublishKey) return null;
    return (
      <View key={companyId}>
        <Text style={styles.companyHeader}>
          {t('objects.company.headingLabels.singular')}: {companyName}
        </Text>

        {plans?.map((plan) => (
          <View key={plan.productId} style={styles.planCard}>
            <Text style={styles.planTitle}>{plan.productName}</Text>
            <Text style={styles.planDescription}>{plan.description}</Text>
            {plan.prices.map((price) => renderPrice(price, companyId, stripePublishKey))}
          </View>
        ))}
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <Loader loading={loading}>
        <FlatList
          data={stripePlansData?.getAllPlans || []}
          keyExtractor={(item) => item.companyId.toString()}
          renderItem={renderCompanyPlan}
          contentContainerStyle={styles.contentContainer}
          ListEmptyComponent={EmptyComponent('No plans available.')}
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
  planTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  planPrice: {
    fontSize: 16,
    color: colors.primary,
    marginBottom: 10,
  },
  planDescription: {
    fontSize: 14,
    marginBottom: 15,
    color: '#444',
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
    backgroundColor: '#E6F4EA', // light green
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
  companyHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  contentContainer: {
    paddingBottom: 20,
  },
});

export default Plans;
