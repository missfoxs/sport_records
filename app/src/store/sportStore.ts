import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dayjs from '../utils/dayjs';
import {nanoid} from 'nanoid';
import type {Task, Record, PeriodType, ExerciseType} from '../types';

/**
 * Store 状态接口
 */
interface SportStore {
  // 状态
  tasks: Task[];
  records: Record[];
  period: PeriodType; // 当前选择的周期（本周/本月/今年）

  // Actions - 任务管理
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'done'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void; // 切换任务完成状态，同时更新 records

  // Actions - 记录管理
  addRecord: (taskId: string, task: Task) => void;
  removeRecord: (taskId: string, date: string) => void;

  // Actions - 周期切换
  setPeriod: (period: PeriodType) => void;

  // Actions - 数据清理
  clearAllData: () => void;
}

/**
 * 创建任务快照（用于 Record）
 */
function createTaskSnapshot(task: Task): Record['taskSnapshot'] {
  return {
    name: task.name,
    type: task.type,
    tag: task.tag,
    plan: task.plan,
  };
}

/**
 * 获取今天的日期字符串
 */
function getTodayDate(): string {
  return dayjs().format('YYYY-MM-DD');
}

/**
 * 获取当前时间 ISO 字符串
 */
function getNowISO(): string {
  return dayjs().toISOString();
}

/**
 * Zustand Store with AsyncStorage persistence
 */
export const useSportStore = create<SportStore>()(
  persist(
    (set, get) => ({
      // 初始状态
      tasks: [],
      records: [],
      period: 'week',

      // 添加任务
      addTask: (taskData) => {
        const newTask: Task = {
          ...taskData,
          id: nanoid(),
          done: false,
          createdAt: getNowISO(),
        };

        set((state) => ({
          tasks: [...state.tasks, newTask],
        }));
      },

      // 更新任务
      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? {...task, ...updates} : task,
          ),
        }));
      },

      // 删除任务
      deleteTask: (id) => {
        set((state) => {
          // 同时删除相关的 records
          const task = state.tasks.find((t) => t.id === id);
          const newRecords = task
            ? state.records.filter((r) => r.taskId !== id)
            : state.records;

          return {
            tasks: state.tasks.filter((task) => task.id !== id),
            records: newRecords,
          };
        });
      },

      // 切换任务完成状态
      toggleTask: (id) => {
        const state = get();
        const task = state.tasks.find((t) => t.id === id);

        if (!task) return;

        const today = getTodayDate();
        const isDone = task.done;

        if (isDone) {
          // 取消完成：更新 task.done，删除对应的 record
          set((state) => ({
            tasks: state.tasks.map((t) =>
              t.id === id ? {...t, done: false} : t,
            ),
            records: state.records.filter(
              (r) => !(r.taskId === id && r.date === today),
            ),
          }));
        } else {
          // 完成：更新 task.done，添加 record
          const newRecord: Record = {
            id: nanoid(),
            taskId: id,
            date: today,
            taskSnapshot: createTaskSnapshot(task),
            completedAt: getNowISO(),
          };

          set((state) => ({
            tasks: state.tasks.map((t) =>
              t.id === id ? {...t, done: true} : t,
            ),
            records: [...state.records, newRecord],
          }));
        }
      },

      // 添加记录（手动添加，不通过 toggleTask）
      addRecord: (taskId, task) => {
        const today = getTodayDate();
        const newRecord: Record = {
          id: nanoid(),
          taskId,
          date: today,
          taskSnapshot: createTaskSnapshot(task),
          completedAt: getNowISO(),
        };

        set((state) => ({
          records: [...state.records, newRecord],
        }));
      },

      // 删除记录
      removeRecord: (taskId, date) => {
        set((state) => ({
          records: state.records.filter(
            (r) => !(r.taskId === taskId && r.date === date),
          ),
        }));
      },

      // 设置周期
      setPeriod: (period) => {
        set({period});
      },

      // 清空所有数据
      clearAllData: () => {
        set({
          tasks: [],
          records: [],
          period: 'week',
        });
      },
    }),
    {
      name: 'sport-store', // AsyncStorage key
      storage: createJSONStorage(() => AsyncStorage),
      // 只持久化 tasks 和 records，period 可以重置
      partialize: (state) => ({
        tasks: state.tasks,
        records: state.records,
        period: state.period,
      }),
    },
  ),
);
