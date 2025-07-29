import { ICompany, ICompanyHasUser } from '../Auth/Signup/Signup.model';
import { ArticleTabStatus } from '../../config/constants';

type IArticleTabStatus = typeof ArticleTabStatus.NEW | typeof ArticleTabStatus.MY_ARTICLES;
export interface IArticleCardProps {
  article: IProduct;
  activeTab: IArticleTabStatus;
  handleArticleParticipation: (articleId: number) => void;
  paymentLoading?: boolean;
  toggleSelection: (articleId: number, companyPublishKey: string) => void;
  selectedArticleId: number | null;
  handleKnowMore?: (article: IProduct) => void;
  imageUrl: string | null;
}

export interface ICompanyHasUserHasArticle {
  id: number;
  article_id: number;
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
  payment_intent_data: object;
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
  company: ICompany;
}
