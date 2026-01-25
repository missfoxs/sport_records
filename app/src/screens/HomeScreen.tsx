import React, {useState, useCallback} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useSportStore, getTodayTasks} from '../store';
import TaskList from '../components/TaskList';
import AddExerciseFormModal from '../components/AddExerciseFormModal';

function HomeScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const {tasks, toggleTask, addTask, deleteTask} = useSportStore();

  // 获取今日任务（使用 dayjs 筛选）
  const todayTasks = getTodayTasks(tasks);

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
      addTask(data);
    },
    [addTask],
  );

  // 切换任务完成状态（会自动更新 records）
  const handleToggleTask = useCallback(
    (id: string) => {
      toggleTask(id);
    },
    [toggleTask],
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>今日任务</Text>
        <Text style={styles.headerSubtitle}>
          {todayTasks.length} 个任务
        </Text>
      </View>

      <View style={styles.content}>
        <TaskList
          tasks={todayTasks}
          onToggleTask={handleToggleTask}
          onDeleteTask={deleteTask}
        />
      </View>

      {/* 浮动添加按钮 */}
      <TouchableOpacity
        style={styles.fab}
        onPress={handleOpenAddForm}
        activeOpacity={0.8}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      {/* 添加运动表单 Modal */}
      <AddExerciseFormModal
        visible={modalVisible}
        onClose={handleCloseModal}
        onSubmit={handleAddExercise}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#888888',
  },
  content: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#00ff88',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#00ff88',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabText: {
    fontSize: 32,
    fontWeight: '300',
    color: '#000000',
    lineHeight: 32,
  },
});

export default HomeScreen;
