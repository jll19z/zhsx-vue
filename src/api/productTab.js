import request from './request'

export const getProductTab = () => {
  return request({
    url: '/zhsx/product-tab',
    method: 'GET'
  })
}

export const getTabList = (page, limit, query) => {
  return request({
    url: `/zhsx/product-tab/pageCondition/${page}/${limit}`,
    method: 'POST',
    data: query
  })
}

export const AddTab = (Body) => {
  return request({
    url: '/zhsx/product-tab/save',
    method: 'POST',
    data: Body
  })
}

export const UpdateTabById = (Body) => {
  return request({
    url: '/zhsx/product-tab/updateById',
    method: 'POST',
    data: Body
  })
}

export const DeleteTabById = (id) => {
  return request({
    url: `/zhsx/product-tab/delete/${id}`,
    method: 'DELETE'
  })
}
