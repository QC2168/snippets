import { Ref } from "vue";
// Api接口类型
export interface ResponseDataType<T = any> {
  data: T;
  meta: { total: number }
}

export interface ExportLinkType{
  link: string
}

export interface MessageType {
  GET_DATA_IF_FAILED?: string;
  GET_DATA_IF_SUCCEED?: string;
  EXPORT_DATA_IF_FAILED?: string;
  EXPORT_DATA_IF_SUCCEED?: string;
}
export interface OptionsType<T = any> {
  requestError?: () => void;
  requestSuccess?: () => void;
  exportError?: () => void;
  exportSuccess?: () => void;
  filterOption?: Ref<T>;
  transformFn?: (...args) => any;
  exportRequestFn?: (...args:any)=>Promise<ResponseDataType<ExportLinkType>>;
  message?: MessageType;
  preRequest?: Function;
  immediate?: boolean;
}
