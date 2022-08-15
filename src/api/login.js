import request from './request'

export const login = (data) => {
  return request({
    url: '/login',
    method: 'POST',
    data
  })
}

export const QrCodeLogin = () => {
  return request({
    url: '/qrCodeFirstLogin/getQrCode',
    method: 'GET'
  })
}

export const getOpenIdApi = (sceneStr) => {
  return request({
    url: `/qrCodeFirstLogin/getOpenId?eventKey=${sceneStr}`,
    method: 'GET'
  })
}

export const loginJudge = (openId) => {
  return request({
    url: `/loginjudge/op?openId=${openId}`,
    method: 'GET'
  })
}

export const getPubkey = () => {
  return request({
    url: '/login/rsa',
    method: 'GET'
  })
}
