"use strict";
const utils_request = require("../utils/request.js");
const loginApi = (data) => {
  return utils_request.request({
    url: "/api/login",
    method: "POST",
    data
  });
};
const registerApi = (data) => {
  return utils_request.request({
    url: "/api/addusers",
    method: "POST",
    data
  });
};
exports.loginApi = loginApi;
exports.registerApi = registerApi;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/auth.js.map
