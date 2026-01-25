import React, {useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import {useSportStore, getPeriodRecords, getExerciseDays, getConsecutiveDays, getRecentDaysStats, getRecordsByType} from '../store';
import {LineChart, PieChart} from 'react-native-chart-kit';
import CalendarHeatmap from '../components/CalendarHeatmap';
import dayjs from '../utils/dayjs';

const {width} = Dimensions.get('window');

function StatisticsScreen() {
  const {records, period, setPeriod} = useSportStore();

  // 获取当前周期的记录
  const periodRecords = useMemo(
    () => getPeriodRecords(records, period),
    [records, period],
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

  // 计算趋势数据（最近7天）
  const trendData = useMemo(() => {
    const stats = getRecentDaysStats(periodRecords, 7);
    return {
      labels: stats.map(stat => dayjs(stat.date).format('MM/DD')),
      datasets: [
        {
          data: stats.map(stat => stat.count),
        },
      ],
    };
  }, [periodRecords]);

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
    {key: 'week', label: '本周'},
    {key: 'month', label: '本月'},
    {key: 'year', label: '今年'},
  ] as const;

  const handlePeriodChange = (newPeriod: 'week' | 'month' | 'year') => {
    setPeriod(newPeriod);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Text style={styles.backButtonText}>← 返回</Text>
        </TouchableOpacity>
        <Text style={styles.pageTitle}>统计</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
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
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            最近7天运动趋势
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
                style={{
                  marginVertical: 8,
                  borderRadius: 16,
                }}
              />
            ) : (
              <View style={styles.emptyChart}>
                <Text style={styles.emptyChartText}>暂无数据</Text>
              </View>
            )}
          </View>
        </View>

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
                style={{
                  marginVertical: 8,
                  borderRadius: 16,
                }}
              />
            ) : (
              <View style={styles.emptyChart}>
                <Text style={styles.emptyChartText}>暂无数据</Text>
              </View>
            )}
          </View>
        </View>

        {/* Calendar Heatmap */}
        <View style={styles.section}>
          <CalendarHeatmap records={records} />
        </View>

        {/* Period Selection */}
        <View style={styles.periodSection}>
          <Text style={styles.periodTitle}>选择周期</Text>
          <View style={styles.periodTabs}>
            {periods.map(p => (
              <TouchableOpacity
                key={p.key}
                style={[styles.periodTab, period === p.key && styles.periodTabActive]}
                onPress={() => handlePeriodChange(p.key as any)}>
                <Text
                  style={[styles.periodTabText, period === p.key && styles.periodTabTextActive]}>
                  {p.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
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
  periodSection: {
    backgroundColor: '#ffffff',
    padding: 20,
    marginBottom: 20,
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
