import dayjs from '../utils/dayjs';
import type {Task, Record, PeriodType} from '../types';

/**
 * 获取今天的日期字符串
 */
export function getTodayDate(): string {
  return dayjs().format('YYYY-MM-DD');
}

/**
 * 获取今日任务列表
 */
export function getTodayTasks(tasks: Task[]): Task[] {
  const today = getTodayDate();
  return tasks.filter((task) => task.date === today);
}

/**
 * 根据周期获取日期范围
 */
export function getPeriodDateRange(period: PeriodType): {
  start: string;
  end: string;
} {
  const now = dayjs();
  let start: dayjs.Dayjs;
  let end: dayjs.Dayjs;

  switch (period) {
    case 'week':
      start = now.startOf('week');
      end = now.endOf('week');
      break;
    case 'month':
      start = now.startOf('month');
      end = now.endOf('month');
      break;
    case 'year':
      start = now.startOf('year');
      end = now.endOf('year');
      break;
    default:
      start = now.startOf('week');
      end = now.endOf('week');
  }

  return {
    start: start.format('YYYY-MM-DD'),
    end: end.format('YYYY-MM-DD'),
  };
}

/**
 * 获取周期内的记录
 */
export function getPeriodRecords(
  records: Record[],
  period: PeriodType,
): Record[] {
  const {start, end} = getPeriodDateRange(period);
  return records.filter(
    (record) => record.date >= start && record.date <= end,
  );
}

/**
 * 计算锻炼天数（去重日期）
 */
export function getExerciseDays(records: Record[]): number {
  const uniqueDates = new Set(records.map((r) => r.date));
  return uniqueDates.size;
}

/**
 * 计算连续天数（从今天往前推）
 */
export function getConsecutiveDays(records: Record[]): number {
  const today = getTodayDate();
  const recordDates = new Set(records.map((r) => r.date));
  let count = 0;
  let currentDate = dayjs(today);

  // 从今天开始往前检查
  while (true) {
    const dateStr = currentDate.format('YYYY-MM-DD');
    if (recordDates.has(dateStr)) {
      count++;
      currentDate = currentDate.subtract(1, 'day');
    } else {
      break;
    }
  }

  return count;
}

/**
 * 获取最近 N 天的记录统计（用于趋势图）
 */
export function getRecentDaysStats(
  records: Record[],
  days: number = 7,
): Array<{date: string; count: number}> {
  const today = dayjs();
  const stats: Array<{date: string; count: number}> = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = today.subtract(i, 'day').format('YYYY-MM-DD');
    const count = records.filter((r) => r.date === date).length;
    stats.push({date, count});
  }

  return stats;
}

/**
 * 按类型统计记录
 */
export function getRecordsByType(records: Record[]): Record<
  string,
  number
> {
  const stats: Record<string, number> = {};

  records.forEach((record) => {
    const type = record.taskSnapshot.type;
    stats[type] = (stats[type] || 0) + 1;
  });

  return stats;
}

/**
 * 获取本月日历热力图数据
 */
export function getMonthlyHeatmap(records: Record[]): Record<
  string,
  number
> {
  const now = dayjs();
  const start = now.startOf('month');
  const end = now.endOf('month');
  const heatmap: Record<string, number> = {};

  records.forEach((record) => {
    const recordDate = dayjs(record.date);
    if (recordDate.isAfter(start) && recordDate.isBefore(end)) {
      const dateStr = record.date;
      heatmap[dateStr] = (heatmap[dateStr] || 0) + 1;
    }
  });

  return heatmap;
}

/**
 * 将记录数量映射到热力等级（1-4）
 */
export function getHeatLevel(count: number): number {
  if (count === 0) return 0;
  if (count <= 2) return 1;
  if (count <= 4) return 2;
  if (count <= 6) return 3;
  return 4;
}
