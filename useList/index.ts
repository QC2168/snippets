import { Ref } from 'vue';
import showMessage from '/@/utils/message';
const DEFAULT_MESSAGE = {
  GET_DATA_IF_FAILED: '获取列表数据失败',
  GET_DATA_IF_SUCCEED: '获取列表数据成功',
  EXPORT_DATA_IF_FAILED: '导出数据失败'
};
export default function useList<ItemType extends Object, FilterOption extends Object>(
  listRequest: Function,
  filterOption: Ref<Object>,
  exportRequest?: Function
) {
  // 加载态
  const loading = ref(false);
  // 当前页
  const curPage = ref(1);
  // 总
  const total = ref(0);
  // 分页大小
  const pageSize = ref(10);
  // 数据
  const list = ref<ItemType[]>([]);
  // 过滤数据
  const reload = () => {
    loadData();
  };
  const reset = () => {
    if (!filterOption.value) return;
    const keys = Reflect.ownKeys(filterOption.value);
    filterOption.value = {} as FilterOption;
    keys.forEach((key) => {
      Reflect.set(filterOption.value!, key, undefined);
    });
    loadData();
  };
  const filter = () => {
    loadData();
  };

  const loadData = async (page = curPage.value) => {
    loading.value = true;
    try {
      const {
        data,
        meta: { total: count }
      } = await listRequest(pageSize.value, page, filterOption.value);
      list.value = data;
      total.value = count;
    } catch (error) {
      showMessage(DEFAULT_MESSAGE.GET_DATA_IF_FAILED, 'error');
    } finally {
      loading.value = false;
    }
  };
  const exportFile = async () => {
    if (!exportRequest) {
      throw new Error('当前没有提供exportRequest函数');
    }
    try {
      const {
        data: { link }
      } = await exportRequest(filterOption.value);
      window.open(link);
    } catch (error) {
      showMessage(DEFAULT_MESSAGE.EXPORT_DATA_IF_FAILED, 'error');
    }
  };
  watch([curPage, pageSize], () => {
    loadData(curPage.value);
  });
  onMounted(() => {
    loadData(curPage.value);
  });
  return {
    loading,
    curPage,
    total,
    list,
    filterOption,
    reload,
    reset,
    filter,
    pageSize,
    exportFile,
    loadData
  };
}