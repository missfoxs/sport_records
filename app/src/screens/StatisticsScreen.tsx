import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  useSportStore,
  getPeriodRecords,
  getExerciseDays,
  getConsecutiveDays,
  getRecentDaysStats,
  getRecordsByType,
  getPeriodDateRange,
  formatPeriodLabel,
} from '../store';
import { LineChart, PieChart } from 'react-native-chart-kit';
import CalendarHeatmap from '../components/CalendarHeatmap';
import dayjs from '../utils/dayjs';

const { width } = Dimensions.get('window');

function StatisticsScreen() {
  const {
    records,
    period,
    periodOffset,
    setPeriod,
    navigatePeriod,
    resetPeriodOffset,
  } = useSportStore();

  // 获取当前周期的记录
  const periodRecords = useMemo(
    () => getPeriodRecords(records, period, periodOffset),
    [records, period, periodOffset],
  );

  // 获取当前周期的显示标签
  const periodLabel = useMemo(
    () => formatPeriodLabel(period, periodOffset),
    [period, periodOffset],
  );

  // 计算统计数据
  const stats = useMemo(() => {
    const exerciseDays = getExerciseDays(periodRecords);
    const consecutiveDays = getConsecutiveDays(periodRecords);
    const totalWorkouts = periodRecords.length;

    // 找出最常做的运动
    const countByExercise: Record<string, number> = {};
    periodRecords.forEach(record => {
      const name = record.taskSnapshot.name;
      countByExercise[name] = (countByExercise[name] || 0) + 1;
    });

    const mostFrequentExercise = Object.entries(countByExercise).sort(
      (a, b) => b[1] - a[1],
    )[0];

    return {
      exerciseDays,
      consecutiveDays,
      totalWorkouts,
      mostFrequentExercise: mostFrequentExercise?.[0] || '',
      mostFrequentCount: mostFrequentExercise?.[1] || 0,
    };
  }, [periodRecords]);

  // 根据周期计算趋势数据
  const trendData = useMemo(() => {
    const { start, end } = getPeriodDateRange(period, periodOffset);
    const startDate = dayjs(start);
    const endDate = dayjs(end);

    let trendStats: Array<{ date: string; count: number }> = [];

    if (period === 'week') {
      // 本周：显示7天
      trendStats = getRecentDaysStats(periodRecords, 7);
    } else if (period === 'month') {
      // 本月：显示每天
      let current = startDate;
      const endDateStr = endDate.format('YYYY-MM-DD');
      while (true) {
        const dateStr = current.format('YYYY-MM-DD');
        const count = periodRecords.filter(r => r.date === dateStr).length;
        trendStats.push({ date: dateStr, count });

        if (dateStr === endDateStr) break;
        current = current.add(1, 'day');
      }
    } else if (period === 'year') {
      // 今年：显示每月
      let current = startDate;
      const monthlyStats: Record<string, number> = {};
      const endMonthStr = endDate.format('YYYY-MM');

      while (true) {
        const monthStr = current.format('YYYY-MM');
        monthlyStats[monthStr] = 0;

        if (monthStr === endMonthStr) break;
        current = current.add(1, 'month');
      }

      periodRecords.forEach(record => {
        const monthStr = record.date.slice(0, 7);
        if (monthlyStats.hasOwnProperty(monthStr)) {
          monthlyStats[monthStr] = (monthlyStats[monthStr] || 0) + 1;
        }
      });

      trendStats = Object.entries(monthlyStats)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([date, count]) => ({ date, count }));
    }

    return {
      labels: trendStats.map(stat => {
        if (period === 'year') {
          return dayjs(stat.date).format('MM月');
        }
        return dayjs(stat.date).format('MM/DD');
      }),
      datasets: [
        {
          data: trendStats.map(stat => stat.count),
        },
      ],
    };
  }, [periodRecords, period, periodOffset]);

  // 计算运动类型分布
  const typeDistribution = useMemo(() => {
    const typeStats = getRecordsByType(periodRecords);
    const typeLabels: Record<string, string> = {
      strength: '力量训练',
      cardio: '有氧运动',
      stretching: '拉伸放松',
    };

    return Object.entries(typeStats).map(([type, count]) => ({
      name: typeLabels[type] || type,
      population: count,
      color:
        type === 'strength'
          ? '#667eea'
          : type === 'cardio'
          ? '#4ecdc4'
          : '#ffd93d',
      legendFontColor: '#6c757d',
      legendFontSize: 12,
    }));
  }, [periodRecords]);

  // 图表配置
  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(102, 126, 234, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(108, 117, 125, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: '#667eea',
    },
  };

  // 周期切换
  const periods = [
    { key: 'week', label: '本周' },
    { key: 'month', label: '本月' },
    { key: 'year', label: '今年' },
  ] as const;

  const handlePeriodChange = (newPeriod: 'week' | 'month' | 'year') => {
    setPeriod(newPeriod); // setPeriod 会自动重置 periodOffset
  };

  const handleNavigatePeriod = (direction: 'prev' | 'next') => {
    navigatePeriod(direction);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        {/* <TouchableOpacity style={styles.backButton}>
          <Text style={styles.backButtonText}>← 返回</Text>
        </TouchableOpacity> */}
        <Text style={styles.pageTitle}>统计</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Period Selection - 移到最上面 */}
        <View style={styles.periodSection}>
          <Text style={styles.periodTitle}>选择周期</Text>
          <View style={styles.periodTabs}>
            {periods.map(p => (
              <TouchableOpacity
                key={p.key}
                style={[
                  styles.periodTab,
                  period === p.key && styles.periodTabActive,
                ]}
                onPress={() => handlePeriodChange(p.key as any)}
              >
                <Text
                  style={[
                    styles.periodTabText,
                    period === p.key && styles.periodTabTextActive,
                  ]}
                >
                  {p.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Period Navigation */}
          <View style={styles.periodNavigation}>
            <TouchableOpacity
              style={styles.navButton}
              onPress={() => handleNavigatePeriod('prev')}
              activeOpacity={0.7}>
              <Text style={styles.navButtonText}>← 上一个</Text>
            </TouchableOpacity>
            <View style={styles.periodLabelContainer}>
              <Text style={styles.periodLabel}>{periodLabel}</Text>
              {periodOffset !== 0 && (
                <TouchableOpacity
                  style={styles.resetButton}
                  onPress={resetPeriodOffset}
                  activeOpacity={0.7}>
                  <Text style={styles.resetButtonText}>回到当前</Text>
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity
              style={styles.navButton}
              onPress={() => handleNavigatePeriod('next')}
              activeOpacity={0.7}>
              <Text style={styles.navButtonText}>下一个 →</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>快速统计</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.exerciseDays}</Text>
              <Text style={styles.statLabel}>锻炼天数</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.consecutiveDays}</Text>
              <Text style={styles.statLabel}>最长连续</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.totalWorkouts}</Text>
              <Text style={styles.statLabel}>总运动次数</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.mostFrequentCount}</Text>
              <Text style={styles.statLabel}>最常做</Text>
            </View>
          </View>
        </View>

        {/* Trend Chart */}
        {['week', 'year'].includes(period) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {period === 'week'
                ? '本周运动趋势'
                : period === 'month'
                ? '本月运动趋势'
                : '今年运动趋势'}
            </Text>
            <View style={styles.chartContainer}>
              {trendData.datasets[0].data.length > 0 ? (
                <LineChart
                  data={trendData}
                  width={width - 40}
                  height={220}
                  yAxisInterval={1}
                  chartConfig={chartConfig}
                  bezier
                  style={styles.chartStyle}
                />
              ) : (
                <View style={styles.emptyChart}>
                  <Text style={styles.emptyChartText}>暂无数据</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Type Distribution */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>运动类型分布</Text>
          <View style={styles.chartContainer}>
            {typeDistribution.length > 0 ? (
              <PieChart
                data={typeDistribution}
                width={width - 40}
                height={220}
                chartConfig={chartConfig}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="15"
                style={styles.chartStyle}
              />
            ) : (
              <View style={styles.emptyChart}>
                <Text style={styles.emptyChartText}>暂无数据</Text>
              </View>
            )}
          </View>
        </View>

        {/* Calendar Heatmap - 只在月周期显示 */}
        {period === 'month' && (
          <View style={styles.section}>
            <CalendarHeatmap records={periodRecords} />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f4f8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: '#667eea',
  },
  backButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 80,
  },
  section: {
    backgroundColor: '#ffffff',
    marginTop: -10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    flex: 1,
    minWidth: '45%',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#667eea',
    lineHeight: 32,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6c757d',
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  chartContainer: {
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  chartStyle: {
    marginVertical: 8,
    borderRadius: 16,
  },
  periodSection: {
    backgroundColor: '#ffffff',
    padding: 20,
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 16,
  },
  periodTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  periodTabs: {
    flexDirection: 'row',
    gap: 8,
  },
  periodTab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  periodTabActive: {
    backgroundColor: '#667eea',
    borderColor: '#667eea',
  },
  periodTabText: {
    color: '#6c757d',
    fontWeight: '600',
    fontSize: 14,
  },
  periodTabTextActive: {
    color: '#ffffff',
  },
  periodNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  navButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  navButtonText: {
    fontSize: 14,
    color: '#667eea',
    fontWeight: '600',
  },
  periodLabelContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 12,
  },
  periodLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  resetButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: '#667eea',
  },
  resetButtonText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '600',
  },
  emptyChart: {
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyChartText: {
    fontSize: 14,
    color: '#6c757d',
  },
});

export default StatisticsScreen;
