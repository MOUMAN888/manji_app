// app/_layout.tsx
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      {/* 登录 / 注册页：隐藏导航栏 */}
      <Stack.Screen
        name="auth"
        options={{
          headerShown: false,
        }}
      />

      {/* 主 Tab 布局：自身再控制内部页面的 header */}
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />

      {/* 分类管理页 */}
      <Stack.Screen
        name="categories"
        options={{
          headerTitle: '分类管理',
          headerShown: true,
          headerStyle: {
            backgroundColor: '#7a9e9f',
          },
          headerTitleStyle: {
            color: '#fff',
            fontSize: 18,
            fontWeight: '600',
          },
          headerTintColor: '#fff',
        }}
      />

      {/* 新建笔记弹窗页：保留导航栏样式 */}
      <Stack.Screen
        name="modal"
        options={{
          headerTitle: '',
          headerShown: true,
          headerStyle: {
            backgroundColor: '#7a9e9f',
          },
          headerTitleStyle: {
            color: '#fff',
            fontSize: 18,
            fontWeight: '600',
          },
          headerTintColor: '#fff',
          headerBackTitle: '返回',
          headerBackTitleStyle: {
            fontSize: 16,
          },
        }}
      />
    </Stack>
  );
}