/**
 * 带错误处理的解析对象
 * @param o JSON字符串
 * @param k key
 * @returns {undefined|*} 解析的对象或undefined
 * @constructor
 */
export function parseOrNull(o, k) {
    try {
        if (!k) return JSON.parse(o)
        else return JSON.parse(o)[k]
    } catch (e) {
        return undefined
    }
}

/**
 * 比较两数组元素是否相同
 * @param array
 * @returns {boolean}
 */
Array.prototype.elementEquals = function (array) {
    // 长度不等
    if (this.length !== array.length) {
        return false
    }
    // 其有我没有
    for (const i of this) {
        if (array.indexOf(i) < 0) {
            return false
        }
    }
    // 我有其没有
    for (const i of array) {
        if (this.indexOf(i) < 0) {
            return false
        }
    }
    return true
}

export function randomString(e) {
    e = e || 32
    let t = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678',
        a = t.length,
        n = ''
    for (let i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a))
    return n
}

/**
 * 判断数组中是否有重复元素
 * @returns {boolean}
 */
Array.prototype.hasDuplicates = function () {
    return !this.every((i) => this.indexOf(i) === this.lastIndexOf(i))
}
