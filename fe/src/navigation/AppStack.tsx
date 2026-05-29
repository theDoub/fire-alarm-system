/**
 * navigation/AppStack.tsx
 * Authenticated bottom-tab navigator.
 * Tabs: Home | Devices | Alerts | Profile
 */
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from '@/screens/Home/HomeScreen';
import { DevicesScreen } from '@/screens/Devices/DevicesScreen';
import { AlertsScreen } from '@/screens/Alerts/AlertsScreen';
import { ProfileScreen } from '@/screens/Profile/ProfileScreen';
import type { MainTabParamList } from '@/types/navigation';

const Tab = createBottomTabNavigator<MainTabParamList>();

export function AppStack() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: '#1a1a2e', borderTopColor: '#16213e' },
        tabBarActiveTintColor: '#e94560',
        tabBarInactiveTintColor: '#555577',
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Devices" component={DevicesScreen} />
      <Tab.Screen name="Alerts" component={AlertsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
