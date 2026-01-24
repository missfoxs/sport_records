# 运动记录 React Native 设计方案

> 基于现有 HTML 原型（index.html、statistics.html）的 RN 实现思路：流程图、设计思路、技术栈。

---

## 一、流程图

### 1. 应用整体流程（用户视角）

```
┌─────────────────────────────────────────────────────────────────────────┐
│                            App 启动 / 冷启动                              │
└────────────────────────────────┬────────────────────────────────────────┘
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    加载本地存储 (AsyncStorage)                            │
│                    恢复 Zustand 状态 + 今日任务                           │
└────────────────────────────────┬────────────────────────────────────────┘
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          Bottom Tab 根导航                               │
│         ┌──────────────────────┬──────────────────────┐                 │
│         │       首页 Tab        │       统计 Tab        │                 │
│         └──────────┬───────────┴──────────┬───────────┘                 │
└────────────────────┼──────────────────────┼─────────────────────────────┘
                     ▼                      ▼
    ┌────────────────────────┐   ┌────────────────────────┐
    │  首页 (HomeScreen)      │   │  统计 (StatisticsScreen)│
    │  · 周期 Tab: 本周/本月/今年│   │  · 7 天趋势折线图       │
    │  · 统计卡片: 天数/连续   │   │  · 本月统计卡片          │
    │  · 今日任务列表          │   │  · 类型分布环形图        │
    │  · 添加运动 (FAB/按钮)   │   │  · 运动记录              │
    └───────────┬────────────┘   │  · 本月日历热力图        │
                │                └────────────────────────┘
                ▼
    ┌────────────────────────┐
    │  添加运动 Modal/BottomSheet │
    │  · 类型: 力量/有氧/拉伸    │
    │  · 名称、标签、计划       │
    │  · 提交 → 写 Store + 持久化 │
    └────────────────────────┘
```

### 2. 数据流（状态与持久化）

```
┌──────────────┐     dispatch      ┌──────────────────────────────────────┐
│   UI 组件     │ ───────────────►  │  Zustand Store (sportStore)          │
│ (Screen/Modal)│                   │  · tasks: Task[]                     │
└──────┬───────┘                   │  · records: Record[] (历史完成记录)   │
       │                           │  · addTask / toggleTask / ...         │
       │ subscribe                 └──────────────────────┬───────────────┘
       │                                                    │
       ▼                                                    │ persist
┌──────────────┐     hydrate        ┌──────────────────────▼──────────────┐
│  选择性渲染   │ ◄────────────────  │  zustand/middleware + AsyncStorage   │
│ (今日/本周…)  │                   │  (或 MMKV) 持久化                     │
└──────────────┘                   └──────────────────────────────────────┘
```

### 3. 今日任务与统计的联动

```
今日任务勾选/取消
       │
       ▼
┌──────────────────┐     完成/取消完成      ┌─────────────────────────────┐
│  toggleTask(id)   │ ───────────────────►  │  records 增/删 一条完成记录   │
│  更新 task.done   │                       │  (date, taskId, task 快照)   │
└──────────────────┘                       └─────────────┬───────────────┘
                                                         │
         ┌───────────────────────────────────────────────┘
         ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  derive / selector：                                                     │
│  · 锻炼天数 = dayjs 按日期 group 的 records 去重后 count                  │
│  · 连续天数 = 从今天/昨天往前数连续有 records 的天数                      │
│  · 7 天趋势 = 最近 7 天每天完成数量                                      │
│  · 类型分布 = 按 type 聚合 records                                       │
│  · 日历热力 = 按 date 聚合，映射 level 1–4                               │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 二、设计思路

### 1. 功能模块划分（对齐现有 HTML）

| 模块 | 对应 HTML | 职责 |
|------|-----------|------|
| **首页** | `index.html` | 周期切换、统计卡片、今日任务列表、添加运动入口 |
| **统计** | `statistics.html` | 7 天趋势、本月统计、类型分布、运动记录、日历热力图 |
| **添加运动** | index 的 Modal | 类型选择、名称/标签/计划、校验后写入 store 并持久化 |
| **数据层** | 两页共用的「假数据」 | 统一为 Zustand + 持久化，统计全部从 records 派生 |

### 2. 数据模型设计

```ts
// 任务（可复用的模板，或「今日待办」实例）
interface Task {
  id: string;           // uuid 或 nanoid
  name: string;         // 深蹲、慢跑...
  type: 'strength' | 'cardio' | 'stretching';
  tag?: string;         // 腿部、胸部、有氧...
  plan?: string;        // "3组×15次"
  done: boolean;
  date: string;         // dayjs 格式 'YYYY-MM-DD'，用于「今日任务」筛选
  createdAt: string;    // ISO 8601，用于排序、统计
}

