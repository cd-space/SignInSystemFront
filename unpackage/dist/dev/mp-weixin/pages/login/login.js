"use strict";
const common_vendor = require("../../common/vendor.js");
const api_auth = require("../../api/auth.js");
const _sfc_main = {
  __name: "login",
  setup(__props) {
    const account = common_vendor.ref("");
    const password = common_vendor.ref("");
    const showPassword = common_vendor.ref(false);
    const togglePassword = () => {
      showPassword.value = !showPassword.value;
    };
    const handleLogin = async () => {
      if (!account.value || !password.value) {
        common_vendor.index.showToast({
          title: "请输入完整信息",
          icon: "none"
        });
        return;
      }
      const isPhone = /^1[3-9]\d{9}$/.test(account.value);
      const params = isPhone ? {
        phone: account.value,
        password: password.value
      } : {
        student_id: account.value,
        password: password.value
      };
      try {
        const data = await api_auth.loginApi(params);
        common_vendor.index.setStorageSync("userinfo", data);
        common_vendor.index.showToast({
          title: "登录成功",
          icon: "success"
        });
        common_vendor.index.switchTab({
          url: "/pages/mine/mine"
        });
      } catch (e) {
        common_vendor.index.__f__("log", "at pages/login/login.vue:94", "登录失败", e);
      }
    };
    const goRegister = () => {
      common_vendor.index.navigateTo({
        url: "/pages/register/register"
      });
    };
    return (_ctx, _cache) => {
      return {
        a: account.value,
        b: common_vendor.o(($event) => account.value = $event.detail.value),
        c: showPassword.value ? "text" : "password",
        d: password.value,
        e: common_vendor.o(($event) => password.value = $event.detail.value),
        f: common_vendor.t(showPassword.value ? "👁" : "️🙈"),
        g: common_vendor.o(togglePassword),
        h: common_vendor.o(handleLogin),
        i: common_vendor.o(goRegister)
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-e4e4508d"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/login/login.js.map
