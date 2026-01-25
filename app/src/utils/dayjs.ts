/**
 * dayjs 配置和工具函数
 */
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import weekOfYear from 'dayjs/plugin/weekOfYear';

// 启用插件
dayjs.extend(isoWeek);
dayjs.extend(weekOfYear);

/**
 * 生成唯一的 ID
 * 替代 nanoid，避免 React Native 环境中的 crypto 问题
 */
export function generateId(): string {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 9);
  return `${timestamp}-${randomPart}`;
}

export default dayjs;
