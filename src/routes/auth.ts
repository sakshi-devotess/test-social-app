import ForgotPassword from '../screens/Auth/ForgotPassword/ForgotPassword';
import Login from '../screens/Auth/Login/Login';
import ResetPassword from '../screens/Auth/ResetPassword/ResetPassword';
import SignUp from '../screens/Auth/Signup/SignUp';

export const AUTH_ROUTE = {
  LOGIN: 'Login',
  SIGNUP: 'SignUp',
  FORGOT_PASSWORD: 'ForgotPassword',
  RESET_PASSWORD: 'ResetPassword',
};

export const AUTH_ROUTES = [
  {
    name: AUTH_ROUTE.LOGIN,
    component: Login,
  },
  {
    name: AUTH_ROUTE.SIGNUP,
    component: SignUp,
  },
  {
    name: AUTH_ROUTE.FORGOT_PASSWORD,
    component: ForgotPassword,
  },
  {
    name: AUTH_ROUTE.RESET_PASSWORD,
    component: ResetPassword,
  },
];
