import { onMounted, ref, unref, watch } from "vue";
import { errorMessage } from "../message";
import { MessageType, OptionsType, ResponseDataType } from "./types";

const DEFAULT_MESSAGE: MessageType = {
  GET_DATA_IF_FAILED: "获取列表数据失败",
  EXPORT_DATA_IF_FAILED: "导出数据失败",
};

export default function useList<
  T extends (...args: any) => Promise<ResponseDataType<any>>
>(listRequestFn: T, options: OptionsType = {}) {
  const {
    immediate = true,
    preRequest,
    message = DEFAULT_MESSAGE,
    filterOption = ref(),
    exportRequestFn = undefined,
    transformFn = undefined,
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
  const list = ref<Awaited<ReturnType<typeof listRequestFn>>["data"]>([]);
  const reset = () => {
    if (!filterOption.value) return;
    const keys = Reflect.ownKeys(filterOption.value);
    keys.forEach((key) => {
      Reflect.set(filterOption.value!, key, undefined);
    });
    loadData();
  };

  const loadData = (page = curPage.value, size = pageSize.value) => {
    // 兼容page可能是event
		if (typeof page === 'object') {
			page = unref(curPage);
		}
    return new Promise(async (resolve, reject) => {
      loading.value = true;
      try {
        preRequest?.();
        const result = await listRequestFn(size, page, filterOption.value);
        const transformResult = transformFn ? transformFn(result) : result;
        let data = transformResult.data;
        let count =
          "meta" in transformResult
            ? transformResult.meta.total
            : "total" in transformResult
            ? transformResult.total
            : 0;
        list.value = data;
        total.value = count;
        options?.requestSuccess?.();
        resolve({
          list: data,
          total: count,
        });
      } catch (error) {
        GET_DATA_IF_FAILED && errorMessage(GET_DATA_IF_FAILED);
        options?.requestError?.();
      } finally {
        loading.value = false;
      }
    });
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
    reset,
    pageSize,
    exportFile,
    loadData,
  };
}
