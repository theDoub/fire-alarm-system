import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Bell, Clock, Home, User, Wifi } from 'lucide-react-native';
import { AlertsScreen } from '@/screens/Alerts/AlertsScreen';
import { AlertHistoryScreen } from '@/screens/AlertHistory/AlertHistoryScreen';
import { DevicesScreen } from '@/screens/Devices/DevicesScreen';
import { HomeScreen } from '@/screens/Home/HomeScreen';
import { ProfileScreen } from '@/screens/Profile/ProfileScreen';
import { colors } from '@/theme/colors';
import type { MainTabParamList } from '@/types/navigation';

const Tab = createBottomTabNavigator<MainTabParamList>();

export function AppStack() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.danger,
        tabBarInactiveTintColor: '#94a3b8',
        tabBarLabelStyle: { fontSize: 11, fontWeight: '700', paddingBottom: 3 },
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: 72,
          paddingTop: 8,
        },
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'Home') return <Home size={size} color={color} />;
          if (route.name === 'Alerts') return <Bell size={size} color={color} />;
          if (route.name === 'Devices') return <Wifi size={size} color={color} />;
          if (route.name === 'History') return <Clock size={size} color={color} />;
          return <User size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Alerts" component={AlertsScreen} />
      <Tab.Screen name="Devices" component={DevicesScreen} />
      <Tab.Screen name="History" component={AlertHistoryScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

