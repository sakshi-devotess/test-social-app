import { StackNavigationProp } from '@react-navigation/stack';

export interface ISignInForm {
  username: string;
  password: string;
}

export interface ISignInProps {
  navigation: StackNavigationProp<any>;
}
