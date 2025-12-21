import { request } from '@/utils/request'


export const loginApi = (data) => {
  return request({
    url: '/api/login',
    method: 'POST',
    data
  })
}

export const registerApi = (data) => {
  return request({
    url: '/api/addusers',
    method: 'POST',
    data
  })
}

export const changePasswordApi = (data) => {
  return request({
    url: '/api/update_password',
    method: 'POST',
    data
  })
}