module.exports = {
    root: true,
    env: {
        node: true,
    },
    extends: ['plugin:vue/vue3-essential', 'eslint:recommended', '@vue/prettier'],
    parserOptions: {
        parser: 'babel-eslint',
    },
    rules: {
        indent: ['off', 4], // 设置缩进4字符
        quotes: [2, 'single'], //强制双引号
        semi: [2, 'never'], //语句强制分号结尾
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        // 闭合html标签
        'vue/html-self-closing': [
            'error',
            {
                html: {
                    void: 'always',
                    normal: 'always',
                    component: 'always',
                },
                svg: 'always',
                math: 'always',
            },
        ],
        'vue/script-setup-uses-vars': 0,
        'no-var': 2,
        eqeqeq: 2,
    },
    overrides: [
        {
            files: ['**/__tests__/*.{j,t}s?(x)', '**/tests/unit/**/*.spec.{j,t}s?(x)'],
            env: {
                mocha: true,
            },
        },
    ],
}
