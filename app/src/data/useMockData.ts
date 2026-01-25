/**
 * 测试数据 Hook
 * 
 * 使用方法：
 * import {useMockData} from '../data/useMockData';
 * 
 * function MyComponent() {
 *   const {loadMockData, clearMockData} = useMockData();
 *   
 *   return (
 *     <View>
 *       <Button title="加载测试数据" onPress={loadMockData} />
 *       <Button title="清除测试数据" onPress={clearMockData} />
 *     </View>
 *   );
 * }
 */

import {useSportStore} from '../store';

/**
 * Hook 版本（推荐在组件中使用）
 * 返回加载和清除测试数据的方法
 */
export function useMockData() {
  const {loadMockData, clearMockData} = useSportStore();
  return {loadMockData, clearMockData};
}
