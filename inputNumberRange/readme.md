
## e.g.
```vue
<template>
    <inputNumberRange
    v-model="value"
    min-placeholder="最小值"
    max-placeholder="最大值"
    />
</template>
<script setup>
// import cmp
import inputNumberRange from '@/lib/components/inputNumberRange.vue';

const value=ref('')
</script>
```