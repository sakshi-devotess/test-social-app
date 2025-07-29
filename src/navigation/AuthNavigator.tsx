import { createStackNavigator } from '@react-navigation/stack';
import { AUTH_ROUTES } from '../routes/auth';

const AuthStack = createStackNavigator();

const AuthNavigator = () => {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      {AUTH_ROUTES.map((item) => (
        <AuthStack.Screen key={item.name} {...item} />
      ))}
    </AuthStack.Navigator>
  );
};

export default AuthNavigator;
