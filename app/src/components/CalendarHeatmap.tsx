import React, {useMemo} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Dimensions} from 'react-native';
import dayjs from '../utils/dayjs';
import {getMonthlyHeatmap, getHeatLevel} from '../store/selectors';
import type {Record} from '../types';

interface CalendarHeatmapProps {
  records: Record[];
  month?: number; // 0-11，默认当前月
  year?: number; // 默认当前年
}

const {width} = Dimensions.get('window');
const CELL_SIZE = (width - 60) / 7; // 7列，左右各留30px边距

function CalendarHeatmap({records, month, year}: CalendarHeatmapProps) {
  const now = dayjs();
  const targetMonth = month !== undefined ? month : now.month();
  const targetYear = year !== undefined ? year : now.year();

  // 获取本月热力图数据
  const heatmapData = useMemo(() => {
    return getMonthlyHeatmap(records, targetMonth, targetYear);
  }, [records, targetMonth, targetYear]);

  // 生成本月所有日期
  const calendarDays = useMemo(() => {
    const start = dayjs().year(targetYear).month(targetMonth).startOf('month');
    const end = dayjs().year(targetYear).month(targetMonth).endOf('month');
    const days: Array<{date: string; day: number; level: number}> = [];

    let current = start;
    const endDateStr = end.format('YYYY-MM-DD');
    
    while (true) {
      const dateStr = current.format('YYYY-MM-DD');
      const count = heatmapData[dateStr] || 0;
      const level = getHeatLevel(count);

      days.push({
        date: dateStr,
        day: current.date(),
        level,
      });

      // 如果到达月末，退出循环
      if (dateStr === endDateStr) {
        break;
      }
      
      current = current.add(1, 'day');
    }

    return days;
  }, [targetYear, targetMonth, heatmapData]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>本月运动日历</Text>
        <View style={styles.legend}>
          <Text style={styles.legendText}>少</Text>
          <View style={styles.legendColors}>
            <View style={[styles.legendColor, styles.level0]} />
            <View style={[styles.legendColor, styles.level1]} />
            <View style={[styles.legendColor, styles.level2]} />
            <View style={[styles.legendColor, styles.level3]} />
            <View style={[styles.legendColor, styles.level4]} />
          </View>
          <Text style={styles.legendText}>多</Text>
        </View>
      </View>

      <View style={styles.calendarGrid}>
        {calendarDays.map((day, index) => {
          const levelClass = `level${day.level}` as keyof typeof styles;
          return (
            <TouchableOpacity
              key={`${day.date}-${index}`}
              style={[
                styles.calendarDay,
                styles[levelClass] || styles.level0,
              ]}
              activeOpacity={0.7}>
              <Text
                style={[
                  styles.dayText,
                  day.level > 0 && styles.dayTextActive,
                ]}>
                {day.day}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendText: {
    fontSize: 11,
    color: '#6c757d',
  },
  legendColors: {
    flexDirection: 'row',
    gap: 4,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 3,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  calendarDay: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderRadius: 6,
    backgroundColor: '#e9ecef',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6c757d',
  },
  dayTextActive: {
    color: '#1a1a1a',
  },
  // 热力等级样式（类似 GitHub）
  level0: {
    backgroundColor: '#e9ecef',
  },
  level1: {
    backgroundColor: '#c6e48b',
  },
  level2: {
    backgroundColor: '#7bc96f',
  },
  level3: {
    backgroundColor: '#239a3b',
  },
  level4: {
    backgroundColor: '#196127',
  },
});

export default CalendarHeatmap;
