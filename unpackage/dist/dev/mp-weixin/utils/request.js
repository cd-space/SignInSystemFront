"use strict";
const common_vendor = require("../common/vendor.js");
const BASE_URL = "http://192.168.137.26:8000";
const request = (options) => {
  return new Promise((resolve, reject) => {
    common_vendor.index.request({
      url: BASE_URL + options.url,
      method: options.method || "GET",
      data: options.data || {},
      header: {
        "Content-Type": "application/json",
        ...options.header
      },
      success: (res) => {
        const { code, message, data } = res.data || {};
        if (code == 200) {
          resolve(data);
        } else {
          common_vendor.index.showToast({
            title: message || "请求失败",
            icon: "none"
          });
          reject(res.data);
        }
      },
      fail: (err) => {
        common_vendor.index.showToast({
          title: "网络异常",
          icon: "none"
        });
        reject(err);
      }
    });
  });
};
exports.request = request;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/request.js.map
