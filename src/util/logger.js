/**
 * 带颜色标签的日志
 * YMNNs
 */

/* eslint-disable no-console */

const levels = {
    DEBUG: {
        tag: 'DBUG',
        background: 'LightGoldenRodYellow',
        foreground: 'Black',
        level: 4,
    },
    MOCK: {
        tag: 'MOCK',
        background: 'LightGoldenRodYellow',
        foreground: 'Black',
        level: 4,
    },
    SUCCESS: {
        tag: 'SCES',
        background: 'Green',
        foreground: 'White',
        level: 3,
    },
    INFO: {
        tag: 'INFO',
        background: 'Gainsboro',
        foreground: 'DimGray',
        level: 3,
    },
    TIMER: {
        tag: 'TIME',
        background: 'Tomato',
        foreground: 'White',
        level: 3,
    },
    FAIL: {
        tag: 'FAIL',
        background: 'Crimson',
        foreground: 'White',
        level: 2,
    },
    WARN: {
        tag: 'WARN',
        background: 'Orange',
        foreground: 'Black',
        level: 2,
    },
    ERROR: {
        tag: 'ERR!',
        background: 'Red',
        foreground: 'White',
        level: 1,
    },
}

import colors from 'colors'
import { values } from 'lodash-es'
colors.enable()

let _level = 2
export default {
    setDefaultLevel: (level) => {
        if ([0, 1, 2, 3, 4].indexOf(level) < 0) {
            _level = 2
        } else {
            _level = level
        }
    },
    success: (text) => {
        if (levels.SUCCESS.level <= _level) {
            console.log(
                `%c ${levels.SUCCESS.tag} `,
                `color: ${levels.SUCCESS.foreground}; background-color: ${levels.SUCCESS.background}`,
                text
            )
        }
    },
    fail: (text) => {
        if (levels.FAIL.level <= _level) {
            console.log(
                `%c ${levels.FAIL.tag} `,
                `color: ${levels.FAIL.foreground}; background-color: ${levels.FAIL.background}`,
                text
            )
        }
    },
    warn: (text) => {
        if (levels.WARN.level <= _level) {
            console.log(
                `%c ${levels.WARN.tag} `,
                `color: ${levels.WARN.foreground}; background-color: ${levels.WARN.background}`,
                text
            )
        }
    },
    debug: (text) => {
        if (levels.DEBUG.level <= _level) {
            console.log(
                `%c ${levels.DEBUG.tag} `,
                `color: ${levels.DEBUG.foreground}; background-color: ${levels.DEBUG.background}`,
                text
            )
        }
    },
    info: (text) => {
        if (levels.INFO.level <= _level) {
            console.log(
                `%c ${levels.INFO.tag} `,
                `color: ${levels.INFO.foreground}; background-color: ${levels.INFO.background}`,
                text
            )
        }
    },
    error: (text) => {
        if (levels.ERROR.level <= _level) {
            console.log(
                `%c ${levels.ERROR.tag} `,
                `color: ${levels.ERROR.foreground}; background-color: ${levels.ERROR.background}`,
                text
            )
        }
    },
    time: (text) => {
        if (levels.TIMER.level <= _level) {
            console.time(` ${levels.TIMER.tag} `.bgWhite + ` ${text}`)
        }
    },
    timeEnd: (text) => {
        if (levels.TIMER.level <= _level) {
            console.timeEnd(` ${levels.TIMER.tag} `.bgWhite + ` ${text}`)
        }
    },
    mock: (url, payload) => {
        if (levels.MOCK.level <= _level) {
            console.log(
                `%c ${levels.MOCK.tag} `,
                `color: ${levels.MOCK.foreground}; background-color: ${levels.MOCK.background}`,
                url,
                payload
            )
        }
    },
    logLevel: () => {
        const l = values(levels)
            .filter((i) => i.level <= _level)
            .reduce((previousValue, currentValue) => {
                return previousValue + `${currentValue.tag} `
            }, '已启用的日志等级: ')
        console.log(
            `%c ${levels.INFO.tag} `,
            `color: ${levels.INFO.foreground}; background-color: ${levels.INFO.background}`,
            l
        )
    },
}
