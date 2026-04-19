import axios from 'axios';
import { message } from 'antd';

// ======================== 创建 Axios 实例 ========================

const service = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// ======================== 请求拦截器 ========================

service.interceptors.request.use(
    (config) => {
        // 从 localStorage 获取 token，自动附加到请求头
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        console.error('请求拦截器错误:', error);
        return Promise.reject(error);
    }
);

// ======================== 响应拦截器 ========================

service.interceptors.response.use(
    (response) => {
        const res = response.data;

        // 如果后端返回的是标准格式 { code, data, message }
        // 可根据实际业务约定调整判断逻辑
        if (res.code !== undefined && res.code !== 0 && res.code !== 200) {
            message.error(res.message || '请求失败');

            // 特殊业务码处理（如 token 过期）
            if (res.code === 401 || res.code === 10401) {
                handleUnauthorized();
            }

            return Promise.reject(new Error(res.message || '请求失败'));
        }

        // 直接返回 data 字段（如果有），否则返回整个响应体
        return res.data !== undefined ? res.data : res;
    },
    (error) => {
        const { response } = error;

        if (response) {
            switch (response.status) {
                case 401:
                    message.error('登录已过期，请重新登录');
                    handleUnauthorized();
                    break;
                case 403:
                    message.error('没有权限访问该资源');
                    break;
                case 404:
                    message.error('请求的资源不存在');
                    break;
                case 500:
                    message.error('服务器内部错误');
                    break;
                default:
                    message.error(response.data?.message || `请求错误 (${response.status})`);
            }
        } else if (error.code === 'ECONNABORTED') {
            message.error('请求超时，请稍后重试');
        } else {
            message.error('网络异常，请检查网络连接');
        }

        return Promise.reject(error);
    }
);

// ======================== 未授权处理 ========================

function handleUnauthorized() {
    localStorage.removeItem('token');
    // 根据项目实际情况跳转登录页
    // window.location.href = '/login';
}

// ======================== 快捷方法 ========================

/**
 * GET 请求
 * @param {string} url - 请求路径
 * @param {object} params - 查询参数
 * @param {object} config - 额外配置
 */
export const get = (url, params, config = {}) => {
    return service.get(url, { params, ...config });
};

/**
 * POST 请求
 * @param {string} url - 请求路径
 * @param {object} data - 请求体
 * @param {object} config - 额外配置
 */
export const post = (url, data, config = {}) => {
    return service.post(url, data, config);
};

/**
 * PUT 请求
 * @param {string} url - 请求路径
 * @param {object} data - 请求体
 * @param {object} config - 额外配置
 */
export const put = (url, data, config = {}) => {
    return service.put(url, data, config);
};

/**
 * DELETE 请求
 * @param {string} url - 请求路径
 * @param {object} config - 额外配置
 */
export const del = (url, config = {}) => {
    return service.delete(url, config);
};

export default service;
