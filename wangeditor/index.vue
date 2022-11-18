<template>
  <div class="editor-container">
    <div ref="editorToolbar" />
    <div ref="editorContent" :style="{ height }" />
  </div>
</template>

<script setup lang="ts">
import {
  createEditor,
  createToolbar,
  IEditorConfig,
  IToolbarConfig,
  IDomEditor
} from '@wangeditor/editor';
import '@wangeditor/editor/dist/css/style.css';
import { toolbarKeys } from './toolbar';
import { onMounted, ref } from 'vue';

const editorToolbar = ref<string | Element>('');
const editor = ref<IDomEditor>();
const editorContent = ref<string | Element>('');

interface PropsType {
  id: string;
  isDisable: boolean;
  placeholder: string;
  modelValue: string;
  mode: string;
  height: string;
}
const props = withDefaults(defineProps<PropsType>(), {
  // 节点id
  id: 'editor',
  //是否禁用
  isDisable: false,
  placeholder: '请输入内容',
  // https://www.wangeditor.com/v5/getting-started.html#mode-%E6%A8%A1%E5%BC%8F
  // 模式，可选 <default|simple>，默认 default
  mode: 'default',
  // 双向绑定：双向绑定值，字段名为固定，改了之后将不生效
  modelValue: '',
  height: '310px'
});
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

// 富文本配置
const wangeditorConfig = () => {
  const editorConfig: Partial<IEditorConfig> = { MENU_CONF: {} };
  props.isDisable ? (editorConfig.readOnly = true) : (editorConfig.readOnly = false);
  editorConfig.placeholder = props.placeholder;
  editorConfig.onChange = (editor: IDomEditor) => {
    // console.log('content', editor.children);
    // console.log('html', editor.getHtml());
    emit('update:modelValue', editor.getHtml());
  };
  (editorConfig as any).MENU_CONF['uploadImage'] = {
    base64LimitSize: 10 * 1024 * 1024
  };
  return editorConfig;
};
//
const toolbarConfig = () => {
  const toolbarConfig: Partial<IToolbarConfig> = {};
  toolbarConfig.toolbarKeys = toolbarKeys;
  return toolbarConfig;
};
// 初始化富文本
// https://www.wangeditor.com/
const init = () => {
  editor.value = createEditor({
    html: props.modelValue,
    selector: editorContent.value,
    config: wangeditorConfig(),
    mode: props.mode
  });
  createToolbar({
    editor: editor.value,
    selector: editorToolbar.value,
    mode: props.mode,
    config: toolbarConfig()
  });
};
// 页面加载时
onMounted(() => {
  init();
});
</script>
