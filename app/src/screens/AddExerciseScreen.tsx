import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import type {ExerciseType} from '../types';
import {getTodayDate} from '../store/selectors';

interface AddExerciseScreenProps {
  onSubmit: (data: {
    name: string;
    type: ExerciseType;
    tag?: string;
    plan?: string;
    date: string;
  }) => void;
  onClose: () => void;
}

const exerciseTypes: Array<{type: ExerciseType; label: string; emoji: string}> =
  [
    {type: 'strength', label: '力量训练', emoji: '💪'},
    {type: 'cardio', label: '有氧运动', emoji: '🏃'},
    {type: 'stretching', label: '拉伸放松', emoji: '🧘'},
  ];

// 常见运动名称（按类型分类）
const commonExercises: Record<ExerciseType, string[]> = {
  strength: [
    '深蹲',
    '俯卧撑',
    '引体向上',
    '平板支撑',
    '哑铃',
    '卷腹',
    '仰卧起坐',
    '哑铃弯举',
    '杠铃卧推',
    '硬拉',
    '箭步蹲',
    '臂屈伸',
    '推举',
  ],
  cardio: [
    '慢跑',
    '跑步',
    '快走',
    '游泳',
    '骑行',
    '跳绳',
    '椭圆机',
    '划船机',
    'HIIT',
    '有氧操',
    '爬楼梯',
    '登山',
  ],
  stretching: [
    '瑜伽',
    '拉伸',
    '普拉提',
    '太极',
    '冥想',
    '放松',
    '按摩',
    '泡沫轴',
  ],
};

// 常见部位标签
const commonTags: string[] = [
  '腿部',
  '胸部',
  '背部',
  '手臂',
  '核心',
  '有氧',
  '拉伸',
  '全身',
  '肩部',
  '臀部',
];

