import { ICompany, ICompanyHasUser } from '../Auth/Signup/Signup.model';
import { EventTabStatus } from '../../config/constants';

type IEventTabStatus = typeof EventTabStatus.UPCOMING | typeof EventTabStatus.MYEVENT;
export interface IEventCardProps {
  event: IProduct;
  activeTab: IEventTabStatus;
  paymentLoading?: boolean;
  toggleSelection: (eventId: number, companyPublishKey: string) => void;
  selectedEventId: number | null;
  handleKnowMore?: (event: IProduct) => void;
  imageUrl: string;
  modalVisible?: boolean;
  onViewInvoice: (event: IProduct) => void;
  isExpanded?: boolean;
  onToggleExpand?: (id: number) => void;
}

export interface ICompanyHasUserHasEvent {
  id: number;
  event_id: number;
  company_has_user_id: number;
  status: number;
  created: string;
  created_by_company_has_user_id: number;
  created_by_company_has_user: ICompanyHasUser;
  company_has_user: ICompanyHasUser;
}

export interface ICompanyHasUserHasProduct {
  id: number;
  product_id: number;
  company_has_user_id: number;
  status: number;
  created: string;
  created_by_company_has_user_id: number;
  created_by_company_has_user: ICompanyHasUser;
  company_has_user: ICompanyHasUser;
  payment_intent_id: string;
  payment_intent_data: string;
  product?: IProduct;
}

export interface IProductSlot {
  id: number | null;
  product_id: number;
  title: string;
  start_date_time: string;
  end_date_time: string;
  created_by_company_has_user_id: number;
  created: string;
  product_slots?: IProductSlot[];
  created_by_company_has_user: ICompanyHasUser;
}

export interface IProduct {
  id: number;
  company_id: number;
  title: string;
  description: string;
  price: string;
  start_time: string;
  end_time: string;
  status: number;
  product_image: string | null;
  type: number;
  file_id?: number;
  created_by_company_has_user: ICompanyHasUser;
  created: string;
  organizer_company_has_user_id: number;
  company_has_user_has_products: ICompanyHasUserHasProduct[];
  organizer_company_has_user: ICompanyHasUser;
  companyHasUserProduct: ICompanyHasUserHasProduct;
  product_slots: IProductSlot[];
  company: ICompany;
}
