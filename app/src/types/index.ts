/**
 * 运动类型
 */
export type ExerciseType = 'strength' | 'cardio' | 'stretching';

/**
 * 周期类型（用于统计筛选）
 */
export type PeriodType = 'week' | 'month' | 'year';

/**
 * 任务（可复用的模板，或「今日待办」实例）
 */
export interface Task {
  id: string; // nanoid
  name: string; // 深蹲、慢跑...
  type: ExerciseType;
  tag?: string; // 腿部、胸部、有氧...
  plan?: string; // "3组×15次"
  done: boolean;
  date: string; // dayjs 格式 'YYYY-MM-DD'，用于「今日任务」筛选
  createdAt: string; // ISO 8601，用于排序、统计
}

/**
 * 完成记录（每次勾选「完成」时写入，用于统计、趋势、日历）
 */
export interface Record {
  id: string; // nanoid
  taskId: string;
  date: string; // 'YYYY-MM-DD'
  taskSnapshot: {
    name: string;
    type: ExerciseType;
    tag?: string;
    plan?: string;
  }; // 方便统计时不再查 task
  completedAt: string; // ISO 8601
}
