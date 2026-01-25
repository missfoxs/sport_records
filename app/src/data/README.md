# 测试数据说明

## 📁 文件位置

`src/data/mockData.json` - 测试数据文件（JSON 格式）

## 📊 数据内容

包含：
- **4 个任务**（tasks）：深蹲、慢跑、俯卧撑、瑜伽
- **10 条记录**（records）：最近 5 天的运动完成记录

所有测试数据的 ID 都以 `mock-` 开头，方便识别和删除。

## 🚀 使用方法

### 方法 1: 使用 Hook（推荐）

```tsx
import {useMockData} from '../data/useMockData';

function MyComponent() {
  const {loadMockData, clearMockData} = useMockData();

  return (
    <View>
      <Button title="加载测试数据" onPress={loadMockData} />
      <Button title="清除测试数据" onPress={clearMockData} />
    </View>
  );
}
```

### 方法 2: 直接使用 Store

```tsx
import {useSportStore} from '../store';

function MyComponent() {
  const {loadMockData, clearMockData} = useSportStore();

  return (
    <View>
      <Button title="加载测试数据" onPress={loadMockData} />
      <Button title="清除测试数据" onPress={clearMockData} />
    </View>
  );
}
```

### 方法 3: 在开发时临时加载

可以在 `HomeScreen` 或 `StatisticsScreen` 的 `useEffect` 中临时加载：

```tsx
import {useMockData} from '../data/useMockData';

function HomeScreen() {
  const {loadMockData} = useMockData();

  useEffect(() => {
    // 开发时临时加载测试数据（记得删除）
    loadMockData();
  }, [loadMockData]);

  // ... 其他代码
}
```

## 🗑️ 删除测试数据

### 方法 1: 使用 clearMockData（推荐）

```tsx
const {clearMockData} = useSportStore();
clearMockData(); // 只删除 mock- 开头的测试数据
```

### 方法 2: 删除文件

直接删除 `src/data/mockData.json` 文件即可。

### 方法 3: 清空所有数据

```tsx
const {clearAllData} = useSportStore();
clearAllData(); // 清空所有数据（包括用户数据）
```

## ⚠️ 注意事项

1. **避免重复加载**：`loadMockData()` 会自动检查是否已加载，不会重复添加
2. **ID 前缀**：所有测试数据 ID 都以 `mock-` 开头，方便识别
3. **日期**：测试数据使用固定日期（2026-01-19 到 2026-01-24），可以根据需要修改
4. **生产环境**：记得在生产环境前删除测试数据相关代码

## 📝 修改测试数据

直接编辑 `mockData.json` 文件即可。格式必须符合 `Task` 和 `Record` 接口定义。
