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

/**
 * 随机字符串
 * @param e 长度
 * @returns {string}
 */
export function randomString(e) {
    e = e || 32
    let t = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678',
        a = t.length,
        n = ''
    for (let i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a))
    return n
}

/**
 * 获取字符串字节长度
 * @returns {number}
 */
String.prototype.getBytesLength = function () {
    let totalLength = 0
    let charCode
    for (let i = 0; i < this.length; i++) {
        charCode = this.charCodeAt(i)
        if (charCode < 0x007f) {
            totalLength++
        } else if (0x0080 <= charCode && charCode <= 0x07ff) {
            totalLength += 2
        } else if (0x0800 <= charCode && charCode <= 0xffff) {
            totalLength += 3
        } else {
            totalLength += 4
        }
    }
    return totalLength
}
