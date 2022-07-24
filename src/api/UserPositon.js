import request from './request'

export const positionList = () => {
  return request({
    url: '/zhsx/user-position'
  })
}
