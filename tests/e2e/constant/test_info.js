import { randomString } from '../../../src/util'
import _dom_map from '../../../src/constant/dom_map'
import { mock_data as _mock_data } from '../../../src/api/mock/mock_data'

export const dom_map = _dom_map
export const mock_data = _mock_data

export const valid_username = randomString(8)
export const invalid_username = randomString(8)
export const valid_password = randomString(8)
export const invalid_password = randomString(8)
export const nickname = randomString(8)
export const email = randomString(8) + '@' + randomString(8) + '.xx'
export const data_name_long = randomString(129)
export const data_name = randomString(10)
export const data_description_long = randomString(257)
export const data_description = randomString(20)
export const chart_name = randomString(20)
export const chart_name_long = randomString(129)
