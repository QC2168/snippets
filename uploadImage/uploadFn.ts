import axios from "axios";
import { UploadRequestOptions } from "element-plus";

// 图片上传接口，根据项目页面自行调整
export default (
    cb?: (percent: number) => void,
    signal?: AbortSignal
  ) => {
    let _signal = signal;
    return {
      req: ({ file }: UploadRequestOptions) => {
        return axios.request<string>({
          url: '/upload',
          method: 'post',
          data: {
            file
          },
          signal: _signal,
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: (progressEvent) => {
            let percent = ((progressEvent.loaded / progressEvent.total!) * 100) | 0;
            cb && cb(percent);
          },
          timeout: 1000 * 60 * 2
        });
      },
      updateSignal: (signal: AbortSignal) => {
        _signal = signal;
      }
    };
  };
