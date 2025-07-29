import React, { useLayoutEffect } from 'react';
import { getFocusedRouteNameFromRoute, useNavigation, useRoute } from '@react-navigation/native';
import TabNavigator from './TabNavigator';
import { useCapitalizedTranslation } from '../hooks/useCapitalizedTranslation';

const routeTitleMap: Record<string, string> = {
  Dashboard: 'menu.appMenu.home',
  Plans: 'menu.appMenu.plans',
  Chats: 'menu.appMenu.chat',
  Settings: 'menu.appMenu.settings',
};

const TabsWithDynamicHeader = () => {
  const { t, i18n } = useCapitalizedTranslation();
  const navigation = useNavigation();
  const route = useRoute();

  useLayoutEffect(() => {
    const routeName = getFocusedRouteNameFromRoute(route) ?? 'Dashboard';
    const title = routeTitleMap[routeName] || 'App';
    navigation.setOptions({ title: t(title) });
  }, [route, i18n.language]);

  return <TabNavigator />;
};

export default TabsWithDynamicHeader;
