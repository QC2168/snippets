import * as qs from "qs";

interface HttpConfig {
    //请求URL的前缀，如果传入的url不为完整路径时会自动拼接此参数
    baseURL?: string;
    //请求参数，最终会拼接在URL上
    params?: URLSearchParams | object;
    //params不是URLSearchParams类型时，使用此方法序列化为字符串
    paramsSerializer?: (params: any) => string
    //请求体，属性禁止传值
    readonly body?: BodyInit | null;
    //提交的数据，最终会被处理为对应的格式，放在body中
    data?: FormData | URLSearchParams | object | string,
    //序列化data的方法，只有当data的类型不为FormData和URLSearchParams时，并且请求方式指定为表单提交时执行
    dataSerializer?: (params: any) => string
    //请求头
    headers?: HeadersInit;
    //请求方式
    method?: string;
    //返回值类型
    responseType?: "arrayBuffer" | "blob" | "formData" | "json" | "text";
}

declare interface Result<T = any> {
    code: number;
    message?: string;
    data?: T
}

const fetchUtil = {
    create: (config?: HttpConfig) => {
        let interceptor_req: (init: RequestInit) => RequestInit;
        let interceptor_resp: (result: Result) => Result | Promise<Result>;
        let interceptor_resp_err: (reason: string) => string;
        const baseConfig = config;

        //最终请求时使用的函数
        const customFetch = async function <T = any>(input: RequestInfo | URL, init: RequestInit, responseType?: "arrayBuffer" | "blob" | "formData" | "json" | "text"): Promise<Result<T>> {
            //fetch默认请求方式设为GET
            if (!init.method) {
                init.method = 'GET'
            }
            //在这里可以对所有请求进行拦截处理
            init = interceptor_req(init);
            return new Promise(async (resolve, reject) => {
                //发起fetch请求，网络错误不会出现异常，需要在下面进行处理
                const response: Response = await fetch(input, init)
                if (response.ok) {
                    //表示网络上请求成功了，也就是http请求是成功了，但是具体的业务层是否成功后续根据正文中的code判断
                    let result: Result;
                    response.headers
                    if (responseType === 'arrayBuffer') {
                        result = {
                            code: 200,
                            data: await response.arrayBuffer()
                        };
                    } else if (responseType === 'blob') {
                        result = {
                            code: 200,
                            data: await response.blob()
                        };
                    } else if (responseType === 'formData') {
                        result = {
                            code: 200,
                            data: await response.formData()
                        };
                    } else if (responseType === 'text') {
                        result = {
                            code: 200,
                            data: await response.text()
                        }
                    } else {
                        result = await response.json();
                    }
                    //此处进行响应拦截处理
                    resolve(interceptor_resp(result));
                } else {
                    reject(interceptor_resp_err(response.statusText));
                }
            })
        }

        /**
         *
         * @param url url
         * @param init 初始参数，优先级比全局的更高
         */
        const request = function <T>(url: string, init?: HttpConfig): Promise<Result<T>> {
            const config = {
                ...baseConfig,
                ...init,
            };
            //转换为Headers类型，方便操作
            const headers: Headers = new Headers(config?.headers);
            if (config.data instanceof FormData) {
                //上传文件时的类型
                headers.set("content-type", "form-data/multipart");
                config.headers = headers;
                config.body = config.data
            } else if (config.data instanceof URLSearchParams) {
                //表单提交
                headers.set("content-type", "application/x-www-form-urlencoded");
                config.headers = headers;
                //URLSearchParams转字符串
                config.body = config.data.toString();
            } else {
                const contentType = headers.get("content-type")
                if (contentType === 'application/x-www-form-urlencoded') {
                    //表单提交
                    if (config.dataSerializer) {
                        config.body = config.dataSerializer(config.data)
                    } else {
                        config.body = qs.stringify(config.data, {allowDots: true});
                    }
                } else if (contentType === 'application/json') {
                    config.body = JSON.stringify(config.data)
                }
            }
            //对url和params进行处理
            let strings = url.split('?');
            //url去除参数部分
            url = strings[0];
            //url上的参数
            let urlSearchParams = new URLSearchParams(strings[1]);
            let queryString = urlSearchParams.toString();
            let paramStr;
            if (config.params instanceof URLSearchParams) {
                paramStr = config.params.toString()
            } else {
                if (config.paramsSerializer) {
                    //将params参数转字符串
                    paramStr = config.paramsSerializer(config.params) || '';
                } else {
                    paramStr = qs.stringify(config.params, {allowDots: true}) || '';
                }
            }
            if (queryString && paramStr) {
                queryString = queryString + "&" + paramStr;
            } else {
                queryString = queryString + paramStr
            }
            if (queryString) {
                url = url + "?" + queryString;
            }
            if (url.startsWith("http://") || url.startsWith("https://")) {
                return customFetch(url, config, config.responseType);
            } else {
                if (config.baseURL) {
                    url = config.baseURL + url;
                }
                return customFetch(url, config, config.responseType);
            }
        }

        request.get = function <T>(url: string, params?: URLSearchParams | object, init?: HttpConfig): Promise<Result<T>> {
            return request<T>(url, {
                ...init,
                params: params,
                method: "GET",
                body: undefined
            })
        }
        request.post = function <T>(url: string, data?: FormData | URLSearchParams | object | string, init?: HttpConfig): Promise<Result<T>> {
            return request<T>(url, {
                ...init,
                data: data,
                method: "POST"
            })
        }

        request.delete = function <T>(url: string, params?: URLSearchParams | object, init?: HttpConfig): Promise<Result<T>> {
            return request<T>(url, {
                ...init,
                params: params,
                method: "DELETE"
            })
        };
        request.put = function <T>(url: string, data?: FormData | URLSearchParams | object | string, init?: HttpConfig): Promise<Result<T>> {
            return request<T>(url, {
                ...init,
                data: data,
                method: "PUT"
            })
        }

        request.interceptors = {
            request: {
                use: function (callback: (init: RequestInit) => RequestInit) {
                    interceptor_req = callback;
                },
            },
            response: {
                use: function (callback1: (result: Result) => Result | Promise<Result>, callback2: (reason: string) => string) {
                    interceptor_resp = callback1
                    interceptor_resp_err = callback2
                },
            },
        };
        return request;
    }
}
export default fetchUtil