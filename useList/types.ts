import { Ref } from "vue";

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
  exportRequestFn?: Function;
  message: MessageType;
  preRequest?: Function;
  immediate?: boolean;
}
