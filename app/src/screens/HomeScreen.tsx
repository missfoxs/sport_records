import React, {useState, useCallback, useMemo, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Modal,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useSportStore, getTodayTasks, getExerciseDays, getConsecutiveDays} from '../store';
import TaskList from '../components/TaskList';
import StatCard from '../components/StatCard';
import AddExerciseScreen from './AddExerciseScreen';
import type {PeriodType} from '../types';

function HomeScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [period, setPeriod] = useState<PeriodType>('month');

  const {
    tasks,
    records,
    toggleTask,
    addTask,
    setPeriod: storeSetPeriod,
    initializeDefaultTasks,
  } = useSportStore();

  // 初始化默认任务（只在组件首次加载时执行一次）
  useEffect(() => {
    initializeDefaultTasks();
    // 开发时临时加载测试数据（记得删除）
    // loadMockData();
  }, [initializeDefaultTasks]);

  // 获取今日任务
  const todayTasks = useMemo(() => getTodayTasks(tasks), [tasks]);

  // 获取统计信息
  const stats = useMemo(() => {
    const exerciseDays = getExerciseDays(records);
    const consecutiveDays = getConsecutiveDays(records);
    return {
      exerciseDays,
      consecutiveDays,
    };
  }, [records]);

  // 打开添加运动表单
  const handleOpenAddForm = useCallback(() => {
    setModalVisible(true);
  }, []);

  // 关闭表单
  const handleCloseModal = useCallback(() => {
    setModalVisible(false);
  }, []);

  // 提交添加运动
  const handleAddExercise = useCallback(
    (data: {
      name: string;
      type: 'strength' | 'cardio' | 'stretching';
      tag?: string;
      plan?: string;
      date: string;
    }) => {
      console.log('handleAddExercise called with:', data);
      addTask(data);
    },
    [addTask],
  );

  // 切换任务完成状态
  const handleToggleTask = useCallback(
    (id: string) => {
      toggleTask(id);
    },
    [toggleTask],
  );

  // 切换周期
  const handlePeriodChange = useCallback(
    (newPeriod: PeriodType) => {
      setPeriod(newPeriod);
      storeSetPeriod(newPeriod);
    },
    [storeSetPeriod],
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" />

      {/* Header with Gradient */}
      <View style={styles.headerGradient}>
        <View style={styles.header}>
          <Text style={styles.logo}>FITLOG</Text>
          {/* <TouchableOpacity style={styles.statsBtn}>
            <Text style={styles.statsBtnText}>统计</Text>
          </TouchableOpacity> */}
        </View>

        {/* Period Tabs */}
        <View style={styles.periodTabs}>
          {(['week', 'month', 'year'] as PeriodType[]).map((p) => (
            <TouchableOpacity
              key={p}
              style={[styles.tab, period === p && styles.tabActive]}
              onPress={() => handlePeriodChange(p)}>
              <Text
                style={[styles.tabText, period === p && styles.tabTextActive]}>
                {p === 'week' ? '本周' : p === 'month' ? '本月' : '今年'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Stats Section - 与 headerGradient 无缝连接 */}
        <View style={styles.statsSection}>
          <View style={styles.statsGrid}>
            <StatCard value={stats.exerciseDays} label="锻炼天数" />
            <StatCard value={stats.consecutiveDays} label="连续锻炼" />
          </View>
        </View>

        {/* Tasks Section */}
        <View style={styles.tasksSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>今日任务</Text>
            <TouchableOpacity
              style={styles.addBtn}
              onPress={handleOpenAddForm}
              activeOpacity={0.8}>
              <Text style={styles.addBtnText}>+ 添加运动</Text>
            </TouchableOpacity>
          </View>

          <TaskList
            tasks={todayTasks}
            onToggleTask={handleToggleTask}
          />
        </View>

        {/* Debug Panel - 开发时使用，记得删除 */}
        {/* <DebugPanel /> */}
      </ScrollView>

      {/* Add Exercise Screen - Full Screen Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={handleCloseModal}>
        <AddExerciseScreen
          onSubmit={handleAddExercise}
          onClose={handleCloseModal}
        />
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f4f8',
  },
  headerGradient: {
    backgroundColor: '#667eea',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingBottom: 0, // 移除底部 padding，让圆角更自然
    paddingTop: 8, // 增加顶部间距
    marginBottom: 0, // 确保没有间距
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 12, // 减少内部 paddingTop，因为外层已有 paddingTop
    backgroundColor: 'transparent',
  },
  logo: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  statsBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  statsBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  periodTabs: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: 'transparent',
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  tabText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '600',
    fontSize: 14,
  },
  tabTextActive: {
    color: '#ffffff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 80,
  },
  statsSection: {
    backgroundColor: '#ffffff',
    marginTop: 0, // 与 headerGradient 无缝连接
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingTop: 30,
    // 确保与 headerGradient 的圆角完美对齐
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  tasksSection: {
    padding: 20,
    backgroundColor: '#ffffff',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  addBtn: {
    backgroundColor: '#667eea',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    shadowColor: '#667eea',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  addBtnText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default HomeScreen;
