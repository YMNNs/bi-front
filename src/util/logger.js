const levels = {
    DEBUG: {
        label: 'DBUG',
        background: 'LightGoldenRodYellow',
        foreground: 'Black',
        level: 4,
    },
    MOCK: {
        label: 'MOCK',
        background: 'LightGoldenRodYellow',
        foreground: 'Black',
        level: 4,
    },
    SUCCESS: {
        label: 'SCES',
        background: 'Green',
        foreground: 'White',
        level: 3,
    },
    INFO: {
        label: 'INFO',
        background: 'Gainsboro',
        foreground: 'DimGray',
        level: 3,
    },
    TIMER: {
        label: 'TIME',
        background: 'Tomato',
        foreground: 'White',
        level: 3,
    },
    FAIL: {
        label: 'FAIL',
        background: 'Crimson',
        foreground: 'White',
        level: 2,
    },
    WARN: {
        label: 'WARN',
        background: 'Orange',
        foreground: 'Black',
        level: 2,
    },
    ERROR: {
        label: 'ERR!',
        background: 'Red',
        foreground: 'White',
        level: 1,
    },
}

import colors from 'colors'
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
                `%c ${levels.SUCCESS.label} `,
                `color: ${levels.SUCCESS.foreground}; background-color: ${levels.SUCCESS.background}`,
                text
            )
        }
    },
    fail: (text) => {
        if (levels.FAIL.level <= _level) {
            console.log(
                `%c ${levels.FAIL.label} `,
                `color: ${levels.FAIL.foreground}; background-color: ${levels.FAIL.background}`,
                text
            )
        }
    },
    warn: (text) => {
        if (levels.WARN.level <= _level) {
            console.log(
                `%c ${levels.WARN.label} `,
                `color: ${levels.WARN.foreground}; background-color: ${levels.WARN.background}`,
                text
            )
        }
    },
    debug: (text) => {
        if (levels.DEBUG.level <= _level) {
            console.log(
                `%c ${levels.DEBUG.label} `,
                `color: ${levels.DEBUG.foreground}; background-color: ${levels.DEBUG.background}`,
                text
            )
        }
    },
    info: (text) => {
        if (levels.INFO.level <= _level) {
            console.log(
                `%c ${levels.INFO.label} `,
                `color: ${levels.INFO.foreground}; background-color: ${levels.INFO.background}`,
                text
            )
        }
    },
    error: (text) => {
        if (levels.ERROR.level <= _level) {
            console.log(
                `%c ${levels.ERROR.label} `,
                `color: ${levels.ERROR.foreground}; background-color: ${levels.ERROR.background}`,
                text
            )
        }
    },
    time: (text) => {
        if (levels.TIMER.level <= _level) {
            console.time(` ${levels.TIMER.label} `.bgWhite + ` ${text}`)
        }
    },
    timeEnd: (text) => {
        if (levels.TIMER.level <= _level) {
            console.timeEnd(` ${levels.TIMER.label} `.bgWhite + ` ${text}`)
        }
    },
    mock: (url, payload) => {
        if (levels.MOCK.level <= _level) {
            console.log(
                `%c ${levels.MOCK.label} `,
                `color: ${levels.MOCK.foreground}; background-color: ${levels.MOCK.background}`,
                url,
                payload
            )
        }
    },
}
