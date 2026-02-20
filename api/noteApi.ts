import type {
    ApiResponse,
    CreateNoteParams,
    Note,
    NoteCountResponse,
    UpdateNoteParams,
    WordCountResponse,
} from '@/types/api';
import { request } from '@/utils/request';

/**
 * 笔记相关 API
 */
export const noteApi = {
  /**
   * 创建笔记
   * @param params 创建笔记参数
   */
  create: (params: CreateNoteParams): Promise<ApiResponse<Note>> => {
    return request.post('/notes', params);
  },

  /**
   * 获取用户所有笔记
   * @param userId 用户ID
   */
  getUserNotes: (userId: number): Promise<ApiResponse<Note[]>> => {
    return request.get(`/notes/user/${userId}`);
  },

  /**
   * 按分类查询笔记
   * @param categoryId 分类ID
   * @param userId 用户ID
   */
  getNotesByCategory: (
    categoryId: number,
    userId: number
  ): Promise<ApiResponse<Note[]>> => {
    return request.get(`/notes/category/${categoryId}/user/${userId}`);
  },

  /**
   * 统计用户总字数
   * @param userId 用户ID
   */
  getWordCount: (userId: number): Promise<ApiResponse<WordCountResponse>> => {
    return request.get(`/notes/word-count/${userId}`);
  },

  /**
   * 统计用户笔记数量
   * @param userId 用户ID
   */
  getNoteCount: (userId: number): Promise<ApiResponse<NoteCountResponse>> => {
    return request.get(`/notes/count/${userId}`);
  },

  /**
   * 修改笔记
   * @param noteId 笔记ID
   * @param params 更新参数
   */
  update: (
    noteId: number,
    params: UpdateNoteParams
  ): Promise<ApiResponse<Note>> => {
    return request.put(`/notes/${noteId}`, params);
  },

  /**
   * 查询活跃笔记天数
   * @param userId 用户ID
   * @param yearMonth 年月，格式：YYYY-MM，例如：2026-01
   */
  getActiveDays: (
    userId: number,
    yearMonth: string
  ): Promise<ApiResponse<string[]>> => {
    return request.get('/notes/active-days', { userId, yearMonth });
  },

  /**
   * 根据日期查询笔记
   * @param userId 用户ID
   * @param date 日期，格式：YYYY-MM-DD，例如：2026-01-16
   */
  getNotesByDate: (
    userId: number,
    date: string
  ): Promise<ApiResponse<Note[]>> => {
    return request.get('/notes/by-date', { userId, date });
  },

  /**
   * 删除笔记
   * @param noteId 笔记ID
   */
  delete: (noteId: number): Promise<ApiResponse<null>> => {
    return request.delete(`/notes/${noteId}`);
  },

  /**
   * 搜索笔记
   * @param userId 用户ID
   * @param keyword 关键词
   */
  search: (userId: number, keyword: string): Promise<ApiResponse<Note[]>> => {
    return request.get('/notes/search', { userId, keyword });
  },
};
