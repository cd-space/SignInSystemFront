// const BASE_URL = 'http://192.168.137.26:8000'
const BASE_URL = 'http://192.168.137.26:8000'

export const request = (options) => {
  return new Promise((resolve, reject) => {
    uni.request({
      url: BASE_URL + options.url,
      method: options.method || 'GET',
      data: options.data || {},
      header: {
        'Content-Type': 'application/json',
        ...options.header
      },

      success: (res) => {
        /**
         * 后端统一返回：
         * {
         *   code: number,
         *   msg: string,
         *   data: any
         * }
         */
        const { code, message, data } = res.data || {}

        if (code == 200) {
          resolve(res.data)
        } else {
          uni.showToast({
            title: message || '请求失败',
            icon: 'none'
          })
          reject(res.data)
        }
      },

      fail: (err) => {
        uni.showToast({
          title: '网络异常',
          icon: 'none'
        })
        reject(err)
      }
    })
  })
}
