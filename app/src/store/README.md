# Store 使用说明

## 📦 已安装的依赖

- `zustand` - 状态管理
- `@react-native-async-storage/async-storage` - 持久化存储
- `dayjs` - 日期处理
- `nanoid` - ID 生成

## 📁 文件结构

```
src/
├── types/
│   └── index.ts          # 类型定义（Task, Record, PeriodType, ExerciseType）
├── store/
│   ├── sportStore.ts     # Zustand store 主文件
│   ├── selectors.ts      # 数据选择器和计算函数
│   ├── index.ts          # 统一导出
│   └── README.md         # 本文件
```

## 🎯 核心功能

### 1. 类型定义

- **Task**: 任务/运动项
- **Record**: 完成记录（用于统计）
- **PeriodType**: 周期类型（week/month/year）
- **ExerciseType**: 运动类型（strength/cardio/stretching）

### 2. Store Actions

#### 任务管理
- `addTask(task)` - 添加任务
- `updateTask(id, updates)` - 更新任务
- `deleteTask(id)` - 删除任务
- `toggleTask(id)` - 切换任务完成状态（自动同步 records）

#### 记录管理
- `addRecord(taskId, task)` - 手动添加记录
- `removeRecord(taskId, date)` - 删除记录

#### 其他
- `setPeriod(period)` - 设置统计周期
- `clearAllData()` - 清空所有数据

### 3. Selectors（数据选择器）

- `getTodayTasks(tasks)` - 获取今日任务
- `getPeriodRecords(records, period)` - 获取周期内记录
- `getExerciseDays(records)` - 计算锻炼天数
- `getConsecutiveDays(records)` - 计算连续天数
- `getRecentDaysStats(records, days)` - 获取最近 N 天统计（用于趋势图）
- `getRecordsByType(records)` - 按类型统计
- `getMonthlyHeatmap(records)` - 获取本月热力图数据

## 💡 使用示例

### 在组件中使用 Store

```tsx
import React from 'react';
import {View, Text, Button} from 'react-native';
import {useSportStore} from '../store';
import {
  getTodayTasks,
  getExerciseDays,
  getConsecutiveDays,
} from '../store/selectors';

function HomeScreen() {
  const {tasks, records, toggleTask, addTask, period, setPeriod} =
    useSportStore();

  // 获取今日任务
  const todayTasks = getTodayTasks(tasks);

  // 获取周期内记录
  const periodRecords = getPeriodRecords(records, period);

  // 计算统计
  const exerciseDays = getExerciseDays(periodRecords);
  const consecutiveDays = getConsecutiveDays(records);

  // 添加任务示例
  const handleAddTask = () => {
    addTask({
      name: '深蹲',
      type: 'strength',
      tag: '腿部',
      plan: '3组×15次',
      date: '2026-01-24', // 或使用 getTodayDate()
    });
  };

  // 切换任务完成状态
  const handleToggleTask = (taskId: string) => {
    toggleTask(taskId); // 会自动更新 task.done 和 records
  };

  return (
    <View>
      <Text>今日任务数: {todayTasks.length}</Text>
      <Text>锻炼天数: {exerciseDays}</Text>
      <Text>连续天数: {consecutiveDays}</Text>
      <Button title="添加任务" onPress={handleAddTask} />
    </View>
  );
}
```

### 添加任务

```tsx
import {useSportStore} from '../store';
import {getTodayDate} from '../store/selectors';

const {addTask} = useSportStore();

addTask({
  name: '慢跑',
  type: 'cardio',
  tag: '有氧',
  plan: '30分钟',
  date: getTodayDate(), // 'YYYY-MM-DD'
});
```

### 切换周期

```tsx
const {period, setPeriod} = useSportStore();

// 切换到本月
setPeriod('month');

// 切换到本周
setPeriod('week');

// 切换到今年
setPeriod('year');
```

## 🔄 数据持久化

Store 使用 AsyncStorage 自动持久化，数据存储在 key `sport-store` 下。

持久化的数据包括：
- `tasks` - 所有任务
- `records` - 所有完成记录
- `period` - 当前周期设置

## 📊 数据流

1. **添加任务** → `addTask()` → 添加到 `tasks` 数组
2. **完成任务** → `toggleTask()` → 更新 `task.done` + 添加 `record`
3. **取消完成** → `toggleTask()` → 更新 `task.done` + 删除 `record`
4. **统计计算** → 使用 selectors 从 `records` 计算统计数据

## ⚠️ 注意事项

1. **日期格式**: 统一使用 `YYYY-MM-DD` 格式（dayjs）
2. **ID 生成**: 使用 `nanoid()` 生成唯一 ID
3. **时间戳**: 使用 ISO 8601 格式（`dayjs().toISOString()`）
4. **任务快照**: Record 中保存了 task 的快照，方便统计时不需要查询 tasks
