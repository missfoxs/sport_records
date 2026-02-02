import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import type {Task, ExerciseType} from '../types';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete?: (id: string) => void;
}

const typeEmoji: Record<ExerciseType, string> = {
  strength: '💪',
  cardio: '🏃',
  stretching: '🧘',
};

function TaskItem({task, onToggle, onDelete}: TaskItemProps) {
  const handleToggle = () => {
    onToggle(task.id);
  };

  return (
    <TouchableOpacity
      style={[styles.container, task.done && styles.containerDone]}
      onPress={handleToggle}
      activeOpacity={0.7}>
      <View
        style={[
          styles.checkbox,
          task.done && styles.checkboxChecked,
        ]}>
        {task.done && <Text style={styles.checkmark}>✓</Text>}
      </View>

      <View style={styles.content}>
        <Text style={[styles.name, task.done && styles.nameDone]}>
          {task.name}
        </Text>
        {(task.tag || task.plan) && (
          <View style={styles.meta}>
            {task.tag && (
              <Text style={styles.tag}>
                {task.tag}
                {task.plan && '  '}
              </Text>
            )}
            {task.plan && <Text style={styles.plan}>{task.plan}</Text>}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    marginBottom: 10,
  },
  containerDone: {
    opacity: 0.6,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#dee2e6',
    backgroundColor: '#ffffff',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    borderColor: '#667eea',
    backgroundColor: '#667eea',
  },
  checkmark: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
    transform: [{translateY: -1}],
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  nameDone: {
    textDecorationLine: 'line-through',
    color: '#adb5bd',
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tag: {
    fontSize: 13,
    color: '#6c757d',
    backgroundColor: '#e9ecef',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    fontWeight: '600',
    marginRight: 8,
  },
  plan: {
    fontSize: 13,
    color: '#6c757d',
  },
});

export default TaskItem;
