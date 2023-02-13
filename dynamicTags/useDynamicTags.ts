import { CascaderOption } from "element-plus";
import { ref, nextTick } from "vue";
import { warningMessage, errorMessage } from "../message";
import { pullAt } from "lodash-es";

export default function useDynamicTags(requestFn: any) {
  // 当前标签
  const tags = ref<string[]>();
  // 是否显示输入框
  const inputTagVisible = ref(false);
  // 输入框元素
  const InputTagRef = ref();
  // 输入框值
  const inputTagValue = ref<string>("");

  // 移除标签
  const handleCloseTag = (item: string) => {
    if (!tags.value) return;
    let idx = tags.value.findIndex((i) => item === i);
    pullAt(tags.value, idx);
  };
  // 添加标签
  const handleInputConfirm = () => {
    let val = inputTagValue.value.trim()
    if (val) {
      if (tags.value && Array.isArray(tags.value)) {
        //  检测重复
        if (tags.value.includes(val)) {
          warningMessage("重复的标签添加");
        } else {
          tags.value.push(val);
        }
      } else {
        tags.value = [val];
      }
    }
    inputTagVisible.value = false;
  };

  // 显示输入框
  const handleAddTags = () => {
    inputTagValue.value = "";
    inputTagVisible.value = true;
    nextTick(() => {
      InputTagRef.value?.focus();
    });
  };

  // 查询数据
  const querySearchAsync = async (queryString: string, cb: any) => {
    try {
      const { data } = await requestFn(queryString);
      cb(data);
    } catch (error) {
      errorMessage("搜索失败");
    }
  };
  const handleInputSelect = (item: CascaderOption) => {
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
