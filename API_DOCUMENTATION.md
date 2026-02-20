# Manji Backend API 文档

## 基础信息

- **Base URL**: `http://localhost:3002`
- **Content-Type**: `application/json`

---

## 1. 用户相关 API (`/api/users`)

### 1.1 用户注册

**接口地址**: `POST /api/users/register`

**接口描述**: 普通用户注册（带密码）

**请求参数**:

```json
{
  "username": "string (必填)",
  "password": "string (必填)",
  "intro": "string (可选，默认: '')",
  "avatar": "string (可选，默认: '')"
}
```

**响应示例**:

```json
{
  "code": 200,
  "data": {
    "id": 1,
    "username": "testuser",
    "avatar": "",
    "intro": ""
  },
  "message": "注册成功"
}
```

**错误响应**:
- `用户名和密码不能为空` - 参数缺失
- `用户名已存在` - 用户名重复

---

### 1.2 用户登录

**接口地址**: `POST /api/users/login`

**接口描述**: 用户登录（验证密码）

**请求参数**:

```json
{
  "username": "string (必填)",
  "password": "string (必填)"
}
```

**响应示例**:

```json
{
  "code": 200,
  "data": {
    "id": 1,
    "username": "testuser",
    "avatar": "",
    "intro": ""
  },
  "message": "登录成功"
}
```

**错误响应**:
- `用户名和密码不能为空` - 参数缺失
- `用户名或密码错误` - 验证失败

---

### 1.3 微信登录/注册

**接口地址**: `POST /api/users/wechat/login`

**接口描述**: 微信用户注册/登录（带 OpenID）

**请求参数**:

```json
{
  "username": "string (必填)",
  "wechatOpenid": "string (必填)",
  "avatar": "string (可选，默认: '')",
  "intro": "string (可选，默认: '')"
}
```

**响应示例**:

```json
{
  "code": 200,
  "data": {
    "id": 1,
    "username": "wechat_user",
    "avatar": "",
    "intro": ""
  },
  "message": "微信登录成功"
}
```

**错误响应**:
- `用户名和微信 OpenID 不能为空` - 参数缺失

---

### 1.4 统计用户总字数

**接口地址**: `GET /api/users/word-count/:userId`

**接口描述**: 统计用户所记录的总字数

**路径参数**:
- `userId`: number (必填) - 用户ID

**响应示例**:

```json
{
  "code": 200,
  "data": {
    "totalWordCount": 12345
  },
  "message": "统计字数成功"
}
```

**错误响应**:
- `用户ID不能为空` - 参数缺失

---

## 2. 笔记相关 API (`/api/notes`)

### 2.1 创建笔记

**接口地址**: `POST /api/notes`

**接口描述**: 创建笔记（自动计算字数）

**请求参数**:

```json
{
  "userId": "number (必填)",
  "categoryId": "number (必填)",
  "title": "string (必填)",
  "content": "string (必填)"
}
```

**响应示例**:

```json
{
  "code": 200,
  "data": {
    "id": 1,
    "userId": 1,
    "categoryId": 1,
    "title": "我的第一篇笔记",
    "content": "这是笔记内容...",
    "wordCount": 8,
    "createTime": "2026-01-16T10:00:00.000Z"
  },
  "message": "笔记创建成功"
}
```

**错误响应**:
- `用户ID、分类ID、标题、内容不能为空` - 参数缺失

---

### 2.2 获取用户所有笔记

**接口地址**: `GET /api/notes/user/:userId`

**接口描述**: 获取用户所有笔记（按创建时间倒序）

**路径参数**:
- `userId`: number (必填) - 用户ID

**响应示例**:

```json
{
  "code": 200,
  "data": [
    {
      "id": 1,
      "userId": 1,
      "categoryId": 1,
      "title": "笔记标题",
      "content": "笔记内容",
      "wordCount": 4,
      "createTime": "2026-01-16T10:00:00.000Z"
    }
  ],
  "message": "查询笔记成功"
}
```

**错误响应**:
- `用户ID不能为空` - 参数缺失

---

### 2.3 按分类查询笔记

**接口地址**: `GET /api/notes/category/:categoryId/user/:userId`

**接口描述**: 按分类查询笔记（按创建时间倒序）

**路径参数**:
- `categoryId`: number (必填) - 分类ID
- `userId`: number (必填) - 用户ID

