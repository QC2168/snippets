import { UploadProps, UploadRequestOptions } from 'element-plus';
import { ref } from 'vue';
import { error } from 'console';
import { message, errorMessage } from '../message';

// 根据需求，自行扩展
export type apiType<T = any> = (
  cb?: (percent: number) => void,
  signal?: AbortSignal
) => {
  req: (opt:UploadRequestOptions) => Promise<T>;
  updateSignal: (signal: AbortSignal) => void;
};

export default function useUploadImage(api: apiType) {
  // 控制上传
  const controller = ref(new AbortController());
  // 上传百分比
  const percent = ref(0);
  // 加载态
  const isLoading = ref(false);
  // 图片地址
  const image = ref('');

  const uploadProgress = (p: number) => {
    isLoading.value = true;
    percent.value = p;
    if (p >= 100) {
      message('图片发送上传成功');
    }
  };

  const uploadImgFn = api(uploadProgress, controller.value.signal);

  const handleSuccess: UploadProps['onSuccess'] = (response) => {
    percent.value = 0;
    isLoading.value = false;
    // 请根据后端返回的数据进行处理，将对应的图片地址存放到imageRef中
    image.value = response;
  };
  // 终止上传图片
  const abort = () => {
    controller.value.abort();
    isLoading.value = false;
    percent.value = 0;
    controller.value = new AbortController();
    uploadImgFn.updateSignal(controller.value.signal);
  };
  const uploadErrorFn = (err: Error) => {
    error(err);
    errorMessage('图片上传失败');
    isLoading.value = false;
  };

  // 上传前钩子
  const beforeUpload: UploadProps['beforeUpload'] = (rawFile) => {
    if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png') {
      errorMessage('图片必须是JPG/PNG格式');
      return false;
    }
    if (rawFile.size > 1024 * 1000 * 2) {
      errorMessage('图片大小不能超过2MB');
      return false;
    }
    uploadImgFn.updateSignal(controller.value.signal);
    isLoading.value = true;
    return true;
  };

  return {
    uploadImgFn,
    percent,
    image,
    isLoading,
    uploadErrorFn,
    beforeUpload,
    handleSuccess,
    abort,
    controller,
  };
}
