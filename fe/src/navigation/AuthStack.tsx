/**
 * navigation/AuthStack.tsx
 * Unauthenticated stack: Login | Register | ForgotPassword screens.
 */
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen } from '@/screens/Login/LoginScreen';
import { RegisterScreen } from '@/screens/Register/RegisterScreen';
import { ForgotPasswordScreen } from '@/screens/ForgotPassword/ForgotPasswordScreen';
import type { AuthStackParamList } from '@/types/navigation';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
}
