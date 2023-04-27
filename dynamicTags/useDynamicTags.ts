import { ref, nextTick, unref } from 'vue';
import { pullAt } from 'lodash-es';
import { error } from 'console';
import { warningMessage, errorMessage } from '../message';

export interface OptionsType {
  requestFn?: (name:string)=>any;
  submitFn?: (tags:string[])=>any;
}

export default function useDynamicTags(opt: OptionsType) {
  const { requestFn, submitFn } = opt;

  // 当前标签
  const tags = ref<string[]>([]);
  // 是否显示输入框
  const inputTagVisible = ref(false);
  // 输入框元素
  const InputTagRef = ref();
  // 输入框值
  const inputTagValue = ref<string>('');
  // 提交标签
  const submitTags = () => {
    if (typeof submitFn === 'function') {
      try {
        submitFn(unref(tags));
      } catch {
        error('执行submitFn出错');
      }
    }
  };
  // 移除标签
  const handleCloseTag = (item: string) => {
    if (!tags.value) return;
    const idx = tags.value.findIndex((i) => item === i);
    pullAt(tags.value, idx);
    submitTags();
  };
  // 添加标签
  const handleInputConfirm = () => {
    const val = inputTagValue.value.trim();
    if (val) {
      if (tags.value && Array.isArray(tags.value)) {
        //  检测重复
        if (tags.value.includes(val)) {
          warningMessage('重复的标签添加');
        } else {
          tags.value.push(val);
        }
      } else {
        tags.value = [val];
      }
      // 提交
      submitTags();
    }
    inputTagVisible.value = false;
  };

  // 显示输入框
  const handleAddTags = () => {
    inputTagValue.value = '';
    inputTagVisible.value = true;
    nextTick(() => {
      InputTagRef.value?.focus();
    });
  };

  // 查询数据
  const querySearchAsync = async (queryString: string, cb: any) => {
    if (typeof requestFn !== 'function') {
      cb([]);
      return;
    }
    try {
      const { data } = await requestFn(queryString);
      cb(data);
    } catch (error) {
      errorMessage('搜索失败');
    }
  };
  const handleInputSelect = () => {
    handleInputConfirm();
  };

  return {
    tags,
    inputTagVisible,
    inputTagValue,
    handleCloseTag,
    querySearchAsync,
    handleInputSelect,
    handleInputConfirm,
    handleAddTags,
  };
}
