import { StackNavigationProp } from '@react-navigation/stack';

export interface IChangePasswordForm {
  currentPassword: string;
  password: string;
  confirmPassword: string;
}

export interface IChangePasswordProps {
  navigation: StackNavigationProp<any>;
}
