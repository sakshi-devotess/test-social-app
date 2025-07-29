export interface IStripeSubscriptionPaymentHistory {
  id: number;
  stripe_payment_id: string;
  invoice_id: string;
  amount: string;
  status: number;
  description: string;
  invoice_data: string;
  created: string;
}

export interface ICompanyHasUserHasSubscription {
  id: number;
  company_has_user_id: number;
  active: boolean;
  stripe_payment_id: string;
  stripe_payment_data: string;
  created: string;
  created_by_company_has_user_id: number;
  stripe_subscription_payment_histories?: IStripeSubscriptionPaymentHistory[];
}

export interface IPlanPrice {
  priceId: string;
  unitAmount: number;
  currency: string;
  interval: string;
  interval_count: number;
}

export interface IPlan {
  productId: string;
  productName: string;
  description?: string;
  prices: IPlanPrice[];
}
