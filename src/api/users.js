import request from './request'

export const getUser = (page, limit, query) => {
  return request({
    url: `/zhsx/user/pageCondition/${page}/${limit}`,
    method: 'POST',
    data: query
  })
}
