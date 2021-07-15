// const BundleAnalyzerPlugin =
//     require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
// module.exports = {
//     configureWebpack: {
//         plugins: [new BundleAnalyzerPlugin()],
//     },
// };

module.exports = {
    chainWebpack: (config) => {
        config
            .plugin('define')
            .tap((args) => {
                args[0]['process.env'].BUILD_TIME = JSON.stringify(new Date().toString())
                return args
            })
            .end()
        // config.module.rule('markdown').test(/\.md$/).use('html-loader').loader('markdown-loader').end()
    },

    configureWebpack: {
        module: {
            rules: [
                {
                    test: /\.md$/,
                    use: [
                        {
                            loader: 'html-loader',
                        },
                        {
                            loader: 'markdown-loader',
                            options: {
                                /* your options here */
                            },
                        },
                    ],
                },
                // {
                //     test: /\.html$/i,
                //     loader: 'html-loader',
                // },
            ],
        },
    },

    /* 解决"Component provided template option but runtime compilation is not supported
    in this build of Vue. Configure your bundler to alias "vue" to "vue/dist/vue.esm-bundler.js" */
    runtimeCompiler: true,

    productionSourceMap: false,
}
