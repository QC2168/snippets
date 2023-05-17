/* eslint-disable no-async-promise-executor */
import * as qs from 'qs';

const isHttpURL = /^https?:\/\//i;
interface HttpConfig {
    // 请求URL的前缀，如果传入的url不为完整路径时会自动拼接此参数
    baseURL?: string;
    // 请求参数，最终会拼接在URL上
    params?: URLSearchParams | object;
    // params不是URLSearchParams类型时，使用此方法序列化为字符串
    paramsSerializer?: (params: any) => string
    // 请求体，属性禁止传值
    readonly body?: BodyInit | null;
    // 提交的数据，最终会被处理为对应的格式，放在body中
    data?: FormData | URLSearchParams | object | string,
    // 序列化data的方法，只有当data的类型不为FormData和URLSearchParams时，并且请求方式指定为表单提交时执行
    dataSerializer?: (params: any) => string
    // 请求头
    headers?: HeadersInit;
    // 请求方式
    method?: string;
    // 返回值类型
    responseType?: 'arrayBuffer' | 'blob' | 'formData' | 'json' | 'text';
}

export interface ResponseResult<T = any> {
    code: number;
    message?: string;
    data?: T
}

const fetchUtil = {
  create: (config?: HttpConfig) => {
    let interceptorRequest: (init: RequestInit) => RequestInit;
    let interceptorResponse: (result: ResponseResult) => ResponseResult | Promise<ResponseResult>;
    let interceptorResponseErr: (reason: string) => string;
    const baseConfig = config;

    // 最终请求时使用的函数
    const customFetch = <T = any>(input: RequestInfo | URL, init: RequestInit, responseType?: 'arrayBuffer' | 'blob' | 'formData' | 'json' | 'text'):Promise<ResponseResult<T>> => {
      // 在这里可以对所有请求进行拦截处理
      const cfg = interceptorRequest(init);
      return new Promise(async (resolve, reject) => {
        // 发起fetch请求，网络错误不会出现异常，需要在下面进行处理
        const response: Response = await fetch(input, cfg);
        if (response.ok) {
          // 表示网络上请求成功了，也就是http请求是成功了，但是具体的业务层是否成功后续根据正文中的code判断
          let result: ResponseResult;
          if (responseType === 'arrayBuffer') {
            result = {
              code: 200,
              data: await response.arrayBuffer(),
            };
          } else if (responseType === 'blob') {
            result = {
              code: 200,
              data: await response.blob(),
            };
          } else if (responseType === 'formData') {
            result = {
              code: 200,
              data: await response.formData(),
            };
          } else if (responseType === 'text') {
            result = {
              code: 200,
              data: await response.text(),
            };
          } else {
            result = await response.json();
          }
          // 此处进行响应拦截处理
          resolve(interceptorResponse(result));
        } else {
          reject(interceptorResponseErr(response.statusText));
        }
      });
    };

    /**
         *
         * @param url url
         * @param init 初始参数，优先级比全局的更高
         */
    function request<T>(url: string, init?: HttpConfig): Promise<ResponseResult<T>> {
      const config = {
        ...baseConfig,
        ...init,
      };
      // 转换为Headers类型，方便操作
      const headers: Headers = new Headers(config?.headers);
      if (config.data instanceof FormData) {
        // 上传文件时的类型
        headers.set('content-type', 'form-data/multipart');
        config.headers = headers;
        config.body = config.data;
      } else if (config.data instanceof URLSearchParams) {
        // 表单提交
        headers.set('content-type', 'application/x-www-form-urlencoded');
        config.headers = headers;
        // URLSearchParams转字符串
        config.body = config.data.toString();
      } else {
        const contentType = headers.get('content-type');
        if (contentType === 'application/x-www-form-urlencoded') {
          // 表单提交
          if (config.dataSerializer) {
            config.body = config.dataSerializer(config.data);
          } else {
            config.body = qs.stringify(config.data, { allowDots: true });
          }
        } else if (contentType === 'application/json') {
          config.body = JSON.stringify(config.data);
        }
      }
      // 获取URL和query参数
      const [URLAddress, params] = url.split('?');
      // url上的参数
      const urlSearchParams = new URLSearchParams(params);
      let queryString = urlSearchParams.toString();
      let paramStr;
      let replaceRequestURL;
      if (config.params instanceof URLSearchParams) {
        paramStr = config.params.toString();
      } else if (config.paramsSerializer) {
        // 将params参数转字符串
        paramStr = config.paramsSerializer(config.params) || '';
      } else {
        paramStr = qs.stringify(config.params, { allowDots: true }) || '';
      }
      if (queryString && paramStr) {
        queryString = `${queryString}&${paramStr}`;
      } else {
        queryString += paramStr;
      }
      if (queryString) {
        replaceRequestURL = `${URLAddress}?${queryString}`;
      }
      if (isHttpURL.test(URLAddress)) {
        return customFetch(URLAddress, config, config.responseType);
      }
      if (config.baseURL) {
        replaceRequestURL = config.baseURL + URLAddress;
      }
      return customFetch(replaceRequestURL ?? URLAddress, config, config.responseType);
    }

    // request.get=<T=any>(url: string, params?: URLSearchParams | object, init?: HttpConfig) Promise<ResponseResult<T>>=> {
    //   return request<T>(url, {
    //     ...init,
    //     params,
    //     method: 'GET',
    //     body: undefined,
    //   });
    // };
    // request.post = <T>(url: string, data?: FormData | URLSearchParams | object | string, init?: HttpConfig) Promise<ResponseResult<T>> =>{
    //   return request<T>(url, {
    //     ...init,
    //     data,
    //     method: 'POST',
    //   });
    // };

    // request.delete = function <T> (url: string, params?: URLSearchParams | object, init?: HttpConfig): Promise<ResponseResult<T>> {
    //   return request<T>(url, {
    //     ...init,
    //     params,
    //     method: 'DELETE',
    //   });
    // };
    // request.put = function <T> (url: string, data?: FormData | URLSearchParams | object | string, init?: HttpConfig): Promise<ResponseResult<T>> {
    //   return request<T>(url, {
    //     ...init,
    //     data,
    //     method: 'PUT',
    //   });
    // };

    request.interceptors = {
      request: {
        use(callback: (init: RequestInit) => RequestInit) {
          interceptorRequest = callback;
        },
      },
      response: {
        use(callback1: (result: ResponseResult) => ResponseResult | Promise<ResponseResult>, callback2: (reason: string) => string) {
          interceptorResponse = callback1;
          interceptorResponseErr = callback2;
        },
      },
    };
    return request;
  },
};
export default fetchUtil;
