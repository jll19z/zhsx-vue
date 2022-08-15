import request from './request'

export const getOrderInfo = (page, limit, query) => {
  return request({
    url: `/zhsx/order-master/pageCondition/${page}/${limit}`,
    method: 'POST',
    data: query
  })
}

export const UpdateOrderById = (Body) => {
  return request({
    url: '/zhsx/order-master/updateById',
    method: 'POST',
    data: Body
  })
}

export const DeleteOrderByNo = (orderNo) => {
  return request({
    url: `/zhsx/order-master/delete/${orderNo}`,
    method: 'DELETE'
  })
}
