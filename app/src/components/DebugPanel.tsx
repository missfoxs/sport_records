import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useSportStore} from '../store';
import {useMockData} from '../data/useMockData';
import {getTodayDate} from '../store/selectors';

/**
 * 调试面板组件
 * 用于开发和测试，可以显示数据状态和快速操作
 */
function DebugPanel() {
  const {tasks, records, clearAllData} = useSportStore();
  const {loadMockData, clearMockData} = useMockData();
  const today = getTodayDate();

  const todayTasks = tasks.filter((t) => t.date === today);
  const mockTasks = tasks.filter((t) => t.id.startsWith('mock-'));
  const mockRecords = records.filter((r) => r.id.startsWith('mock-'));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>调试面板</Text>
      
      <View style={styles.info}>
        <Text style={styles.infoText}>今天: {today}</Text>
        <Text style={styles.infoText}>总任务数: {tasks.length}</Text>
        <Text style={styles.infoText}>今日任务: {todayTasks.length}</Text>
        <Text style={styles.infoText}>总记录数: {records.length}</Text>
        <Text style={styles.infoText}>测试任务: {mockTasks.length}</Text>
        <Text style={styles.infoText}>测试记录: {mockRecords.length}</Text>
      </View>

      <View style={styles.buttons}>
        <TouchableOpacity
          style={[styles.button, styles.loadButton]}
          onPress={loadMockData}>
          <Text style={styles.buttonText}>加载测试数据</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.clearButton]}
          onPress={clearMockData}>
          <Text style={styles.buttonText}>清除测试数据</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.dangerButton]}
          onPress={clearAllData}>
          <Text style={styles.buttonText}>清空所有数据</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    padding: 16,
    margin: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  info: {
    marginBottom: 16,
  },
  infoText: {
    fontSize: 12,
    color: '#6c757d',
    marginBottom: 4,
  },
  buttons: {
    gap: 8,
  },
  button: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  loadButton: {
    backgroundColor: '#667eea',
  },
  clearButton: {
    backgroundColor: '#ffc107',
  },
  dangerButton: {
    backgroundColor: '#dc3545',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default DebugPanel;
