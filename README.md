## 漫记（Manji）

**漫记（Manji）** 是一个基于 [Expo](https://expo.dev) 的React Native移动应用项目，用来记录和管理你的日常笔记/想法。

### 主要功能

- **笔记管理**: 支持创建、查看、编辑和删除笔记。
- **分类整理**: 为每条笔记设置分类，支持自定义新增、删除分类。
- **日历视图**: 通过日历面板按日期查看对应日期的笔记。
- **搜索笔记**: 顶部搜索栏支持按关键字快速搜索笔记内容。
- **个人中心**: 支持查看和编辑用户名、个性签名等个人信息。
- **数据统计（个人页）**: 展示分类数量、累计字数、笔记数量等统计信息。
- **本地登录状态保存**: 使用本地存储 / SecureStore记住登录用户，下次打开免登录。

### APK 下载（Android）

你可以通过夸克网盘下载并安装最新的 Android 安装包（APK）：

- **下载地址**: [`点击下载「漫记.apk」`](https://pan.quark.cn/s/04f2d24197b6)

> 提示：如果你已安装夸克 APP，可以直接在夸克中打开链接进行下载和安装。

### 本地开发与运行

1. **安装依赖**

   ```bash
   npm install
   ```

2. **启动开发环境**

   ```bash
   npx expo start
   ```

在终端输出中，你可以选择以下方式打开应用：

- **Development build**: 参考文档：[开发版构建](https://docs.expo.dev/develop/development-builds/introduction/)
- **Android 模拟器**: 使用 Android Studio，参考：[Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- **iOS 模拟器**: 仅限 macOS，参考：[iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- **Expo Go**: 使用 [Expo Go](https://expo.dev/go) 快速预览应用（功能有限）

你可以从 `app` 目录开始开发，该项目使用 [基于文件的路由](https://docs.expo.dev/router/introduction)。

### 重置示例代码

当你准备好开始一个全新的项目结构时，可以运行：

```bash
npm run reset-project
```

此命令会将示例代码移动到 `app-example` 目录，并为你创建一个空的 `app` 目录。

### 了解更多关于 Expo

如果你希望进一步了解如何使用 Expo 开发，可以参考以下资源：

- [Expo 文档](https://docs.expo.dev/): 从基础到进阶的完整文档和指南。
- [Expo 教程](https://docs.expo.dev/tutorial/introduction/): 通过完整示例学习如何构建同时运行在 Android、iOS 和 Web 的应用。
