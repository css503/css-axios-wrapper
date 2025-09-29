# css-axios-wrapper

一个基于 Axios 的 TypeScript HTTP 请求封装，支持自定义拦截器、动态 headers、取消请求、错误处理等，适合中大型项目二次封装。

## 安装

```bash
npm install css-axios-wrapper
```

## 快速开始

### 1. 初始化 axiosWrapper 实例

```typescript
import AxiosWrapper from 'css-axios-wrapper';
import { useInfoAuthStore } from '@/store/userInfo';

const axiosWrapper = new AxiosWrapper({
  getHeaders: () => {
    const userInfo = useInfoAuthStore();
    return {
      platform: 1,
      adminId: userInfo.userInfo.adminId,
      token: userInfo.userInfo.token,
    };
  },
  // 可选：自定义拦截器和错误处理
  requestInterceptor: (config) => config,//请求拦截器
  responseInterceptor: (response) => response,//响应拦截器，例如处理登录过期逻辑
  errorHandler: (error) => Promise.reject(error),//错误处理器-处理网络错误
  onCancelToken: (cancel) => { /* 取消函数收集 */ },//取消令牌回调
  axiosConfig: {
    timeout: 60000,
    withCredentials: true,
  }
});

// 导出常用请求方法
export const $get = axiosWrapper.$get.bind(axiosWrapper);
export const $post = axiosWrapper.$post.bind(axiosWrapper);
```

### 2. 业务接口单独管理

在 `api.ts` 文件中：

```typescript
import { $post } from './index';

// 登录接口
export const login = (params: object | undefined) => $post('/adminUser/login', params);

// 你可以继续添加其它接口
// export const getUserInfo = (params?: object) => $get('/user/info', params);
```

### 3. 页面中调用

```typescript
import { login } from 'css-axios-wrapper/dist/api';

login({ username: 'xxx', password: 'xxx' }).then(res => {
  // 处理结果
});
```

## API

- `$get(url: string, params?: object, header?: object | null): Promise<any>`
- `$post(url: string, params?: object, header?: object | null): Promise<any>`

## 推荐结构

- `src/index.ts`：axios 封装与实例化
- `src/api.ts`：业务接口统一管理

## License

MIT