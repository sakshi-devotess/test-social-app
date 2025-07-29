import DrawerNavigator from '../navigation/DrawerNavigator';
import About from '../screens/About';
import Account from '../screens/Account';
import ChangePassword from '../screens/Auth/ChangePassword/ChangePassword';
import Chat from '../screens/Chat';
import Group from '../screens/Group';
import Help from '../screens/Help';
import Invoice from '../screens/MyPlans/Invoice';
import MyPlans from '../screens/MyPlans/MyPlans';
import PaymentHistory from '../screens/MyPlans/PaymentHistory';
import PrivacyPolicy from '../screens/PrivacyPolicy';
import Profile from '../screens/Profile';
import ReceiptWebView from '../screens/ReceiptWebView';
import Success from '../screens/Success';
import Users from '../screens/Users';

export const STACK_ROUTES = {
  MAIN: 'Main',
  CHAT: 'Chat',
  USERS: 'Users',
  PROFILE: 'Profile',
  HELP: 'Help',
  ABOUT: 'About',
  ACCOUNT: 'Account',
  SUCCESS: 'Success',
  MY_PLANS: 'MyPlans',
  PAYMENT_HISTORY: 'PaymentHistory',
  INVOICE: 'Invoice',
  GROUP: 'Group',
  RECEIPT_WEBVIEW: 'ReceiptWebView',
  CHANGE_PASSWORD: 'ChangePassword',
  PRIVACY_POLICY: 'PrivacyPolicy',
};

export interface DrawerRouteConfig {
  name: string;
  component: React.ComponentType<any>;
  title?: string;
  customOptions?: () => {
    headerShown?: boolean;
  };
}

export const STACK_NAVIGATION_ROUTES: DrawerRouteConfig[] = [
  {
    name: STACK_ROUTES.MAIN,
    component: DrawerNavigator,
    customOptions: () => ({
      headerShown: false,
    }),
  },
  {
    name: STACK_ROUTES.CHAT,
    component: Chat,
  },
  {
    name: STACK_ROUTES.USERS,
    component: Users,
    title: 'menu.appMenu.user',
  },
  {
    name: STACK_ROUTES.PROFILE,
    component: Profile,
    title: 'menu.appMenu.profile',
  },
  {
    name: STACK_ROUTES.HELP,
    component: Help,
    title: 'menu.appMenu.help',
  },
  {
    name: STACK_ROUTES.ABOUT,
    component: About,
    title: 'menu.appMenu.about',
  },
  {
    name: STACK_ROUTES.ACCOUNT,
    component: Account,
    title: 'menu.appMenu.account',
  },
  {
    name: STACK_ROUTES.SUCCESS,
    component: Success,
  },
  {
    name: STACK_ROUTES.MY_PLANS,
    component: MyPlans,
    title: 'menu.appMenu.myPlans',
  },
  {
    name: STACK_ROUTES.PAYMENT_HISTORY,
    component: PaymentHistory,
    title: 'menu.appMenu.paymentHistory',
  },
  {
    name: STACK_ROUTES.INVOICE,
    component: Invoice,
    title: 'menu.appMenu.invoices',
  },
  {
    name: STACK_ROUTES.GROUP,
    component: Group,
    title: 'menu.appMenu.newGroup',
  },
  {
    name: STACK_ROUTES.RECEIPT_WEBVIEW,
    component: ReceiptWebView,
    title: 'objects.event.attributes.receipt',
  },
  {
    name: STACK_ROUTES.CHANGE_PASSWORD,
    component: ChangePassword,
    title: 'menu.appMenu.changePassword',
  },
  {
    name: STACK_ROUTES.PRIVACY_POLICY,
    component: PrivacyPolicy,
    title: 'menu.appMenu.privacyPolicy',
  },
];
