import request from './request'

export const getBanner = (page, limit, query) => {
  return request({
    url: `/zhsx/banner/pageCondition/${page}/${limit}`,
    method: 'POST',
    data: query
  })
}

export const AddBanner = (userBody) => {
  return request({
    url: '/zhsx/banner/save',
    method: 'POST',
    data: userBody
  })
}

export const UpdateBannerById = (userBody) => {
  return request({
    url: '/zhsx/banner/updateById',
    method: 'POST',
    data: userBody
  })
}

export const DeleteBannerById = (id) => {
  return request({
    url: `/zhsx/banner/delete/+${id}`,
    method: 'DELETE'
  })
}
