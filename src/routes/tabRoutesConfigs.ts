import { ComponentProps } from 'react';
import Chats from '../screens/Chats';
import Dashboard from '../screens/Dashboard';
import Plans from '../screens/Plans';
import Settings from '../screens/Settings';
import { Ionicons } from '@expo/vector-icons';

export const TAB_ROUTE = {
  DASHBOARD: 'Dashboard',
  PLANS: 'Plans',
  CHATS: 'Chats',
  SETTINGS: 'Settings',
};
type IoniconName = ComponentProps<typeof Ionicons>['name'];

export interface TabRouteConfig {
  name: (typeof TAB_ROUTE)[keyof typeof TAB_ROUTE];
  component: React.ComponentType<any>;
  label: string;
  icon: IoniconName;
  focusedIcon?: IoniconName;
}

export const TAB_ROUTES: TabRouteConfig[] = [
  {
    name: TAB_ROUTE.DASHBOARD,
    component: Dashboard,
    label: 'menu.appMenu.home',
    icon: 'home',
    focusedIcon: 'home-outline',
  },
  {
    name: TAB_ROUTE.PLANS,
    component: Plans,
    label: 'menu.appMenu.plans',
    icon: 'card',
    focusedIcon: 'card-outline',
  },
  {
    name: TAB_ROUTE.CHATS,
    component: Chats,
    label: 'menu.appMenu.chat',
    icon: 'chatbubbles',
    focusedIcon: 'chatbubbles-outline',
  },
  {
    name: TAB_ROUTE.SETTINGS,
    component: Settings,
    label: 'menu.appMenu.settings',
    icon: 'settings',
    focusedIcon: 'settings-outline',
  },
];
