# Android 打包和安装指南

本指南将帮助你将 React Native 应用打包并安装到 Android 手机上。

## 前置要求

1. **Android SDK** 已安装并配置环境变量
2. **Java JDK** (推荐 JDK 17 或更高版本)
3. **Android 手机** 已开启开发者选项和 USB 调试

## 方法一：生成调试版 APK（推荐用于测试）

调试版 APK 使用默认的调试签名，可以直接安装到手机上。

### 步骤 1: 进入项目目录

```bash
cd app
```

### 步骤 2: 安装依赖（如果还没安装）

```bash
pnpm install
# 或
npm install
```

### 步骤 3: 生成调试版 APK

```bash
# 方式 1: 使用 Gradle 命令（推荐）
cd android
./gradlew assembleDebug

# 方式 2: 使用 React Native CLI
cd ..
pnpm android --mode=release
```

### 步骤 4: 找到生成的 APK

APK 文件位置：
```
app/android/app/build/outputs/apk/debug/app-debug.apk
```

### 步骤 5: 安装到手机

**方式 A: 通过 USB 连接安装**

1. 用 USB 线连接手机到电脑
2. 确保手机已开启 USB 调试
3. 运行命令：
```bash
adb install app/android/app/build/outputs/apk/debug/app-debug.apk
```

**方式 B: 手动安装**

1. 将 `app-debug.apk` 文件传输到手机（通过 USB、云盘、微信等）
2. 在手机上打开文件管理器，找到 APK 文件
3. 点击安装（可能需要允许"安装未知来源应用"）

## 方法二：生成发布版 APK（用于正式发布）

发布版 APK 需要签名密钥。当前配置使用调试密钥，生产环境需要生成自己的密钥。

### 步骤 1: 生成签名密钥（首次需要）

```bash
cd android/app
keytool -genkeypair -v -storetype PKCS12 -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

按提示输入密码和信息，记住密码和别名。

### 步骤 2: 配置签名信息

编辑 `android/app/build.gradle`，在 `android` 块中添加：

```gradle
signingConfigs {
    release {
        storeFile file('my-release-key.keystore')
        storePassword '你的密钥密码'
        keyAlias 'my-key-alias'
        keyPassword '你的密钥密码'
    }
}
buildTypes {
    release {
        signingConfig signingConfigs.release
        minifyEnabled enableProguardInReleaseBuilds
        proguardFiles getDefaultProguardFile("proguard-android.txt"), "proguard-rules.pro"
    }
}
```

### 步骤 3: 生成发布版 APK

```bash
cd android
./gradlew assembleRelease
```

### 步骤 4: 找到生成的 APK

APK 文件位置：
```
app/android/app/build/outputs/apk/release/app-release.apk
```

## 方法三：使用 React Native CLI 直接运行（开发时）

如果你只是想快速测试，可以直接运行：

```bash
cd app
pnpm android
```

这会自动构建并安装到连接的设备上。

## 常见问题

### 1. 找不到 adb 命令

确保 Android SDK Platform Tools 已添加到 PATH：
```bash
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

### 2. 设备未授权

在手机上确认 USB 调试授权弹窗，点击"允许"。

### 3. 安装失败：INSTALL_FAILED_INSUFFICIENT_STORAGE

手机存储空间不足，清理一些空间后重试。

### 4. 安装失败：INSTALL_PARSE_FAILED_NO_CERTIFICATES

APK 签名有问题，检查签名配置。

### 5. 应用崩溃或白屏

检查 Metro bundler 是否在运行：
```bash
pnpm start
```

## 快速命令参考

```bash
# 进入项目目录
cd app

# 安装依赖
pnpm install

# 生成调试版 APK
cd android && ./gradlew assembleDebug && cd ..

# 安装到连接的设备
adb install android/app/build/outputs/apk/debug/app-debug.apk

# 或者直接运行（自动安装）
pnpm android
```

## 注意事项

1. **调试版 APK** 适合测试，但体积较大，性能不如发布版
2. **发布版 APK** 需要签名密钥，请妥善保管密钥文件
3. 首次安装可能需要允许"安装未知来源应用"
4. 如果应用需要网络权限，确保手机已授予相应权限

## 生成 AAB 文件（用于 Google Play 发布）

如果要发布到 Google Play，需要生成 AAB 文件：

```bash
cd android
./gradlew bundleRelease
```

AAB 文件位置：
```
app/android/app/build/outputs/bundle/release/app-release.aab
```