// 完成记录（每次勾选「完成」时写入，用于统计、趋势、日历）
interface Record {
  id: string;
  taskId: string;
  date: string;         // 'YYYY-MM-DD'
  taskSnapshot: { name, type, tag, plan };  // 方便统计时不再查 task
  completedAt: string;    // ISO 8601
}
```

- **今日任务**：`tasks` 中 `date === today` 的列表，勾选时更新 `task.done`，并在 `records` 中增/删对应 `Record`。
- **统计、趋势、分布、热力**：全部基于 `records` 按 `date`、`type`、`taskId` 做聚合，用 dayjs 做周期（本周/本月/今年）。

### 3. 页面与导航结构

```
Root (Tab)
├── HomeStack (或直接 HomeScreen)
│   └── HomeScreen
│       └── AddExerciseModal / BottomSheet（ Overlay，不占 Tab）
└── StatisticsStack (或直接 StatisticsScreen)
    └── StatisticsScreen
```

- 底部 Tab：首页、统计，与现有一致。
- 「添加运动」用 **Modal** 或 **@gorhom/bottom-sheet** 实现，不新增 Tab。

### 4. 业务规则（与 HTML 行为对齐）

1. **今日任务**
   - 只展示 `date === dayjs().format('YYYY-MM-DD')` 的 `tasks`。
   - 勾选：`task.done = true`，并 `records.push(Record)`；取消：`task.done = false`，从 `records` 中删对应记录（或做软删除）。

2. **周期（本周 / 本月 / 今年）**
   - 仅影响首页两个统计卡片：锻炼天数、连续天数。
   - 用 dayjs 的 `startOf('week')`、`endOf('month')` 等做区间过滤，再在 `records` 上算。

3. **连续天数**
   - 从今天（或昨天，按产品逻辑）往前推，看连续多少天 `records` 中有该日期的数据。

4. **统计页**
   - **7 天趋势**：最近 7 天，按 `date` 聚合 `records` 的条数。
   - **本月统计**：本月 `records` 去重 `date` 的天数 + 本月内最长连续。
   - **类型分布**：本月 `records` 按 `taskSnapshot.type` 或 `taskSnapshot.tag` 聚合。
   - **运动记录**：最常做、坚持最久、最近突破，可在 `records` 上按 `taskId`、`name`、时间窗口算（第一版用简单规则即可）。
   - **日历热力**：本月每日 `records` 条数映射到 level 1–4。

---

## 三、RN 技术栈

### 1. 基础框架

| 用途 | 推荐 | 说明 |
|------|------|------|
| 框架 | **React Native** (CLI 或 Expo) | 你已有 Web 原型，Expo 上手快，CLI 定制更多 |
| 语言 | **TypeScript** | 方便 Task、Record、Store 和 API 的类型约束 |
| 包管理 | **pnpm** 或 **yarn** | monorepo 或后续加库时更清晰 |

### 2. 导航

| 库 | 用途 |
|----|------|
| **@react-navigation/native** | 根导航 |
| **@react-navigation/bottom-tabs** | 底部「首页 / 统计」 |
| **@react-navigation/native-stack**（可选） | 若统计或首页有子页（如设置、历史） |

### 3. 状态管理与持久化

| 库 | 用途 |
|----|------|
| **zustand** | 全局 store：`tasks`、`records`、`period`（本周/本月/今年）、`addTask`、`toggleTask`、`setPeriod` 等 |
| **@react-native-async-storage/async-storage** | 持久化；可配合 `zustand/middleware` 的 persist，或手写 sync |
| **dayjs** | 所有日期：`today`、`startOf('week')`、`format('YYYY-MM-DD')`、最近 7 天、本月日期列表、连续天数计算 |
| **dayjs 插件**（按需） | `weekOfYear`、`isoWeek` 等，若要做「周」的严格定义 |

### 4. 图表（替代 Web 的 Chart.js）

| 库 | 用途 | 备注 |
|----|------|------|
| **react-native-gifted-charts** | 折线图（7 天趋势） | API 简单，适合移动端 |
| **react-native-svg** + **victory-native** | 折线 + 环形图 | 更灵活，稍重 |
| **react-native-chart-kit** | 折线、环形 | 依赖 `react-native-svg`，集成快 |

折线 + 环形在 RN 里选 **1 套** 即可；热力图可用 **react-native-svg** 自绘小方格，或 `react-native-calendars` 等日历组件再叠自定义标记。

### 5. UI 与交互

| 库 | 用途 |
|----|------|
| **@gorhom/bottom-sheet** | 添加运动底部表单，接近现有 Modal 体验 |
| **react-native-reanimated** | 底部弹层、Tab 切换、列表动画 |
| **react-native-gesture-handler** | 手势，底部抽屉、滑动关闭等 |

### 6. 本地存储与 ID

| 库 | 用途 |
|----|------|
| **@react-native-async-storage/async-storage** | 默认方案；若重视性能可后接 **react-native-mmkv** |
| **nanoid** 或 **uuid** | `Task.id`、`Record.id` |

### 7. 工程与质量（可选）

| 库 | 用途 |
|----|------|
| **eslint** + **prettier** | 风格与规范 |
| **jest** + **@testing-library/react-native** | Store 的 pure 函数、dayjs 统计逻辑、简单 UI |

---

## 四、技术栈清单（package.json 草案）

```txt
# 核心
react-native
typescript

