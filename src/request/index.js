import axios from "axios";
import store from "@/store";
import router from "@/router";
import { message } from "ant-design-vue";

// 创建axios实例
const instance = axios.create({ timeout: 1000 * 12 });
// 设置post请求头
instance.defaults.headers.post["Content-Type"] = "application/json";
// 设置baseUrl
instance.defaults.baseURL = process.env.VUE_APP_API_BASE_URL;

/**
 * 请求拦截器
 * 每次请求前，如果存在token则在请求头中携带token
 */
instance.interceptors.request.use(
    (config) => {
        // 登录流程控制中，根据本地是否存在token判断用户的登录情况
        // 但是即使token存在，也有可能token是过期的，所以在每次的请求头中携带token
        // 后台根据携带的token判断用户的登录情况，并返回给我们对应的状态码
        // 而后我们可以在响应拦截器中，根据状态码进行一些统一的操作。
        const token = store.state.token;
        console.log("获取到token：" + token);
        token && (config.data.token = token);
        console.log(config.data);
        return config;
    },
    (error) => Promise.error(error)
);

// 响应拦截器
instance.interceptors.response.use(
    // 请求成功
    (response) => {
        console.log("请求成功");
        store.commit("SET_NETWORK_STATUS", true);
        console.log(response);
        if (response.status === 200) return response;
        else return Promise.reject(response);
    },
    // 请求失败
    (error) => {
        const { response } = error;
        if (response) {
            // 请求已发出，但是不在2xx的范围
            console.log("请求失败：" + response.status);
            store.commit("SET_NETWORK_STATUS", true);
            errorHandle(response.status, response.data.status.message);
            return Promise.reject(response);
        } else {
            // 处理断网的情况
            // eg:请求超时或断网时，更新state的network状态
            // network状态在app.vue中控制着一个全局的断网提示组件的显示隐藏
            // 关于断网组件中的刷新重新获取数据，会在断网组件中说明
            console.log("未收到响应");
            store.commit("SET_NETWORK_STATUS", false);
        }
    }
);

export default instance;

/**
 * 跳转登录页
 * 携带当前页面路由，以期在登录页面完成登录后返回当前页面
 */
const toLogin = () => {
    store.commit("CLEAR_LOGIN_INFO");
    router.replace({
        path: "/login",
        query: {
            redirect: router.currentRoute.fullPath,
        },
    });
};

/**
 * 请求失败后的错误统一处理
 * @param {Number} status 请求失败的状态码
 * @param msg response中的msg
 */
const errorHandle = (status, msg) => {
    // 状态码判断
    switch (status) {
        // 401: 未登录状态，跳转登录页
        case 401: {
            message.warning("需要登录，正在跳转至登录页面。");
            toLogin();
            break;
        }
        // 403 token过期
        // 清除token并跳转登录页
        case 403: {
            message.warning("登录过期，正在跳转至登录页面。");
            setTimeout(() => {
                toLogin();
            }, 1000);
            break;
        }
        case 404: {
            message.error("页面中的一个请求出现404错误。");
            break;
        }
        default: {
            message.error(msg);
        }
    }
};
