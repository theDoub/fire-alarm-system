/**
 * navigation/AppStack.tsx
 * Authenticated bottom-tab navigator with high-fidelity Feather icons.
 * Tabs: Home | Devices | Alerts | Profile
 */
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from '@/screens/Home/HomeScreen';
import { DevicesScreen } from '@/screens/Devices/DevicesScreen';
import { AlertsScreen } from '@/screens/Alerts/AlertsScreen';
import { ProfileScreen } from '@/screens/Profile/ProfileScreen';
import type { MainTabParamList } from '@/types/navigation';
import { Feather } from '@expo/vector-icons';

const Tab = createBottomTabNavigator<MainTabParamList>();

export function AppStack() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { 
          backgroundColor: '#16162a', 
          borderTopColor: '#242445',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: '#e94560',
        tabBarInactiveTintColor: '#555577',
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Feather.glyphMap = 'home';
          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'Devices') iconName = 'cpu';
          else if (route.name === 'Alerts') iconName = 'bell';
          else if (route.name === 'Profile') iconName = 'user';
          
          return <Feather name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Devices" component={DevicesScreen} />
      <Tab.Screen name="Alerts" component={AlertsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