# 导航
@react-navigation/native
@react-navigation/bottom-tabs
@react-navigation/native-stack  # 按需

# 状态与数据
zustand
dayjs
@react-native-async-storage/async-storage
nanoid  # 或 uuid

# 图表
react-native-svg
react-native-gifted-charts   # 或 victory-native / react-native-chart-kit 择一

# UI 与交互
@gorhom/bottom-sheet
react-native-reanimated
react-native-gesture-handler

# 工具
react-native-safe-area-context
react-native-screens
```

---

## 五、实施顺序建议

1. **脚手架**：Expo 或 RN CLI 起一个 TS 项目，接好 Navigation（Tab）和两个空白页（Home / Statistics）。
2. **数据层**：定好 `Task` / `Record` 类型，建 Zustand store，接 AsyncStorage 持久化。
3. **首页**：今日任务列表、勾选/取消（含 `records` 增删）、添加运动（Modal/BottomSheet + 表单），以及 dayjs 做「今日」筛选。
4. **首页统计**：周期 Tab（本周/本月/今年）和两个统计卡片（锻炼天数、连续天数），全部从 `records` + dayjs 派生。
5. **统计页**：7 天趋势折线图、本月统计卡片、类型分布环形图、运动记录、本月日历热力图，数据都从 store 的 `records` 计算。
6. **打磨**：样式对齐（渐变、圆角、配色）和简单动效（底部弹层、Tab 切换）。

---

## 六、与现有 HTML 的对应关系

| HTML | RN |
|------|-----|
| `index.html` 周期 Tab | `HomeScreen` 周期 Tab，`period` 存 Zustand |
| 锻炼天数 / 连续锻炼 卡片 | 从 `records` + dayjs 派生，按 `period` 过滤 |
| 今日任务列表 | `tasks` 中 `date === today`，`FlatList` 或 `ScrollView` |
| 任务勾选 | `toggleTask`，同步更新 `records` |
| 添加运动 Modal | `@gorhom/bottom-sheet` 或 `Modal` |
| `statistics.html` 7 天趋势 | `react-native-gifted-charts` 或 `victory-native` 折线 |
| 运动类型分布 | 环形图，数据从 `records` 按 type 聚合 |
| 运动记录（最常做等） | 在 `records` 上按 `taskId`/name 聚合 |
| 本月运动日历 | `react-native-svg` 自绘方格或日历库 + 热力 level |
