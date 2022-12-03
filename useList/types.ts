export interface MessageType {
  GET_DATA_IF_FAILED?: string;
  GET_DATA_IF_SUCCEED?: string;
  EXPORT_DATA_IF_FAILED?: string;
  EXPORT_DATA_IF_SUCCEED?: string;
}
export interface OptionsType {
  requestError?: () => void;
  requestSuccess?: () => void;
  exportError?: () => void;
  exportSuccess?: () => void;
  message: MessageType;
}
