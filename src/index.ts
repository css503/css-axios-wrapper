import axios, { AxiosRequestConfig, Canceler } from 'axios';

export interface AxiosWrapperOptions {
    getHeaders?: () => Record<string, any>; // 获取动态 headers 的方法
    requestInterceptor?: (config: AxiosRequestConfig) => AxiosRequestConfig;
    responseInterceptor?: (response: any) => any;
    errorHandler?: (error: any) => any;
    axiosConfig?: AxiosRequestConfig;
    onCancelToken?: (cancel: Canceler) => void;
}

export class AxiosWrapper {
    private axiosInstance;

    constructor(private options: AxiosWrapperOptions = {}) {
        this.axiosInstance = axios.create(options.axiosConfig);

        this.axiosInstance.interceptors.request.use(
            (config) => {
                // 生成 cancelToken 并回调
                const CancelToken = axios.CancelToken;
                config.cancelToken = new CancelToken((cancel) => {
                    if (options.onCancelToken) options.onCancelToken(cancel);
                });
                // 动态 headers
                if (options.getHeaders) {
                    config.headers = {
                        ...options.getHeaders(),
                        ...config.headers,
                    };
                }
                if (options.requestInterceptor) {
                    config = options.requestInterceptor(config);
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        this.axiosInstance.interceptors.response.use(
            options.responseInterceptor || ((response) => response),
            options.errorHandler || ((error) => Promise.reject(error))
        );
    }

    $get(url: string, params?: object, header: object | null = null) {
        return this.axiosInstance.get(url, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                ...header,
            },
            params,
        }).then(res => res.data);
    }

    $post(url: string, params?: object, header: object | null = null) {
        return this.axiosInstance.post(url, params, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                ...header,
            },
        }).then(res => res.data)
        .catch(error => {
            console.log(error);
        });
    }
}

export default AxiosWrapper;