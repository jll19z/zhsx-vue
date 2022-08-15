import request from './request'

export const menuList = (id) => {
  return request({
    url: `/zhsx/vue-menu/${id}`
  })
}
