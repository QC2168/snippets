import type { App } from 'vue';

/**
 * 用户权限指令
 * @directive 单个权限验证v-auth="xxx"
 * @directive 多个权限验证，满足一个则显示 v-auths="[xxx,xxx]"
 * @directive 多个权限验证，全部满足则显示 v-auth-all="[xxx,xxx]"
 */
export default function setupAuthDirective(app: App) {
  // 单个权限验证
  // v-auth="xxx"
  app.directive('auth', {
    mounted(el, binding) {
      const pmn = localStorage.getItem('pmn') as unknown as string[];
      if (!pmn.some((v: string) => v === binding.value)) { el.parentNode.removeChild(el); }
    },
  });

  // 多个权限验证，满足一个则显示
  // v-auths="[xxx,xxx]"
  app.directive('auths', {
    mounted(el, binding) {
      const pmn = localStorage.getItem('pmn') as unknown as string[];
      const authList = binding.value || [];
      let hasAuth = false;
      // 遍历权限列表，判断是否有一个权限通过验证
      for (let i = 0; i < authList.length; i += 1) {
        if (pmn.includes(authList[i])) {
          hasAuth = true;
          break;
        }
      }
      if (!hasAuth) el.parentNode.removeChild(el);
    },
  });

  // 多个权限验证，全部满足则显示
  // v-auth-all="[xxx,xxx]"
  app.directive('auth-all', {
    mounted(el, binding) {
      const pmn = localStorage.getItem('pmn') as unknown as string[];
      const authList = binding.value || [];
      let hasAuth = true;
      // 遍历权限列表，判断是否有一个权限通过验证
      for (let i = 0; i < authList.length; i += 1) {
        if (!pmn.includes(authList[i])) {
          hasAuth = false;
          break;
        }
      }
      if (!hasAuth) el.parentNode.removeChild(el);
    },
  });
}
