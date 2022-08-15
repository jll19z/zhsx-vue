import request from './request'

export const getProductInfo = (page, limit, query) => {
  return request({
    url: `/zhsx/product-info/pageCondition/${page}/${limit}`,
    method: 'POST',
    data: query
  })
}

export const AddProduct = (Body) => {
  return request({
    url: '/zhsx/product-info/save',
    method: 'POST',
    data: Body
  })
}

export const UpdateProductById = (Body) => {
  return request({
    url: '/zhsx/product-info/updateById',
    method: 'POST',
    data: Body
  })
}

export const DeleteProductById = (id) => {
  return request({
    url: `/zhsx/product-info/delete/${id}`,
    method: 'DELETE'
  })
}
// updateStatus
export const UpdateStatusById = (id) => {
  return request({
    url: `/zhsx/product-info/updateStatus/${id}`,
    method: 'PUT'
  })
}
