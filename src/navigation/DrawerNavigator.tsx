import { Ionicons } from '@expo/vector-icons';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useCapitalizedTranslation } from '../hooks/useCapitalizedTranslation';
import { DRAWER_ROUTES } from '../routes/drawerRoutesConfig';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  const { t } = useCapitalizedTranslation();
  return (
    <Drawer.Navigator>
      {DRAWER_ROUTES.map(({ name, component: Component, label, icon, focusedIcon }) => (
        <Drawer.Screen
          key={name}
          name={name}
          options={{
            title: t(label),
            drawerIcon: ({ color, size, focused }) => (
              <Ionicons name={focused ? focusedIcon : icon} size={size} color={color} />
            ),
          }}
        >
          {(props) => <Component {...props} />}
        </Drawer.Screen>
      ))}
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
