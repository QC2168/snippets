## Demo

```vue
<template>
  <Scroll class="scrollContent">
    <p v-for="i in 100" :key="i">{{ i }}</p>
  </Scroll>
</template>
<script setup lang="ts">
// 引入组件
import Scroll from "./index.vue";
</script>
<style lang="less" scoped>
.scrollContent {
  // 设置滚动容器高度
  height: 300px;
  overflow: hidden;
}
</style>
```
