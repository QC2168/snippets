const BASE_URL = 'API BASE URL';

export interface CommonResponseType<T = any> {
 /**
  * 返回码
  */
 code : number;
 /**
  * 返回数据
  */
 data : T;
 /**
  * 返回消息
  */
 message ?: string;
 /**
  * 是否成功
  */
 success ?: boolean;
}

interface RequestOption {
 url : string;
 method ?: 'POST' | 'GET' | 'PUT' | 'GET' | 'CONNECT' | 'HEAD' | 'OPTIONS' | 'TRACE';
 data ?: any;
 header ?: any;
 timeout ?: number;
}

interface ResponseType<T = any> {
 data : T;
 statusCode : number;
 header : Record<'string', 'string'>;
 cookies : Array<string>;
}

const request = <T = unknown>(options : RequestOption) : Promise<CommonResponseType<T>> => new Promise((resolve, reject) => {
  const {
    url, method = 'GET', data, header, timeout = 1000 * 5,
  } = options;
  uni.request({
    url: BASE_URL + url,
    method,
    data,
    timeout,
    header,
    success: (res : ResponseType<CommonResponseType<T>>) => {
      resolve(res.data);
    },
    fail: (err : Error) => {
      reject(err);
    },
  });
});

// export
export default request;