function AddExerciseScreen({onSubmit, onClose}: AddExerciseScreenProps) {
  const [type, setType] = useState<ExerciseType>('strength');
  const [selectedName, setSelectedName] = useState<string>('');
  const [customName, setCustomName] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [plan, setPlan] = useState<string>('');

  // 根据类型获取运动列表
  const exerciseList = commonExercises[type];

  // 切换运动名称选择
  const handleSelectExercise = (name: string) => {
    if (selectedName === name) {
      setSelectedName('');
    } else {
      setSelectedName(name);
      setCustomName(''); // 清除自定义输入
    }
  };

  // 切换标签选择
  const handleToggleTag = (tag: string) => {
    setSelectedTags(prev => {
      if (prev.includes(tag)) {
        return prev.filter(t => t !== tag);
      } else {
        return [...prev, tag];
      }
    });
  };

  // 切换运动类型时重置选择
  const handleTypeChange = (newType: ExerciseType) => {
    setType(newType);
    setSelectedName('');
    setCustomName('');
    // 保留标签选择（因为标签是通用的）
  };

  // 提交表单
  const handleSubmit = () => {
    const name = selectedName || customName.trim();
    if (!name) {
      return;
    }

    const exerciseData = {
      name,
      type,
      tag: selectedTags.length > 0 ? selectedTags.join('、') : undefined,
      plan: plan.trim() || undefined,
      date: getTodayDate(),
    };

    onSubmit(exerciseData);

    // 重置表单
    setSelectedName('');
    setCustomName('');
    setSelectedTags([]);
    setPlan('');
    setType('strength');
    onClose();
  };

  const finalName = selectedName || customName.trim();
  const canSubmit = !!finalName;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
        keyboardVerticalOffset={0}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={onClose}
            activeOpacity={0.7}>
            <Text style={styles.cancelButtonText}>取消</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>添加运动</Text>
          <TouchableOpacity
            style={[
              styles.submitButton,
              !canSubmit && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={!canSubmit}
            activeOpacity={0.7}>
            <Text
              style={[
                styles.submitButtonText,
                !canSubmit && styles.submitButtonTextDisabled,
              ]}>
              完成
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          {/* Exercise Type Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>运动类型</Text>
            <View style={styles.typeGrid}>
              {exerciseTypes.map((item) => (
                <TouchableOpacity
                  key={item.type}
                  style={[
                    styles.typeButton,
                    type === item.type && styles.typeButtonSelected,
                  ]}
                  onPress={() => handleTypeChange(item.type)}
                  activeOpacity={0.7}>
                  <Text style={styles.typeEmoji}>{item.emoji}</Text>
                  <Text
                    style={[
                      styles.typeLabel,
                      type === item.type && styles.typeLabelSelected,
                    ]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Exercise Name Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>运动名称 *</Text>
            <View style={styles.exerciseGrid}>
              {exerciseList.map((exercise) => (
                <TouchableOpacity
                  key={exercise}
                  style={[
                    styles.exerciseTag,
                    selectedName === exercise && styles.exerciseTagSelected,
                  ]}
                  onPress={() => handleSelectExercise(exercise)}
                  activeOpacity={0.7}>
                  <Text
                    style={[
                      styles.exerciseTagText,
                      selectedName === exercise &&
                        styles.exerciseTagTextSelected,
                    ]}>
                    {exercise}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {/* 自定义输入 */}
            <View style={styles.customInputContainer}>
              <Text style={styles.customInputLabel}>或输入自定义名称：</Text>
              <TextInput
                style={[
                  styles.customInput,
                  customName.trim() && styles.customInputActive,
                ]}
                placeholder="输入运动名称..."
                placeholderTextColor="#999"
                value={customName}
                onChangeText={setCustomName}
                onFocus={() => setSelectedName('')} // 聚焦时清除选择
              />
            </View>
          </View>

          {/* Tag Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>部位标签（可选）</Text>
            <View style={styles.tagGrid}>
              {commonTags.map((tag) => (
                <TouchableOpacity
                  key={tag}
                  style={[
                    styles.tagButton,
                    selectedTags.includes(tag) && styles.tagButtonSelected,
                  ]}
                  onPress={() => handleToggleTag(tag)}
                  activeOpacity={0.7}>
                  <Text
                    style={[
                      styles.tagButtonText,
                      selectedTags.includes(tag) &&
                        styles.tagButtonTextSelected,
                    ]}>
                    {tag}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Plan Input */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>训练计划（可选）</Text>
            <TextInput
              style={styles.planInput}
              placeholder="例如：3组×15次、5公里、30分钟..."
              placeholderTextColor="#999"
              value={plan}
              onChangeText={setPlan}
              multiline={false}
            />
          </View>

          {/* Bottom Spacer */}
          <View style={styles.bottomSpacer} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f4f8',
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#6c757d',
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  submitButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#667eea',
  },
  submitButtonDisabled: {
    backgroundColor: '#e9ecef',
  },
  submitButtonText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
  },
  submitButtonTextDisabled: {
    color: '#999',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  typeGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#e9ecef',
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },
  typeButtonSelected: {
    borderColor: '#667eea',
    backgroundColor: '#f0f3ff',
  },
  typeEmoji: {
    fontSize: 36,
    marginBottom: 8,
  },
  typeLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
  },
  typeLabelSelected: {
    color: '#667eea',
  },
  exerciseGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  exerciseTag: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#e9ecef',
  },
  exerciseTagSelected: {
    backgroundColor: '#667eea',
    borderColor: '#667eea',
  },
  exerciseTagText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#495057',
  },
  exerciseTagTextSelected: {
    color: '#ffffff',
    fontWeight: '600',
  },
  customInputContainer: {
    marginTop: 8,
  },
  customInputLabel: {
    fontSize: 13,
    color: '#6c757d',
    marginBottom: 8,
  },
  customInput: {
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#e9ecef',
    borderRadius: 12,
    fontSize: 15,
    color: '#1a1a1a',
    backgroundColor: '#ffffff',
  },
  customInputActive: {
    borderColor: '#667eea',
  },
  tagGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  tagButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#e9ecef',
  },
  tagButtonSelected: {
    backgroundColor: '#f0f3ff',
    borderColor: '#667eea',
  },
  tagButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#495057',
  },
  tagButtonTextSelected: {
    color: '#667eea',
    fontWeight: '600',
  },
  planInput: {
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#e9ecef',
    borderRadius: 12,
    fontSize: 15,
    color: '#1a1a1a',
    backgroundColor: '#ffffff',
  },
  bottomSpacer: {
    height: 40,
  },
});

export default AddExerciseScreen;
