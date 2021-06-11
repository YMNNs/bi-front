module.exports = {
    root: true,
    env: {
        node: true,
    },
    extends: [
        "plugin:vue/vue3-essential",
        "eslint:recommended",
        "@vue/prettier",
    ],
    parserOptions: {
        parser: "babel-eslint",
    },
    rules: {
        // 设置缩进4字符
        indent: ["off", 4],
        quotes: [2, "double"], //强制双引号
        semi: [2, "always"], //语句强制分号结尾
        "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
        "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    },
    overrides: [
        {
            files: [
                "**/__tests__/*.{j,t}s?(x)",
                "**/tests/unit/**/*.spec.{j,t}s?(x)",
            ],
            env: {
                mocha: true,
            },
        },
    ],
};