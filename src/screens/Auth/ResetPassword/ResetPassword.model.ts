import { StackNavigationProp } from '@react-navigation/stack';

export interface IResetPasswordProps {
  navigation: StackNavigationProp<any>;
}

export interface IResetPasswordForm {
  password: string;
  confirmPassword: string;
}
