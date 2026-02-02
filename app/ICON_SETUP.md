# FITLOG 应用图标设置指南

## 图标要求

应用图标需要以下尺寸的 PNG 文件：

- **mipmap-mdpi**: 48x48 px
- **mipmap-hdpi**: 72x72 px  
- **mipmap-xhdpi**: 96x96 px
- **mipmap-xxhdpi**: 144x144 px
- **mipmap-xxxhdpi**: 192x192 px

每个尺寸需要两个版本：
- `ic_launcher.png` - 方形图标
- `ic_launcher_round.png` - 圆形图标（Android 7.1+）

## 图标设计建议

### 设计元素
- **背景**: 紫色渐变 (#667eea 到 #764ba2)
- **主元素**: 白色的大写字母 "F" 或健身符号（哑铃、跑步图标等）
- **风格**: 简洁现代，适合健身应用
- **形状**: 圆角矩形（Android 会自动处理）

### 设计工具推荐
1. **在线工具**:
   - [App Icon Generator](https://www.appicon.co/)
   - [Icon Kitchen](https://icon.kitchen/)
   - [MakeAppIcon](https://makeappicon.com/)

2. **设计软件**:
   - Figma
   - Adobe Illustrator
   - Sketch

## 快速替换步骤

### 方法 1: 使用在线工具生成

1. 准备一个 1024x1024 px 的 PNG 图标文件
2. 访问 [App Icon Generator](https://www.appicon.co/)
3. 上传你的图标
4. 选择 Android 平台
5. 下载生成的图标包
6. 将图标文件复制到对应的 mipmap 文件夹中

### 方法 2: 手动替换

1. 准备所有尺寸的图标文件
2. 替换以下路径中的文件：

```
android/app/src/main/res/
├── mipmap-mdpi/
│   ├── ic_launcher.png
│   └── ic_launcher_round.png
├── mipmap-hdpi/
│   ├── ic_launcher.png
│   └── ic_launcher_round.png
├── mipmap-xhdpi/
│   ├── ic_launcher.png
│   └── ic_launcher_round.png
├── mipmap-xxhdpi/
│   ├── ic_launcher.png
│   └── ic_launcher_round.png
└── mipmap-xxxhdpi/
    ├── ic_launcher.png
    └── ic_launcher_round.png
```

## 图标设计示例描述

如果你需要设计图标，可以参考以下描述：

**FITLOG 图标设计**:
- 背景：紫色渐变（从 #667eea 到 #764ba2）
- 前景：白色粗体字母 "F"，或者一个简洁的健身符号
- 风格：现代、简洁、专业
- 适合健身追踪应用的主题

## 验证图标

替换图标后，重新构建应用：

```bash
cd android
./gradlew clean
./gradlew assembleDebug
```

然后在设备上安装 APK 查看效果。

## iOS 图标（可选）

如果需要 iOS 版本，图标需要放在：
```
ios/app/Images.xcassets/AppIcon.appiconset/
```

iOS 需要更多尺寸，建议使用 Xcode 的 Asset Catalog 或在线工具生成。
