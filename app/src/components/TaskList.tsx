import React from 'react';
import {View, Text, FlatList, StyleSheet} from 'react-native';
import TaskItem from './TaskItem';
import type {Task} from '../types';

interface TaskListProps {
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onDeleteTask?: (id: string) => void;
}

function TaskList({tasks, onToggleTask, onDeleteTask}: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyEmoji}>📝</Text>
        <Text style={styles.emptyText}>还没有今日任务</Text>
        <Text style={styles.emptySubtext}>点击 + 添加运动按钮开始记录</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggleTask}
          onDelete={onDeleteTask}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'center',
  },
});

export default TaskList;
