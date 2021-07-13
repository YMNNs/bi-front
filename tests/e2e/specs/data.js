import 'cypress-file-upload'
import { dom_map } from '../constant/test_info'

describe('上传数据：异常处理', () => {
    it('文件格式不匹配', function () {
        cy.login()
        cy.visit('/new_data', {
            onBeforeLoad(win) {
                cy.stub(win.console, 'log').as('consoleLog')
            },
        })
        const type_mismatch_file_path = '../files/co2.xxx'
        cy.get('#' + dom_map.new_data.select_file).attachFile(type_mismatch_file_path)
        cy.get('@consoleLog').should('have.value', '不是有效的')
    })
})
