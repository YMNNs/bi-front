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
    return (
        this.length !== array.length &&
        this.every((i) => array.indexOf(i) >= 0 && array.every((i) => this.indexOf(i) >= 0))
    )
}

export function randomString(e) {
    e = e || 32
    let t = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678',
        a = t.length,
        n = ''
    for (let i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a))
    return n
}
