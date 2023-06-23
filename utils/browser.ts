// copy from https://github.com/element-plus/element-plus/blob/dev/packages/utils/browser.ts

import { isClient, isIOS } from '@vueuse/core';

export const isFirefox = (): boolean => isClient && /firefox/i.test(window.navigator.userAgent);

export { isClient, isIOS };
