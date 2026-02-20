import type {
    ApiResponse,
    Category,
    CreateCategoryParams,
    UpdateCategoryParams,
} from '@/types/api';
import { request } from '@/utils/request';

/**
 * 分类相关 API
 */
export const categoryApi = {
  /**
   * 创建分类
   * @param params 创建分类参数
   */
  create: (params: CreateCategoryParams): Promise<ApiResponse<Category>> => {
    return request.post('/categories', params);
  },

  /**
   * 查询用户所有分类
   * @param userId 用户ID
   */
  getUserCategories: (userId: number): Promise<ApiResponse<Category[]>> => {
    return request.get(`/categories/${userId}`);
  },

  /**
   * 修改分类名称
   * @param categoryId 分类ID
   * @param params 更新参数
   */
  update: (
    categoryId: number,
    params: UpdateCategoryParams
  ): Promise<ApiResponse<Category>> => {
    return request.put(`/categories/${categoryId}`, params);
  },

  /**
   * 删除分类
   * @param categoryId 分类ID
   */
  delete: (categoryId: number): Promise<ApiResponse<null>> => {
    return request.delete(`/categories/${categoryId}`);
  },
};