**响应示例**:

```json
{
  "code": 200,
  "data": [
    {
      "id": 1,
      "userId": 1,
      "categoryId": 1,
      "title": "笔记标题",
      "content": "笔记内容",
      "wordCount": 4,
      "createTime": "2026-01-16T10:00:00.000Z"
    }
  ],
  "message": "查询笔记成功"
}
```

**错误响应**:
- `分类ID和用户ID不能为空` - 参数缺失

---

### 2.4 统计用户总字数

**接口地址**: `GET /api/notes/word-count/:userId`

**接口描述**: 统计用户总字数

**路径参数**:
- `userId`: number (必填) - 用户ID

**响应示例**:

```json
{
  "code": 200,
  "data": {
    "totalWordCount": 12345
  },
  "message": "统计字数成功"
}
```

**错误响应**:
- `用户ID不能为空` - 参数缺失

---

### 2.5 统计用户笔记数量

**接口地址**: `GET /api/notes/count/:userId`

**接口描述**: 统计用户笔记数量

**路径参数**:
- `userId`: number (必填) - 用户ID

**响应示例**:

```json
{
  "code": 200,
  "data": {
    "noteCount": 10
  },
  "message": "统计笔记数量成功"
}
```

**错误响应**:
- `用户ID不能为空` - 参数缺失

---

### 2.6 修改笔记

**接口地址**: `PUT /api/notes/:noteId`

**接口描述**: 修改笔记（支持部分更新）

**路径参数**:
- `noteId`: number (必填) - 笔记ID

**请求参数**:

```json
{
  "userId": "number (必填)",
  "categoryId": "number (可选)",
  "title": "string (可选)",
  "content": "string (可选)"
}
```

**响应示例**:

```json
{
  "code": 200,
  "data": {
    "id": 1,
    "userId": 1,
    "categoryId": 1,
    "title": "更新后的标题",
    "content": "更新后的内容",
    "wordCount": 6,
    "createTime": "2026-01-16T10:00:00.000Z"
  },
  "message": "笔记修改成功"
}
```

**错误响应**:
- `笔记ID和用户ID不能为空` - 参数缺失
- `笔记不存在或无权限修改` - 笔记不存在或不属于该用户

**说明**: 
- 只更新传入的字段，未传入的字段保持不变
- 如果更新了 `content`，会自动重新计算 `wordCount`

---

### 2.7 查询活跃笔记天数

**接口地址**: `GET /api/notes/active-days`

**接口描述**: 查询指定年月的活跃笔记天数（有笔记的日期列表）

**查询参数**:
- `userId`: number (必填) - 用户ID
- `yearMonth`: string (必填) - 年月，格式：`YYYY-MM`，例如：`2026-01`

**响应示例**:

```json
{
  "code": 200,
  "data": [
    "2026-01-01",
    "2026-01-05",
    "2026-01-10",
    "2026-01-15"
  ],
  "message": "查询成功"
}
```

**错误响应**:
- `userId、yearMonth 不能为空` - 参数缺失
- `yearMonth格式错误，必须为YYYY-MM（如：2026-01）` - 格式错误
- `yearMonth不合法，月份必须是1-12，年份范围1970-2100` - 值不合法

---

### 2.8 根据日期查询笔记

**接口地址**: `GET /api/notes/by-date`

**接口描述**: 根据日期查询当天的笔记（按创建时间倒序）

**查询参数**:
- `userId`: number (必填) - 用户ID
- `date`: string (必填) - 日期，格式：`YYYY-MM-DD`，例如：`2026-01-16`

**响应示例**:

```json
{
  "code": 200,
  "data": [
    {
      "id": 1,
      "userId": 1,
      "categoryId": 1,
      "title": "笔记标题",
      "content": "笔记内容",
      "wordCount": 4,
      "createTime": "2026-01-16T10:00:00.000Z"
    }
  ],
  "message": "查询当天笔记成功"
}
```

**错误响应**:
- `userId、date 不能为空` - 参数缺失
- `date 格式错误，必须为 YYYY-MM-DD（如：2026-01-16）` - 格式错误

---

### 2.9 删除笔记

**接口地址**: `DELETE /api/notes/:noteId`

**接口描述**: 删除笔记

**路径参数**:
- `noteId`: number (必填) - 笔记ID

