import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
// import { Colors } from '@/constants/theme';
// import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  // const colorScheme = useColorScheme();
  return (
    <Tabs
      screenOptions={{
        tabBarButton: HapticTab,
        tabBarActiveTintColor: '#7a9e9f',
        headerStyle: {
          backgroundColor: '#7a9e9f', 
        },
        // 导航栏标题文字样式
        headerTitleStyle: {
          color: 'white', // 标题文字颜色
          fontSize: 18,
          fontWeight: 'bold',
        },
        // 导航栏左侧/右侧图标颜色（如有返回键等）
        headerTintColor: 'white',
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: '首页',
          headerTitle: '漫记',
          headerTitleAlign: 'center',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        
        options={{
          title: '我的',
          headerTitle: '我的页面',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
          headerShown: false,
        }}
      />

    </Tabs>
  );
}
