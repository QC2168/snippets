// copy from https://github.com/vbenjs/vue-vben-admin/blob/main/src/hooks/web/useSortable.ts

import { nextTick, unref } from 'vue';
import type { Ref } from 'vue';

export default function useSortable(el: HTMLElement | Ref<HTMLElement>, options?: any) {
  function initSortable() {
    nextTick(async () => {
      if (!el) return;

      const Sortable = (await import('sortablejs')).default;
      Sortable.create(unref(el), {
        animation: 500,
        delay: 400,
        delayOnTouchOnly: true,
        ...options,
      });
    });
  }

  return { initSortable };
}
