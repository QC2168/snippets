<template>
  <div :style="{ height: `${loading ? (props.height + 25) : props.height}px` }">
    <el-upload
      v-loading="loading"
      :style="{
        width: props.width + 'px',
        height: props.height + 'px'
      }"
      :class="`flex justify-center items-center`"
      drag
      :show-file-list="false"
      :on-error="uploadErrorFn"
      :on-success="handleSuccess"
      :before-upload="beforeUpload"
      :http-request="uploadImgFn.req"
    >
      <div
        :class="`flex justify-center items-center`"
        :style="{ width: props.width + 'px', height: props.height + 'px' }"
      >
        <img
          v-if="props.modelValue"
          :src="props.modelValue"
          :class="`object-contain`"
          :style="{ width: props.width + 'px', height: props.height + 'px' }"
        />
        <div v-else>
          <el-icon>
            <Plus />
          </el-icon>
          <p class="text-sm text-gray-400">点击添加图片</p>
          <p v-show="props.desc" class="text-sm text-red-600">{{ props.desc }}</p>
        </div>
      </div>
    </el-upload>
    <div v-if="loading" class="h-8 my-1" :style="{ width: props.width + 'px' }">
      <el-progress :text-inside="true" :stroke-width="15" :percentage="uploadImgPercent" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { watch } from 'vue';
import { Plus } from '@element-plus/icons-vue';
import useUploadImage from './useUploadImage';
import uploadFn from './uploadFn';

interface Props {
  modelValue: string | undefined;
  width?: number;
  height?: number;
  desc?: string;
}

const props = withDefaults(defineProps<Props>(), {
  width: 150,
  height: 150
});

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
  width: v-bind('props.width') + px !important;
  height: v-bind('props.height') + px !important;
}
:deep(.el-upload) {
  @apply p-0 flex justify-center items-center;
  width: v-bind('props.width') + px !important;
  height: v-bind('props.height') + px !important;
}
</style>
