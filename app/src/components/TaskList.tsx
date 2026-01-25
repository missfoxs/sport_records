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
        <Text style={styles.emptySubtext}>点击右下角 + 添加运动</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={tasks}
      keyExtractor={(item) => item.id}
      renderItem={({item}) => (
        <TaskItem
          task={item}
          onToggle={onToggleTask}
          onDelete={onDeleteTask}
        />
      )}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingVertical: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#888888',
    textAlign: 'center',
  },
});

export default TaskList;
