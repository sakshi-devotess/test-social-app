import { StackNavigationProp } from '@react-navigation/stack';

export interface ISignUpForm {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  company_id: number | null;
  confirmPassword: string;
}

export interface ISignUpProps {
  navigation: StackNavigationProp<any>;
}

export interface ICompany {
  id: number;
  name: string;
  organization_number: string;
  active: boolean;
  created_by_company_has_user_id: number;
  our_reference_company_has_user_id: number;
  company_type_id: number;
  created: string;
  logo_file_id: number;
  stripe_publish_key: string;
  created_by_company_has_user: ICompanyHasUser;
}

export interface IUser {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  password?: string;
  phone: string;
  mobilephone: string;
  active: boolean;
  note: string;
  __typename?: string;
  created_by_company_has_user_id?: number;
  company_has_users?: ICompanyHasUser[];
}

export interface ICompanyHasUser {
  id: number;
  created_by_company_has_user_id: number;
  company_id: number;
  user_id: number;
  email: string;
  phone: string;
  mobilephone: string;
  active: boolean;
  relation_type: string;
  created: string;
  user: IUser;
  company: ICompany;
  company_sub_organization_id?: number;
  role_id?: number;
}
