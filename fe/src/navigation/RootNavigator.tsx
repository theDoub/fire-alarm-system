/**
 * navigation/RootNavigator.tsx
 * Top-level navigator: switches between AuthStack and AppStack
 * based on AuthContext.isAuthenticated.
 * Also renders the Level 3 danger modal overlay globally.
 */
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '@/contexts/AuthContext';
import { useAlertContext } from '@/contexts/AlertContext';
import { AuthStack } from './AuthStack';
import { AppStack } from './AppStack';
import type { RootStackParamList } from '@/types/navigation';

// Screens
import { AlertInfoScreen } from '@/screens/AlertInfo/AlertInfoScreen';

const Root = createStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const { isAuthenticated, isLoading } = useAuth();
  const { incomingDangerAlert } = useAlertContext();

  if (isLoading) return null; // splash / loading gate

  return (
    <NavigationContainer>
      {isAuthenticated ? (
        <Root.Navigator screenOptions={{ headerShown: false }}>
          <Root.Screen name="MainTabs" component={AppStack} />
          {/* Full-screen danger modal — presented on top of all tabs */}
          <Root.Screen
            name="AlertInfo"
            component={AlertInfoScreen}
            options={{ presentation: 'modal', headerShown: false }}
          />
          <Root.Screen name="DeviceInfo" component={require('@/screens/DeviceInfo/DeviceInfoScreen').DeviceInfoScreen} />
          <Root.Screen name="AlertHistoryDetail" component={require('@/screens/AlertHistory/AlertHistoryDetailScreen').AlertHistoryDetailScreen} />
        </Root.Navigator>
      ) : (
        <AuthStack />
      )}
    </NavigationContainer>
  );
}
