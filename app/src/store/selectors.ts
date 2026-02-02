import dayjs from '../utils/dayjs';
import type {Record, PeriodType} from '../types';

/**
 * 获取今天的日期字符串
 */
export function getTodayDate(): string {
  return dayjs().format('YYYY-MM-DD');
}

/**
 * 获取今日任务列表
 */
export function getTodayTasks(tasks: any[]) {
  const today = getTodayDate();
  return tasks.filter((task: any) => task.date === today);
}

/**
 * 根据周期获取日期范围
 * @param period 周期类型
 * @param offset 偏移量（0 = 当前，-1 = 上一个，1 = 下一个）
 */
export function getPeriodDateRange(
  period: PeriodType,
  offset: number = 0,
): {
  start: string;
  end: string;
} {
  const now = dayjs();
  let baseDate: dayjs.Dayjs;
  let start: dayjs.Dayjs;
  let end: dayjs.Dayjs;

  // 根据偏移量计算基准日期
  switch (period) {
    case 'week':
      baseDate = now.add(offset, 'week');
      start = baseDate.startOf('week');
      end = baseDate.endOf('week');
      break;
    case 'month':
      baseDate = now.add(offset, 'month');
      start = baseDate.startOf('month');
      end = baseDate.endOf('month');
      break;
    case 'year':
      baseDate = now.add(offset, 'year');
      start = baseDate.startOf('year');
      end = baseDate.endOf('year');
      break;
    default:
      baseDate = now.add(offset, 'week');
      start = baseDate.startOf('week');
      end = baseDate.endOf('week');
  }

  return {
    start: start.format('YYYY-MM-DD'),
    end: end.format('YYYY-MM-DD'),
  };
}

/**
 * 获取周期内的记录
 * @param records 所有记录
 * @param period 周期类型
 * @param offset 偏移量（0 = 当前，-1 = 上一个，1 = 下一个）
 */
export function getPeriodRecords(
  records: Record[],
  period: PeriodType,
  offset: number = 0,
): Record[] {
  const {start, end} = getPeriodDateRange(period, offset);
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
  const today = getTodayDate();
  const stats: Array<{date: string; count: number}> = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = dayjs().subtract(i, 'day').format('YYYY-MM-DD');
    const count = records.filter((r) => r.date === date).length;
    stats.push({date, count});
  }

  return stats;
}

/**
 * 获取每月的记录统计（用于趋势图 - 月度视图）
 */
export function getMonthlyStats(
  records: Record[],
): Array<{date: string; count: number}> {
  const monthlyStats = new Map<string, number>();

  records.forEach(record => {
    const date = record.date.slice(0, 7); // YYYY-MM
    monthlyStats.set(date, (monthlyStats.get(date) || 0) + 1);
  });

  return Array.from(monthlyStats.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([date, count]) => ({date, count}));
}

/**
 * 按类型统计记录
 */
export function getRecordsByType(records: Record[]): Record<string, number> {
  const stats: Record<string, number> = {};

  records.forEach(record => {
    const type = record.taskSnapshot.type;
    stats[type] = (stats[type] || 0) + 1;
  });

  return stats;
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

/**
 * 格式化周期显示文本
 * @param period 周期类型
 * @param offset 偏移量
 */
export function formatPeriodLabel(
  period: PeriodType,
  offset: number = 0,
): string {
  const now = dayjs();
  let baseDate: dayjs.Dayjs;

  switch (period) {
    case 'week':
      baseDate = now.add(offset, 'week');
      const weekStart = baseDate.startOf('week');
      const weekEnd = baseDate.endOf('week');
      // 如果跨月，显示 "1月1日-1月7日"，否则显示 "1月1日-7日"
      if (weekStart.month() === weekEnd.month()) {
        return `${weekStart.format('M月D日')}-${weekEnd.format('D日')}`;
      } else {
        return `${weekStart.format('M月D日')}-${weekEnd.format('M月D日')}`;
      }
    case 'month':
      baseDate = now.add(offset, 'month');
      return baseDate.format('YYYY年M月');
    case 'year':
      baseDate = now.add(offset, 'year');
      return baseDate.format('YYYY年');
    default:
      return '';
  }
}

/**
 * 获取指定月份的日历热力图数据
 */
export function getMonthlyHeatmap(
  records: Record[],
  month?: number,
  year?: number,
): Record<string, number> {
  const now = dayjs();
  const targetMonth = month !== undefined ? month : now.month();
  const targetYear = year !== undefined ? year : now.year();
  
  const start = dayjs().year(targetYear).month(targetMonth).startOf('month');
  const end = dayjs().year(targetYear).month(targetMonth).endOf('month');

  const heatmap: Record<string, number> = {};

  records.forEach(record => {
    const recordDate = dayjs(record.date);
    const dateStr = record.date;
    // 检查日期是否在指定月份范围内（包含首尾）
    // 使用 format 比较，确保包含边界
    const recordDateStr = recordDate.format('YYYY-MM-DD');
    const startStr = start.format('YYYY-MM-DD');
    const endStr = end.format('YYYY-MM-DD');
    
    if (recordDateStr >= startStr && recordDateStr <= endStr) {
      heatmap[dateStr] = (heatmap[dateStr] || 0) + 1;
    }
  });

  return heatmap;
}
