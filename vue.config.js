// const BundleAnalyzerPlugin =
//     require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
// module.exports = {
//     configureWebpack: {
//         plugins: [new BundleAnalyzerPlugin()],
//     },
// };

module.exports = {
    chainWebpack: (config) => {
        config.plugin("define").tap((args) => {
            args[0]["process.env"].BUILD_TIME = JSON.stringify(
                new Date().toString()
            );
            return args;
        });
    },
};
