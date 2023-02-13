<template>
  <el-tag
    v-for="tag in tags"
    :key="tag"
    class="mx-1"
    closable
    :disable-transitions="false"
    @close="handleCloseTag(tag)"
  >
    {{ tag }}
  </el-tag>
  <el-autocomplete
    v-if="inputTagVisible"
    ref="InputTagRef"
    v-model="inputTagValue"
    :fetch-suggestions="querySearchAsync"
    value-key="label"
    class="!w-36"
    placeholder="搜索/添加标签"
    @select="handleInputSelect"
    @keyup.enter="handleInputConfirm"
    @blur="handleInputConfirm"
  />
  <el-button
    v-else
    class="button-new-tag ml-1"
    size="small"
    @click="handleAddTags"
  >
    新增标签
  </el-button>
</template>
<script setup lang="ts">
import useDynamicTags from "./useDynamicTags";

function requestTag() {
  return new Promise((resolve) => {
    resolve(["tag1", "tag2"]);
  });
}

const {
  tags,
  inputTagVisible,
  inputTagValue,
  handleCloseTag,
  querySearchAsync,
  handleInputSelect,
  handleInputConfirm,
  handleAddTags,
} = useDynamicTags(requestTag);

</script>
<style lang="less" scoped></style>
