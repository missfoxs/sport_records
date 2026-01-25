import React from 'react';
import {Text, StyleSheet} from 'react-native';
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
        tabBarActiveTintColor: '#667eea',
        tabBarInactiveTintColor: '#adb5bd',
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
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

// 简单的图标组件（使用 emoji，后续可以替换为 react-native-vector-icons）
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
    <Text style={[styles.tabIcon, {fontSize: size, color}]}>
      {iconMap[name] || '•'}
    </Text>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    height: 80,
    paddingBottom: 20,
    paddingTop: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 8,
  },
  tabIcon: {
    lineHeight: 24,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});

export default TabNavigator;
