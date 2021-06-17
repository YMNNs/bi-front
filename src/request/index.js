import axios from "axios";
import store from "@/store";
import router from "@/router";
import { notification } from "ant-design-vue";

// 创建axios实例
const instance = axios.create({ timeout: 1000 * 6 });
// 设置post请求头,utf-8
instance.defaults.headers.post["Content-Type"] =
    "application/json;charset=UTF-8";
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
        if (token) {
            // 判断是否存在token，如果存在的话，则每个http header都加上token
            config.headers.Authorization = token;
            console.log("添加token" + token);
        }
        console.log(config);
        return config;
    },
    (error) => Promise.error(error)
);

instance.interceptors.response.use(
    (response) => {
        if (response && response.data && response.data.status) {
            console.log("收到正确响应");
            store.commit("SET_NETWORK_STATUS", true);
            if (response.data.status.code >= 0) {
                return response;
            } else {
                switch (response.data.status.code) {
                    case -1: {
                        //未携带token
                        notification["warning"]({
                            message: "需要登录",
                            description: "正在跳转到登录页面。",
                        });
                        toLogin();
                        break;
                    }
                    case -2: {
                        notification["warning"]({
                            message: "登录过期",
                            description: "正在跳转到登录页面。",
                        });
                        toLogin();
                        break;
                    }
                    case -3: {
                        notification["error"]({
                            message: "错误",
                            description: "无权使用此接口。",
                        });
                        break;
                    }
                    case -4: {
                        notification["error"]({
                            message: "错误",
                            description: "此接口已停用。",
                        });
                        break;
                    }
                    case -5: {
                        notification["error"]({
                            message: "错误",
                            description: "只允许POST方法。",
                        });
                        break;
                    }
                    case -6: {
                        notification["error"]({
                            message: "错误",
                            description: "只允许GET方法。",
                        });
                        break;
                    }
                    case -7: {
                        notification["error"]({
                            message: "错误",
                            description: "用户已停用。",
                        });
                        toLogin();
                        break;
                    }
                    case -8: {
                        notification["error"]({
                            message: "错误",
                            description: "此接口已停用。",
                        });
                        break;
                    }
                }
            }
        }
    },
    (error) => {
        if (error.status) {
            console.log("收到错误响应");
            store.commit("SET_NETWORK_STATUS", true);
            errorHandle(error.status, error.data.status.message);
            return Promise.reject(error);
        } else {
            console.log("未收到响应");
            store.commit("SET_NETWORK_STATUS", false);
            return Promise.reject(error);
        }
    }
);

export default instance;

/**
 * 跳转登录页
 * 携带当前页面路由，以期在登录页面完成登录后返回当前页面
 */
const toLogin = () => {
    store.commit("CLEAR_USER_INFO");
    store.commit("CLEAR_TOKEN");
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
            notification["warning"]({
                message: "需要登录",
                description: "正在跳转到登录页面。",
            });
            toLogin();
            break;
        }
        // 403 token过期
        // 清除token并跳转登录页
        case 403: {
            notification["warning"]({
                message: "登录过期",
                description: "正在跳转到登录页面。",
            });
            setTimeout(() => {
                toLogin();
            }, 1000);
            break;
        }
        case 404: {
            notification["error"]({
                message: "错误",
                description: "页面中的一个请求出现404错误。",
            });
            break;
        }
        default: {
            notification["error"]({
                message: "错误",
                description: msg,
            });
        }
    }
};
