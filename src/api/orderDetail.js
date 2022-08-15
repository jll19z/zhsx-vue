import request from './request'

export const getOrderDetail = (page, limit, query) => {
  return request({
    url: `/zhsx/order-detail/pageCondition/${page}/${limit}`,
    method: 'POST',
    data: query
  })
}
