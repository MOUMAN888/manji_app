import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { Alert, Platform } from 'react-native';

function getApiBaseUrl() {

  const fromEnv = process.env.EXPO_PUBLIC_API_BASE_URL;
  if (fromEnv) return fromEnv;

  if (Platform.OS === 'web') return 'http://localhost:3002/api';
  return 'http://localhost:3002/api';
}

// 1. 创建 axios 实例
const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 15000, // 请求超时时间（15秒）
  headers: {
    'Content-Type': 'application/json', // 默认请求头
  },
});

// 2. 请求拦截器：添加 token、处理请求前逻辑
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return config;
  },
  (error: AxiosError) => {
    // 请求发送前的错误处理
    console.error('请求拦截器错误：', error);
    return Promise.reject(error);
  }
);

// 3. 响应拦截器：统一处理返回结果、错误提示
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // 只返回响应数据（简化组件中使用）
    return response.data;
  },
  (error: AxiosError) => {
    // 统一错误提示
    let errorMsg = '网络请求失败，请稍后重试';
    
    if (error.response) {
      // 服务器返回错误（4xx/5xx）
      const { status, data } = error.response;
      // 类型断言确保 data 有 message 属性
      const responseData = data as { message?: string };
      switch (status) {
        case 401:
          errorMsg = '登录已过期，请重新登录';
          // 示例：跳转到登录页（需结合导航库使用）
          // import { useNavigation } from 'expo-router';
          // const navigation = useNavigation();
          // navigation.navigate('Login');
          break;
        case 403:
          errorMsg = '暂无权限访问';
          break;
        case 404:
          errorMsg = '接口不存在';
          break;
        case 500:
          errorMsg = '服务器内部错误';
          break;
        default:
          errorMsg = responseData?.message || errorMsg;
      }
    } else if (error.request) {
      // 请求已发送但无响应（网络断开/超时）
      errorMsg = '网络连接异常，请检查网络';
    }

    // React Native 中弹出错误提示
    Alert.alert('提示', errorMsg);
    console.error('请求错误详情：', error);
    
    return Promise.reject(error);
  }
);

// 4. 导出常用请求方法（简化调用）
export const request = {
  get: <T = any>(url: string, params?: Record<string, any>): Promise<T> => {
    return apiClient.get(url, { params });
  },
  post: <T = any>(url: string, data?: Record<string, any>): Promise<T> => {
    return apiClient.post(url, data);
  },
  put: <T = any>(url: string, data?: Record<string, any>): Promise<T> => {
    return apiClient.put(url, data);
  },
  delete: <T = any>(url: string, params?: Record<string, any>): Promise<T> => {
    return apiClient.delete(url, { params });
  },
};

// 导出原始实例（特殊场景使用）

export default apiClient;