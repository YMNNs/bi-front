import 'cypress-file-upload'

describe('上传数据：异常处理', () => {
    it('文件格式不匹配', function () {
        cy.login()
        cy.visit('/new_data')
        const path = '../files/co2.xxx'
        cy.get(`#${Cypress.config('dom_map').new_data.select_file}`).attachFile(path)
        cy.contains('您上传的文件存在问题')
    })

    it('文件存在空列名', function () {
        cy.login()
        cy.visit('/new_data')
        const path = '../files/co2_empty_col.csv'
        cy.get(`#${Cypress.config('dom_map').new_data.select_file}`).attachFile(path)
        cy.contains('您上传的文件存在问题')
    })

    it('一个或多个列名长度超过 64 字节', function () {
        cy.login()
        cy.visit('/new_data')
        const path = '../files/co2_long_col.csv'
        cy.get(`#${Cypress.config('dom_map').new_data.select_file}`).attachFile(path)
        cy.contains('您上传的文件存在问题')
    })

    it('一个或多个列名首尾存在空格', function () {
        cy.login()
        cy.visit('/new_data')
        const path = '../files/co2_space_col.csv'
        cy.get(`#${Cypress.config('dom_map').new_data.select_file}`).attachFile(path)
        cy.contains('您上传的文件存在问题')
    })

    it('文件存在重复列名', function () {
        cy.login()
        cy.visit('/new_data')
        const path = '../files/co2_duplicated_col.csv'
        cy.get(`#${Cypress.config('dom_map').new_data.select_file}`).attachFile(path)
        cy.contains('您上传的文件存在问题')
    })

    it('文件内容问题', function () {
        cy.login()
        cy.visit('/new_data')
        const path = '../files/co2_error.csv'
        cy.get(`#${Cypress.config('dom_map').new_data.select_file}`).attachFile(path)
        cy.contains('您上传的文件存在问题')
    })

    it('缺少必填项', function () {
        cy.login()
        cy.visit('/new_data')
        cy.get(`#${Cypress.config('dom_map').new_data.submit}`).click()
        cy.contains('请')
    })

    it('数据名称过长', function () {
        cy.login()
        cy.visit('/new_data')
        cy.get(`#${Cypress.config('dom_map').new_data.name}`)
            .clear()
            .type(Cypress.config('data_name_long'))
            .should('have.value', Cypress.config('data_name_long'))
        cy.contains('数据名称长度上限为 128 字符')
    })

    it('数据描述过长', function () {
        cy.login()
        cy.visit('/new_data')
        cy.get(`#${Cypress.config('dom_map').new_data.description}`)
            .clear()
            .type(Cypress.config('data_description_long'))
            .should('have.value', Cypress.config('data_description_long'))
        cy.contains('描述长度上限为 256 字符')
    })
})

describe('上传数据：正确路径', () => {
    it('上传数据', function () {
        cy.login()
        cy.visit('/new_data')
        const path = '../files/co2.csv'
        cy.get(`#${Cypress.config('dom_map').new_data.select_file}`).attachFile(path)
        cy.get(`#${Cypress.config('dom_map').new_data.description}`)
            .clear()
            .type(Cypress.config('data_description'))
            .should('have.value', Cypress.config('data_description'))
        cy.get(`#${Cypress.config('dom_map').new_data.name}`)
            .clear()
            .type(Cypress.config('data_name'))
            .should('have.value', Cypress.config('data_name'))
        cy.get(`#${Cypress.config('dom_map').new_data.keys_text}`)
            .click()
            .type('year\n')
            .blur()
        cy.get(`#${Cypress.config('dom_map').new_data.keys_number}`)
            .click()
            .type('Cement production\nGas flarinl\nGas fuel\nLiquid fuel\nSolid fuel')
            .blur()
        cy.get(`#${Cypress.config('dom_map').new_data.submit}`).click()
        cy.contains('成功', { timeout: 3000 })
    })
})

describe('修改表名：正确路径', () => {
    it('修改表名', function () {
        cy.login()
        cy.visit('/data_management')
        cy.url().then((el) => {
            const data_info = {}
            if (el.indexOf(Cypress.config('dev_hostname')) >= 0) {
                // 服务器
                data_info.data_name = Cypress.config('data_name')
            } else {
                data_info.data_name = Cypress.config('mock_data').tables[0].name
            }
            cy.contains(data_info.data_name).click()
            cy.get('.ant-typography-edit').click()
            cy.get('.ant-input').clear().type('xxx\n')
            cy.contains('成功', { timeout: 3000 })
            cy.get('.ant-typography-edit').click()
            cy.get('.ant-input')
                .clear()
                .type(data_info.data_name + '\n')
            cy.contains('成功', { timeout: 3000 })
        })
    })
})
