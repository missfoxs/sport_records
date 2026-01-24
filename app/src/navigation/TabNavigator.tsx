import React from 'react';
import {Text} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import StatisticsScreen from '../screens/StatisticsScreen';

export type TabParamList = {
  Home: undefined;
  Statistics: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#00ff88',
        tabBarInactiveTintColor: '#888888',
        tabBarStyle: {
          backgroundColor: '#1a1a1a',
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: '首页',
          tabBarIcon: ({color, size}) => (
            <TabIcon name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Statistics"
        component={StatisticsScreen}
        options={{
          tabBarLabel: '统计',
          tabBarIcon: ({color, size}) => (
            <TabIcon name="stats" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// 简单的图标组件（后续可以替换为 react-native-vector-icons）
function TabIcon({
  name,
  color,
  size,
}: {
  name: string;
  color: string;
  size: number;
}) {
  const iconMap: Record<string, string> = {
    home: '🏠',
    stats: '📊',
  };

  return (
    <Text style={{fontSize: size, color}}>{iconMap[name] || '•'}</Text>
  );
}

export default TabNavigator;
