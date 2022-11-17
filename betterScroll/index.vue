<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import BScroll from "@better-scroll/core";
import { nextTick, onMounted, ref } from "vue";

let scroll: InstanceType<typeof BScroll>;
let wrapper = ref<HTMLElement>();
const emit = defineEmits<{
  (e: "scroll", pos: string): void;
  (e: "scrollToEnd"): void;
  (e: "beforeScroll"): void;
  (e: "pulldown"): void;
}>();
// 禁止滚动
const disable = () => {
  scroll.disable();
};
// 开启滚动
const enable = () => {
  scroll.enable();
};
// 刷新滚动
const refresh = () => {
  scroll.refresh();
};
defineExpose({
  disable,
  enable,
  refresh,
});
interface PropsType {
  probeType: 1 | 2 | 3;
  click: boolean;
  scrollX: boolean;
  listenScroll: boolean;
  pullup: boolean;
  pulldown: boolean;
  beforeScroll: boolean;
  refreshDelay: number;
}
const props = withDefaults(defineProps<PropsType>(), {
  /**
   * 1 滚动的时候会派发scroll事件，会截流。
   * 2 滚动的时候实时派发scroll事件，不会截流。
   * 3 除了实时派发scroll事件，在swipe的情况下仍然能实时派发scroll事件
   */
  probeType: 3,
  /**
   * 点击列表是否派发click事件
   */
  click: true,
  /**
   * 是否开启横向滚动
   */
  scrollX: false,
  /**
   * 是否派发滚动事件
   */
  listenScroll: false,
  /**
   * 是否派发滚动到底部的事件，用于上拉加载
   */
  pullup: false,
  /**
   * 是否派发顶部下拉的事件，用于下拉刷新
   */
  pulldown: false,
  /**
   * 是否派发列表滚动开始的事件
   */
  beforeScroll: false,
  /**
   * 当数据更新后，刷新scroll的延时。
   */
  refreshDelay: 20,
});

onMounted(() => {
  nextTick(() => {
    // 保证在DOM渲染完毕后初始化better-scroll
    scroll = new BScroll(wrapper.value!, {
      probeType: props.probeType,
      click: props.click,
      scrollX: props.scrollX,
      mouseWheel: true,
      nestedScroll: {
        groupId: "vertical-nested-scroll",
      },
    });
    // 是否派发滚动事件
    if (props.listenScroll) {
      scroll.on("scroll", (pos: string) => {
        emit("scroll", pos);
      });
    }
    // 是否派发滚动到底部事件，用于上拉加载
    if (props.pullup) {
      scroll.on("scrollEnd", () => {
        // 滚动到底部
        if (scroll.y <= scroll.value.maxScrollY + 50) {
          emit("scrollToEnd");
        }
      });
    }

    // 是否派发顶部下拉事件，用于下拉刷新
    if (props.pulldown) {
      scroll.on("touchend", (pos: { y: number }) => {
        // 下拉动作
        if (pos.y > 50) {
          emit("pulldown");
        }
      });
    }

    // 是否派发列表滚动开始的事件
    if (props.beforeScroll) {
      scroll.on("beforeScrollStart", () => {
        emit("beforeScroll");
      });
    }
  });
});

defineExpose({
  BScroll,
});
</script>

<style scoped></style>
