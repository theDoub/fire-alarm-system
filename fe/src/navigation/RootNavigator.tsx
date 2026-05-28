/**
 * navigation/RootNavigator.tsx
 * Top-level navigator: switches between AuthStack and AppStack
 * based on AuthContext.isAuthenticated.
 * Also renders the Level 3 danger modal overlay globally.
 */
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '@/contexts/AuthContext';
import { AuthStack } from './AuthStack';
import { AppStack } from './AppStack';
import { AlertInfoScreen } from '@/screens/AlertInfo/AlertInfoScreen';
import { DeviceInfoScreen } from '@/screens/DeviceInfo/DeviceInfoScreen';
import { AlertHistoryDetailScreen } from '@/screens/AlertHistory/AlertHistoryDetailScreen';
import type { RootStackParamList } from '@/types/navigation';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

const Root = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <LoadingSpinner />;

  return (
    <NavigationContainer>
      {isAuthenticated ? (
        <Root.Navigator screenOptions={{ headerShown: false }}>
          <Root.Screen name="MainTabs" component={AppStack} />
          <Root.Screen
            name="AlertInfo"
            component={AlertInfoScreen}
            options={{ presentation: 'modal', headerShown: false }}
          />
          <Root.Screen name="DeviceInfo" component={DeviceInfoScreen} />
          <Root.Screen name="AlertHistoryDetail" component={AlertHistoryDetailScreen} />
        </Root.Navigator>
      ) : (
        <AuthStack />
      )}
    </NavigationContainer>
  );
}
