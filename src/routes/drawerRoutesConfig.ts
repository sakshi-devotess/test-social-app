import type { ComponentProps } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { AnimalList } from '../screens/Animal';
import Events from '../screens/Event/Events';
import Articles from '../screens/Articles/Articles';
import TabsWithDynamicHeader from '../navigation/TabsWithDynamicHeader';

export const DRAWER_ROUTE = {
  TABS: 'Tabs',
  ANIMAL: 'AnimalList',
  EVENTS: 'Events',
  SETTINGS: 'Settings',
  ARTICLES: 'Articles',
};

type IoniconName = ComponentProps<typeof Ionicons>['name'];

export interface DrawerRouteConfig {
  name: string;
  component: React.ComponentType<any>;
  label: string;
  icon: IoniconName;
  focusedIcon?: IoniconName;
}

export const DRAWER_ROUTES: DrawerRouteConfig[] = [
  {
    name: DRAWER_ROUTE.TABS,
    component: TabsWithDynamicHeader,
    label: 'menu.appMenu.home',
    icon: 'home',
    focusedIcon: 'home-outline',
  },
  {
    name: DRAWER_ROUTE.ANIMAL,
    component: AnimalList,
    label: 'menu.appMenu.dog',
    icon: 'paw-outline',
    focusedIcon: 'paw',
  },
  {
    name: DRAWER_ROUTE.EVENTS,
    component: Events,
    label: 'menu.appMenu.events',
    icon: 'calendar',
  },
  {
    name: DRAWER_ROUTE.ARTICLES,
    component: Articles,
    label: 'menu.appMenu.articles',
    icon: 'newspaper',
  },
];
