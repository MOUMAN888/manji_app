// API 响应通用类型
export interface ApiResponse<T = any> {
  code: number;
  data: T;
  message: string;
}

// 用户相关类型
export interface User {
  id: number;
  username: string;
  avatar: string;
  intro: string;
}

export interface RegisterParams {
  username: string;
  password: string;
  intro?: string;
  avatar?: string;
}

export interface LoginParams {
  username: string;
  password: string;
}

export interface WechatLoginParams {
  username: string;
  wechatOpenid: string;
  avatar?: string;
  intro?: string;
}

export interface WordCountResponse {
  totalWordCount: number;
}

export interface UpdateUserParams {
  username?: string;
  intro?: string;
}

// 笔记相关类型
export interface Note {
  id: number;
  userId: number;
  categoryId: number;
  /** 后端返回的分类名（联表/聚合字段） */
  categoryName?: string;
  title: string;
  content: string;
  wordCount: number;
  createTime: string;
  updateTime?: string;
}

export interface CreateNoteParams {
  userId: number;
  categoryId: number;
  title: string;
  content: string;
}

export interface UpdateNoteParams {
  userId: number;
  categoryId?: number;
  title?: string;
  content?: string;
}

export interface NoteCountResponse {
  noteCount: number;
}

// 分类相关类型
export interface Category {
  id: number;
  userId: number;
  name: string;
  createTime: string;
}

export interface CreateCategoryParams {
  userId: number;
  name: string;
}

export interface UpdateCategoryParams {
  newName: string;
}
