import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useContext } from 'react';
import { UnreadMessagesContext } from '../contexts/UnreadMessagesContext';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../config/constants';
import { useCapitalizedTranslation } from '../hooks/useCapitalizedTranslation';
import { TAB_ROUTES } from '../routes/tabRoutesConfigs';

const Tab = createBottomTabNavigator();
const TabNavigator = () => {
  const { t } = useCapitalizedTranslation();
  const { unreadCount, setUnreadCount } = useContext(UnreadMessagesContext);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
        presentation: 'modal',
      })}
    >
      {TAB_ROUTES.map(({ name, component: Component, label, icon, focusedIcon }) => (
        <Tab.Screen
          key={name}
          name={name}
          options={{
            tabBarLabel: t(label),
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons name={focused ? focusedIcon : icon} size={size} color={color} />
            ),
          }}
        >
          {(props) => <Component {...props} />}
        </Tab.Screen>
      ))}
    </Tab.Navigator>
  );
};
export default TabNavigator;
