import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import type {ExerciseType} from '../types';
import {getTodayDate} from '../store/selectors';

interface AddExerciseFormModalProps {
  visible: boolean;
  onClose: () => void;
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
    {type: 'strength', label: '力量训练', emoji: '💪'},
    {type: 'cardio', label: '有氧运动', emoji: '🏃'},
    {type: 'stretching', label: '拉伸放松', emoji: '🧘'},
  ];

function AddExerciseFormModal({
  visible,
  onClose,
  onSubmit,
}: AddExerciseFormModalProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState<ExerciseType>('strength');
  const [tag, setTag] = useState('');
  const [plan, setPlan] = useState('');

  const handleSubmit = () => {
    if (!name.trim()) {
      return;
    }

    const exerciseData = {
      name: name.trim(),
      type,
      tag: tag.trim() || undefined,
      plan: plan.trim() || undefined,
      date: getTodayDate(),
    };

    console.log('Submitting exercise:', exerciseData);

    onSubmit(exerciseData);

    // 重置表单
    setName('');
    setTag('');
    setPlan('');
    setType('strength');
    onClose();
  };

  const handleClose = () => {
    // 重置表单
    setName('');
    setTag('');
    setPlan('');
    setType('strength');
    onClose();
  };

  const handleBackdropPress = () => {
    handleClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}>
      <TouchableWithoutFeedback onPress={handleBackdropPress}>
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardAvoidView}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>添加运动</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={handleClose}>
                  <Text style={styles.closeButtonText}>×</Text>
                </TouchableOpacity>
              </View>

              {/* <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.contentContainer}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}> */}
                {/* Exercise Type Selection */}
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>选择运动类型</Text>
                  <View style={styles.exerciseTypesGrid}>
                    {exerciseTypes.map((item) => (
                      <TouchableOpacity
                        key={item.type}
                        style={[
                          styles.exerciseTypeBtn,
                          type === item.type && styles.exerciseTypeBtnSelected,
                        ]}
                        onPress={() => setType(item.type)}>
                        <Text style={styles.exerciseTypeIcon}>
                          {item.emoji}
                        </Text>
                        <Text
                          style={[
                            styles.exerciseTypeLabel,
                            type === item.type && styles.exerciseTypeLabelSelected,
                          ]}>
                          {item.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Exercise Name */}
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>运动名称</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="例如：深蹲、慢跑、俯卧撑..."
                    placeholderTextColor="#999"
                    value={name}
                    onChangeText={setName}
                  />
                </View>

                {/* Tag */}
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>部位标签</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="例如：腿部、胸部、有氧..."
                    placeholderTextColor="#999"
                    value={tag}
                    onChangeText={setTag}
                  />
                </View>

                {/* Plan */}
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>训练计划</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="例如：3组 × 15次"
                    placeholderTextColor="#999"
                    value={plan}
                    onChangeText={setPlan}
                  />
                </View>

                {/* 提交按钮 */}
                <TouchableOpacity
                  style={[
                    styles.submitButton,
                    !name.trim() && styles.submitButtonDisabled,
                  ]}
                  onPress={handleSubmit}
                  disabled={!name.trim()}
                  activeOpacity={0.8}>
                  <Text style={styles.submitButtonText}>确认添加</Text>
                </TouchableOpacity>

                {/* 底部留白，避免内容被键盘遮挡 */}
                <View style={{height: 20}} />
              {/* </ScrollView> */}
            </View>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  keyboardAvoidView: {
    flex: 1,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  closeButton: {
    backgroundColor: '#f8f9fa',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 24,
    color: '#6c757d',
    lineHeight: 24,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  formGroup: {
    marginBottom: 24,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 10,
  },
  exerciseTypesGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  exerciseTypeBtn: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e9ecef',
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },
  exerciseTypeBtnSelected: {
    borderColor: '#667eea',
    backgroundColor: '#f0f3ff',
  },
  exerciseTypeIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  exerciseTypeLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#495057',
  },
  exerciseTypeLabelSelected: {
    color: '#667eea',
  },
  formInput: {
    padding: 16,
    borderWidth: 2,
    borderColor: '#e9ecef',
    borderRadius: 12,
    fontSize: 16,
    color: '#1a1a1a',
    backgroundColor: '#ffffff',
  },
  submitButton: {
    marginHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#667eea',
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#667eea',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#e9ecef',
    shadowOpacity: 0,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default AddExerciseFormModal;
