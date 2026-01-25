/**
 * dayjs 配置和工具函数
 */
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import weekOfYear from 'dayjs/plugin/weekOfYear';

// 启用插件
dayjs.extend(isoWeek);
dayjs.extend(weekOfYear);

export default dayjs;
