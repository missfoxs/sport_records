import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import BottomSheet, {BottomSheetTextInput} from '@gorhom/bottom-sheet';
import type {ExerciseType} from '../types';
import {getTodayDate} from '../store/selectors';

interface AddExerciseFormProps {
  bottomSheetRef: React.RefObject<BottomSheet>;
  onSubmit: (data: {
    name: string;
    type: ExerciseType;
    tag?: string;
    plan?: string;
    date: string;
  }) => void;
}

const exerciseTypes: Array<{type: ExerciseType; label: string; emoji: string}> =
  [
    {type: 'strength', label: '力量', emoji: '💪'},
    {type: 'cardio', label: '有氧', emoji: '🏃'},
    {type: 'stretching', label: '拉伸', emoji: '🧘'},
  ];

function AddExerciseForm({bottomSheetRef, onSubmit}: AddExerciseFormProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState<ExerciseType>('strength');
  const [tag, setTag] = useState('');
  const [plan, setPlan] = useState('');

  const handleSubmit = () => {
    if (!name.trim()) {
      return;
    }

    onSubmit({
      name: name.trim(),
      type,
      tag: tag.trim() || undefined,
      plan: plan.trim() || undefined,
      date: getTodayDate(),
    });

    // 重置表单
    setName('');
    setTag('');
    setPlan('');
    setType('strength');
    bottomSheetRef.current?.close();
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={['90%']}
      enablePanDownToClose
      backgroundStyle={styles.bottomSheetBackground}
      handleIndicatorStyle={styles.handleIndicator}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>添加运动</Text>
            <Text style={styles.subtitle}>记录你的运动计划</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>运动名称 *</Text>
            <BottomSheetTextInput
              style={styles.input}
              placeholder="例如：深蹲、慢跑、瑜伽..."
              placeholderTextColor="#666"
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>运动类型 *</Text>
            <View style={styles.typeContainer}>
              {exerciseTypes.map((item) => (
                <TouchableOpacity
                  key={item.type}
                  style={[
                    styles.typeButton,
                    type === item.type && styles.typeButtonActive,
                  ]}
                  onPress={() => setType(item.type)}>
                  <Text style={styles.typeEmoji}>{item.emoji}</Text>
                  <Text
                    style={[
                      styles.typeLabel,
                      type === item.type && styles.typeLabelActive,
                    ]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>标签（可选）</Text>
            <BottomSheetTextInput
              style={styles.input}
              placeholder="例如：腿部、胸部、有氧..."
              placeholderTextColor="#666"
              value={tag}
              onChangeText={setTag}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>计划（可选）</Text>
            <BottomSheetTextInput
              style={styles.input}
              placeholder="例如：3组×15次、30分钟..."
              placeholderTextColor="#666"
              value={plan}
              onChangeText={setPlan}
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => bottomSheetRef.current?.close()}>
              <Text style={styles.cancelButtonText}>取消</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                styles.submitButton,
                !name.trim() && styles.submitButtonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={!name.trim()}>
              <Text
                style={[
                  styles.submitButtonText,
                  !name.trim() && styles.submitButtonTextDisabled,
                ]}>
                添加
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  bottomSheetBackground: {
    backgroundColor: '#1a1a1a',
  },
  handleIndicator: {
    backgroundColor: '#444',
  },
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#888888',
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#ffffff',
    borderWidth: 1,
    borderColor: '#333',
  },
  typeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    flex: 1,
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  typeButtonActive: {
    borderColor: '#00ff88',
    backgroundColor: '#1a3a2a',
  },
  typeEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  typeLabel: {
    fontSize: 14,
    color: '#888888',
    fontWeight: '600',
  },
  typeLabelActive: {
    color: '#00ff88',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
    marginBottom: 20,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#2a2a2a',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  submitButton: {
    backgroundColor: '#00ff88',
  },
  submitButtonDisabled: {
    backgroundColor: '#2a2a2a',
    opacity: 0.5,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  submitButtonTextDisabled: {
    color: '#666',
  },
});

export default AddExerciseForm;
