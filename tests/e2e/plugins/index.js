/* eslint-disable arrow-body-style */
// https://docs.cypress.io/guides/guides/plugins-guide.html

// if you need a custom webpack configuration you can uncomment the following import
// and then use the `file:preprocessor` event
// as explained in the cypress docs
// https://docs.cypress.io/api/plugins/preprocessors-api.html#Examples

// /* eslint-disable import/no-extraneous-dependencies, global-require */
// const webpack = require('@cypress/webpack-preprocessor')
// require('dotenv').config()

function randomString(e) {
    e = e || 32
    let t = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678',
        a = t.length,
        n = ''
    for (let i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a))
    return n
}
const _dom_map = require('../../../src/constant/dom_map')
const _mock_data = require('../../../src/api/mock/mock_data')

module.exports = (on, config) => {
    // on('file:preprocessor', webpack({
    //  webpackOptions: require('@vue/cli-service/webpack.config'),
    //  watchOptions: {}
    // }))
    return Object.assign({}, config, {
        fixturesFolder: 'tests/e2e/fixtures',
        integrationFolder: 'tests/e2e/specs',
        screenshotsFolder: 'tests/e2e/screenshots',
        videosFolder: 'tests/e2e/videos',
        supportFile: 'tests/e2e/support/index.js',

        dom_map: _dom_map,
        mock_data: _mock_data,
        dev_hostname: 'bi-develop.stager.top',
        invalid_token: randomString(8),
        valid_username: randomString(8),
        valid_username_new: randomString(8),
        username_long: randomString(20),
        invalid_username: randomString(8),
        valid_password: randomString(8),
        invalid_password: randomString(8),
        password_short: randomString(3),
        nickname: randomString(8),
        nickname_new: randomString(8),
        nickname_long: randomString(20),
        email: randomString(8) + '@' + randomString(8) + '.xx',
        email_new: randomString(8) + '@' + randomString(8) + '.xx',
        invalid_email: randomString(8),
        data_name_long: randomString(129),
        data_name: randomString(10),
        data_description_long: randomString(257),
        data_description: randomString(20),
        chart_name: randomString(20),
        chart_name_long: randomString(129),
    })
}
