import type {
  ApiResponse,
  LoginParams,
  RegisterParams,
  UpdateUserParams,
  User,
  WordCountResponse,
} from '@/types/api';
import { request } from '@/utils/request';

/**
 * 用户相关 API
 */
export const userApi = {
  /**
   * 用户注册
   * @param params 注册参数
   */
  register: (params: RegisterParams): Promise<ApiResponse<User>> => {
    return request.post('/users/register', params);
  },

  /**
   * 用户登录
   * @param params 登录参数
   */
  login: (params: LoginParams): Promise<ApiResponse<User>> => {
    return request.post('/users/login', params);
  },

  /**
   * 更新用户信息
   * @param userId 用户ID
   * @param params 更新参数（username 和 intro 至少需要传一个）
   */
  update: (
    userId: number,
    params: UpdateUserParams
  ): Promise<ApiResponse<User>> => {
    return request.put(`/users/${userId}`, params);
  },

  /**
   * 统计用户总字数
   * @param userId 用户ID
   */
  getWordCount: (userId: number): Promise<ApiResponse<WordCountResponse>> => {
    return request.get(`/users/word-count/${userId}`);
  },
};
