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

const typeColors: Record<ExerciseType, string> = {
  strength: '#ff6b6b',
  cardio: '#4ecdc4',
  stretching: '#95e1d3',
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
      <View style={styles.leftSection}>
        <View
          style={[
            styles.checkbox,
            task.done && styles.checkboxChecked,
            {borderColor: typeColors[task.type]},
          ]}>
          {task.done && (
            <View
              style={[
                styles.checkmark,
                {backgroundColor: typeColors[task.type]},
              ]}
            />
          )}
        </View>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.emoji}>{typeEmoji[task.type]}</Text>
            <Text style={[styles.name, task.done && styles.nameDone]}>
              {task.name}
            </Text>
          </View>
          {(task.tag || task.plan) && (
            <View style={styles.meta}>
              {task.tag && (
                <Text style={styles.tag}>
                  {task.tag}
                  {task.plan && ' • '}
                </Text>
              )}
              {task.plan && <Text style={styles.plan}>{task.plan}</Text>}
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    marginVertical: 6,
    marginHorizontal: 16,
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  containerDone: {
    opacity: 0.6,
    borderColor: '#2a2a2a',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    borderWidth: 2,
  },
  checkmark: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  emoji: {
    fontSize: 20,
    marginRight: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  nameDone: {
    textDecorationLine: 'line-through',
    color: '#888888',
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  tag: {
    fontSize: 12,
    color: '#888888',
  },
  plan: {
    fontSize: 12,
    color: '#888888',
  },
});

export default TaskItem;
