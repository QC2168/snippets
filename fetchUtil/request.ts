import {ElMessage, ElMessageBox} from 'element-plus';
import {Session} from '/@/utils/storage';
import fetchUtil from "/@/utils/fetch";

// 配置新建一个实例
const service = fetchUtil.create({
    baseURL: 'http://localhost:8888/dev',
    headers: {'Content-Type': 'application/json'},
});

// 添加请求拦截器
service.interceptors.request.use(
    (config) => {
        // 在发送请求之前做些什么 token
        if (Session.get('token')) {
            config.headers = {
                'Authorization': `${Session.get('token')}`
            }
        }
        return config;
    }
);

// 添加响应拦截器
service.interceptors.response.use(
    (res) => {
        if (res?.code !== 200) {
            // `token` 过期或者账号已在别处登录
            if (res.code === 401) {
                Session.clear(); // 清除浏览器全部临时缓存
                window.location.href = '/'; // 去登录页
                ElMessageBox.alert('你已被登出，请重新登录', '提示', {})
                    .then(() => {
                    })
                    .catch(() => {
                    });
            }
            ElMessage.error(res.message);
            return Promise.reject(res);
        } else {
            return res;
        }
    },
    (error) => {
        // 对响应错误做点什么
        ElMessage.error(error);
        return error;
    }
);

// 导出实例
export default service;

