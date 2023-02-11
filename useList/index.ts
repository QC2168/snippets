import { onMounted, ref, Ref, watch } from "vue";
import { errorMessage } from "../message";
import { MessageType, OptionsType } from "./types";

// Api接口类型
export interface ResponseDataType<T = any> {
  data: T;
  meta: { total: number }
}


const DEFAULT_MESSAGE: MessageType = {
  GET_DATA_IF_FAILED: "获取列表数据失败",
  EXPORT_DATA_IF_FAILED: "导出数据失败",
};

export default function useList<T extends (...args:any)=>Promise<ResponseDataType<any>>>(
  listRequestFn: T,
  options: OptionsType = {}
) {
  const {
    immediate = true,
    preRequest,
    message = DEFAULT_MESSAGE,
    filterOption = ref(),
    exportRequestFn = undefined,
  } = options;
  const { GET_DATA_IF_FAILED, EXPORT_DATA_IF_FAILED } = message;
  // 加载态
  const loading = ref(false);
  // 当前页
  const curPage = ref(1);
  // 总
  const total = ref(0);
  // 分页大小
  const pageSize = ref(10);
  // 数据
  const list = ref<Awaited<ReturnType<typeof listRequestFn>>['data']>([]);
  // 过滤数据
  const reload = () => {
    loadData();
  };
  const reset = () => {
    if (!filterOption.value) return;
    const keys = Reflect.ownKeys(filterOption.value);
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
      preRequest?.();
      const {
        data,
        meta: { total: count },
      } = await listRequestFn(pageSize.value, page, filterOption.value);
      list.value = data;
      total.value = count;
      options?.requestSuccess?.();
    } catch (error) {
      GET_DATA_IF_FAILED && errorMessage(GET_DATA_IF_FAILED);
      options?.requestError?.();
    } finally {
      loading.value = false;
    }
  };

  const exportFile = async () => {
    if (!exportRequestFn && typeof exportRequestFn !== "function") {
      throw new Error("当前没有提供exportRequest函数");
    }
    try {
      const {
        data: { link },
      } = await exportRequestFn(filterOption.value);
      window.open(link);
      options?.exportSuccess?.();
    } catch (error) {
      EXPORT_DATA_IF_FAILED && errorMessage(EXPORT_DATA_IF_FAILED);
      options?.exportError?.();
    }
  };

  // 监听分页数据改变
  watch([curPage, pageSize], () => {
    loadData(curPage.value);
  });

  onMounted(() => {
    if (immediate) {
      loadData(curPage.value);
    }
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
    loadData,
  };
}
