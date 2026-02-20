import { userApi } from '@/api/userApi';
import { Colors } from '@/constants/theme';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

export default function AuthScreen() {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [intro, setIntro] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isLogin = mode === 'login';

  const handleSubmit = async () => {
    if (!username || !password) {
      setError('用户名和密码不能为空');
      return;
    }
    try {
      setLoading(true);
      setError('');

      let res;
      if (isLogin) {
        res = await userApi.login({ username, password });
      } else {
        res = await userApi.register({ username, password, intro });
      }

      // 登录 / 注册成功后，把用户信息保存到本地
      if (res && res.code === 200 && res.data) {
        const payload = JSON.stringify(res.data);
        if (Platform.OS === 'web') {
          // Web 端使用 localStorage 作为替代
          window.localStorage.setItem('user', payload);
        } else {
          await SecureStore.setItemAsync('user', payload);
        }
      }

      router.replace('/(tabs)');
    } catch (e) {
      // 错误已经在 request 拦截器里弹出，这里只做兜底
      setError('请求失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.card}>
        <Text style={styles.title}>{isLogin ? '登录' : '注册'}</Text>
        <Text style={styles.subtitle}>
          {isLogin ? '欢迎回来，继续记录你的每一天。' : '加入漫记，开始记录你的生活。'}
        </Text>

        <View style={styles.form}>
          <Text style={styles.label}>用户名</Text>
          <TextInput
            value={username}
            onChangeText={setUsername}
            placeholder="请输入用户名"
            placeholderTextColor={Colors.light.textLight}
            style={styles.input}
            autoCapitalize="none"
          />

          <Text style={styles.label}>密码</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="请输入密码"
            placeholderTextColor={Colors.light.textLight}
            style={styles.input}
            secureTextEntry
          />

          {!isLogin && (
            <>
              <Text style={styles.label}>一句话介绍</Text>
              <TextInput
                value={intro}
                onChangeText={setIntro}
                placeholder="写点什么来介绍自己吧（可选）"
                placeholderTextColor={Colors.light.textLight}
                style={[styles.input, styles.textarea]}
                multiline
              />
            </>
          )}

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <Pressable
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && { opacity: 0.8 },
              loading && { opacity: 0.6 },
            ]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.primaryButtonText}>
              {loading ? '提交中...' : isLogin ? '登录' : '注册'}
            </Text>
          </Pressable>

          <Pressable
            style={styles.switchWrapper}
            onPress={() => {
              setMode(isLogin ? 'register' : 'login');
              setError('');
            }}
          >
            <Text style={styles.switchText}>
              {isLogin ? '还没有账号？去注册' : '已经有账号？去登录'}
            </Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  card: {
    backgroundColor: Colors.light.card,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.light.textLight,
    marginBottom: 20,
  },
  form: {
    marginTop: 4,
  },
  label: {
    fontSize: 13,
    color: Colors.light.textLight,
    marginBottom: 4,
    marginTop: 12,
  },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e4e3',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: Colors.light.text,
    backgroundColor: '#fdfefe',
  },
  textarea: {
    minHeight: 72,
    textAlignVertical: 'top',
  },
  primaryButton: {
    marginTop: 24,
    borderRadius: 999,
    backgroundColor: Colors.light.primary,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  switchWrapper: {
    marginTop: 16,
    alignItems: 'center',
  },
  switchText: {
    fontSize: 13,
    color: Colors.light.primary,
  },
  errorText: {
    marginTop: 12,
    fontSize: 12,
    color: '#e74c3c',
  },
});

