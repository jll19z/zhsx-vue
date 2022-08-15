import request from './request'

export const getUser = (page, limit, query) => {
  return request({
    url: `/zhsx/user/pageCondition/${page}/${limit}`,
    method: 'POST',
    data: query
  })
}

export const AddUser = (userBody) => {
  return request({
    url: '/zhsx/user/save',
    method: 'POST',
    data: userBody
  })
}

export const UserUpdateById = (userBody) => {
  return request({
    url: '/zhsx/user/updateById',
    method: 'POST',
    data: userBody
  })
}

export const UserDeleteById = (id) => {
  return request({
    url: `/zhsx/user/delete/+${id}`,
    method: 'DELETE'
  })
}

export const UserFind = (body) => {
  return request({
    url: '/zhsx/user/find',
    method: 'POST',
    data: body
  })
}
