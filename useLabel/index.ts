import { CascaderOption } from 'element-plus';
import { ref, onMounted } from 'vue';

export default function ueLabel(requestApi:()=>Promise<CascaderOption[]>) {
  const list = ref<CascaderOption[]>([]);
  const load = async () => {
    const data = await requestApi();
    list.value = data;
  };
  onMounted(async () => {
    await load();
  });
  return {
    list,
    load,
  };
}
