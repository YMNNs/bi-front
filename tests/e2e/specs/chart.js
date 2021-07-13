import { chart_name, dom_map } from '../constant/test_info'

describe.only('新建图表：正确路径', () => {})

describe('新建图表：错误处理', () => {})

describe('查看图表', () => {
    it('搜索图表', function () {
        cy.login()
        cy.visit('/chart_management')
        cy.url().then((el) => {
            const chart_info = {}
            if (el.indexOf('develop') > 0) {
                // 服务器
                chart_info.name = chart_name
            }

            cy.get('#' + dom_map.chart_management.search)
                .clear()
                .type()
        })
    })
})
