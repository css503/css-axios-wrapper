"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AxiosWrapper = void 0;
const axios_1 = __importDefault(require("axios"));
class AxiosWrapper {
    constructor(options = {}) {
        this.axiosInstance = axios_1.default.create(options.axiosConfig);
        // 请求拦截器
        this.axiosInstance.interceptors.request.use((config) => {
            // 生成 cancelToken 并回调
            const CancelToken = axios_1.default.CancelToken;
            config.cancelToken = new CancelToken((cancel) => {
                if (options.onCancelToken) {
                    options.onCancelToken(cancel);
                }
            });
            // 用户自定义拦截器
            if (options.requestInterceptor) {
                config = options.requestInterceptor(config);
            }
            return config;
        }, (error) => Promise.reject(error));
        // 响应拦截器
        this.axiosInstance.interceptors.response.use(options.responseInterceptor || ((response) => response), options.errorHandler || ((error) => Promise.reject(error)));
    }
    get(url, config) {
        return this.axiosInstance.get(url, config).then(res => res.data);
    }
    post(url, data, config) {
        return this.axiosInstance.post(url, data, config).then(res => res.data);
    }
}
exports.AxiosWrapper = AxiosWrapper;
exports.default = AxiosWrapper;