**响应示例**:

```json
{
  "code": 200,
  "data": null,
  "message": "笔记删除成功"
}
```

**错误响应**:
- `笔记ID不能为空` - 参数缺失
- `笔记不存在或无权限删除` - 笔记不存在

---

## 3. 分类相关 API (`/api/categories`)

### 3.1 创建分类

**接口地址**: `POST /api/categories`

**接口描述**: 创建分类

**请求参数**:

```json
{
  "userId": "number (必填)",
  "name": "string (必填)"
}
```

**响应示例**:

```json
{
  "code": 200,
  "data": {
    "id": 1,
    "userId": 1,
    "name": "工作",
    "createTime": "2026-01-16T10:00:00.000Z"
  },
  "message": "分类创建成功"
}
```

**错误响应**:
- `用户ID和分类名不能为空` - 参数缺失
- `分类「xxx」已存在` - 分类名重复

---

### 3.2 查询用户所有分类

**接口地址**: `GET /api/categories/:userId`

**接口描述**: 查询用户所有分类（按创建时间倒序）

**路径参数**:
- `userId`: number (必填) - 用户ID

**响应示例**:

```json
{
  "code": 200,
  "data": [
    {
      "id": 1,
      "userId": 1,
      "name": "工作",
      "createTime": "2026-01-16T10:00:00.000Z"
    },
    {
      "id": 2,
      "userId": 1,
      "name": "生活",
      "createTime": "2026-01-15T10:00:00.000Z"
    }
  ],
  "message": "查询分类成功"
}
```

**错误响应**:
- `用户ID不能为空` - 参数缺失

---

### 3.3 修改分类名称

**接口地址**: `PUT /api/categories/:categoryId`

**接口描述**: 修改分类名称

**路径参数**:
- `categoryId`: number (必填) - 分类ID

**请求参数**:

```json
{
  "newName": "string (必填)"
}
```

**响应示例**:

```json
{
  "code": 200,
  "data": {
    "id": 1,
    "userId": 1,
    "name": "新分类名",
    "createTime": "2026-01-16T10:00:00.000Z"
  },
  "message": "分类名称更新成功"
}
```

**错误响应**:
- `分类ID和新名称不能为空` - 参数缺失
- `分类不存在` - 分类不存在
- `分类「xxx」已存在` - 新名称重复

---

### 3.4 删除分类

**接口地址**: `DELETE /api/categories/:categoryId`

**接口描述**: 删除分类（会自动删除关联的笔记，因为数据库设置了 ON DELETE CASCADE）

**路径参数**:
- `categoryId`: number (必填) - 分类ID

**响应示例**:

```json
{
  "code": 200,
  "data": null,
  "message": "分类删除成功"
}
```

**错误响应**:
- `分类ID不能为空` - 参数缺失
- `分类不存在` - 分类不存在

---

## 响应格式说明

### 成功响应

```json
{
  "code": 200,
  "data": {},
  "message": "操作成功"
}
```

### 失败响应

```json
{
  "code": 400,
  "data": null,
  "message": "错误信息"
}
```

### 服务器错误响应

```json
{
  "code": 500,
  "data": null,
  "message": "服务器内部错误"
}
```

---

## 注意事项

1. **字数统计**: 笔记的字数统计会自动过滤空格和换行符
2. **权限控制**: 修改和删除笔记时会验证笔记是否属于当前用户
3. **级联删除**: 删除分类时会自动删除该分类下的所有笔记
4. **日期格式**: 
   - 年月格式：`YYYY-MM`（如：`2026-01`）
   - 日期格式：`YYYY-MM-DD`（如：`2026-01-16`）
5. **密码安全**: 用户密码使用 bcrypt 进行哈希存储，不会明文保存
6. **微信用户**: 微信用户没有密码，只能通过 OpenID 登录

---

## 示例请求

### 创建笔记

```bash
curl -X POST http://localhost:3002/api/notes \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "categoryId": 1,
    "title": "我的笔记",
    "content": "这是笔记内容"
  }'
```

### 查询用户所有笔记

```bash
curl -X GET http://localhost:3002/api/notes/user/1
```

### 查询活跃天数

```bash
curl -X GET "http://localhost:3002/api/notes/active-days?userId=1&yearMonth=2026-01"
```
