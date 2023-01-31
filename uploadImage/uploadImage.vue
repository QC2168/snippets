<template>
  <div>
    <el-upload
      v-loading="loading"
      class="w-[100px] h-[100px] flex justify-center items-center"
      drag
      :show-file-list="false"
      :on-error="uploadErrorFn"
      :on-success="handleSuccess"
      :before-upload="beforeUpload"
      :http-request="uploadImgFn.req"
    >
      <div class="w-[100px] h-[100px] flex justify-center items-center">
        <img
          v-if="props.modelValue"
          :src="props.modelValue"
          class="w-[100px] h-[100px] object-contain"
        />
        <div v-else>
          <el-icon>
            <Plus />
          </el-icon>
          <p class="text-sm text-gray-400">点击添加图片</p>
        </div>
      </div>
    </el-upload>
    <div v-if="loading" class="h-20 my-1 w-[100px]">
      <el-progress :text-inside="true" :stroke-width="15" :percentage="uploadImgPercent" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { Plus } from '@element-plus/icons-vue';
import { watch } from 'vue';
import useUploadImage from './useUploadImage';
import uploadFn from './uploadFn';
const props = defineProps<{
  modelValue: string | undefined;
}>();
const emits = defineEmits<{
  (e: 'update:modelValue', url: string): void;
}>();
const {
  uploadImgFn,
  percent: uploadImgPercent,
  isLoading: loading,
  uploadErrorFn,
  image,
  abort,
  beforeUpload,
  handleSuccess
} = useUploadImage(uploadFn);

watch(image, (newVal) => {
  emits('update:modelValue', newVal);
});

defineExpose({
  abort,
  image
});
</script>
<style lang="scss" scoped>
:deep(.el-upload-dragger) {
  @apply p-0 flex justify-center items-center;
  width: 100px !important;
  height: 100px !important;
}
:deep(.el-upload) {
  @apply p-0 flex justify-center items-center;
  width: 100px !important;
  height: 100px !important;
}
</style>
