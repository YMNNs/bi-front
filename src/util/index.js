/**
 * 带错误处理的解析对象
 * @param o JSON字符串
 * @param k key
 * @returns {undefined|*} 解析的对象或undefined
 * @constructor
 */
export function parseOrNull(o, k) {
    try {
        if (!k) return JSON.parse(o);
        else return JSON.parse(o)[k];
    } catch (e) {
        return undefined;
    }
}

/**
 * 格式化日期
 * @param fmt
 * @returns {*}
 * @constructor
 */
Date.prototype.Format = function (fmt) {
    const o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "H+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        S: this.getMilliseconds(), //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(
            RegExp.$1,
            (this.getFullYear() + "").substr(4 - RegExp.$1.length)
        );
    for (const k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(
                RegExp.$1,
                RegExp.$1.length === 1
                    ? o[k]
                    : ("00" + o[k]).substr(("" + o[k]).length)
            );
    return fmt;
};

/**
 * 比较两数组元素是否相同
 * @param array
 * @returns {boolean}
 */
Array.prototype.elementEquals = function (array) {
    // 长度不等
    if (this.length !== array.length) {
        return false;
    }
    // 其有我没有
    this.forEach((i) => {
        if (array.find((j) => j === i)) {
            return false;
        }
    });
    // 我有其没有
    array.forEach((i) => {
        if (this.find((j) => j === i)) {
            return false;
        }
    });
    return true;
};

export function randomString(e) {
    e = e || 32;
    let t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678",
        a = t.length,
        n = "";
    for (let i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a));
    return n;
}

/**
 * 判断数组中是否有重复元素
 * @returns {boolean}
 */
Array.prototype.hasDuplicates = function () {
    return !this.every((i) => this.indexOf(i) === this.lastIndexOf(i));
};
