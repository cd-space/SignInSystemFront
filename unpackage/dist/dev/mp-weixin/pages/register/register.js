"use strict";
const common_vendor = require("../../common/vendor.js");
const api_auth = require("../../api/auth.js");
const _sfc_main = {
  __name: "register",
  setup(__props) {
    const name = common_vendor.ref("");
    const phone = common_vendor.ref("");
    const studentId = common_vendor.ref("");
    const password = common_vendor.ref("");
    const showPassword = common_vendor.ref(false);
    const togglePassword = () => {
      showPassword.value = !showPassword.value;
    };
    const isValidPhone = (val) => {
      return /^1[3-9]\d{9}$/.test(val);
    };
    const handleRegister = async () => {
      if (!name.value || !phone.value || !password.value) {
        common_vendor.index.showToast({
          title: "姓名、手机号和密码必填",
          icon: "none"
        });
        return;
      }
      if (!isValidPhone(phone.value)) {
        common_vendor.index.showToast({
          title: "请输入有效手机号",
          icon: "none"
        });
        return;
      }
      const params = {
        name: name.value,
        phone: phone.value,
        student_id: studentId.value || null,
        password: password.value,
        role: "student"
      };
      try {
        const res = await api_auth.registerApi(params);
        common_vendor.index.showToast({
          title: "注册成功",
          icon: "success"
        });
        common_vendor.index.navigateBack();
      } catch (error) {
        common_vendor.index.__f__("log", "at pages/register/register.vue:110", "注册失败", error);
        common_vendor.index.showToast({
          title: (error == null ? void 0 : error.msg) || "注册失败，请重试",
          icon: "none"
        });
      }
    };
    return (_ctx, _cache) => {
      return {
        a: name.value,
        b: common_vendor.o(($event) => name.value = $event.detail.value),
        c: phone.value,
        d: common_vendor.o(($event) => phone.value = $event.detail.value),
        e: studentId.value,
        f: common_vendor.o(($event) => studentId.value = $event.detail.value),
        g: showPassword.value ? "text" : "password",
        h: password.value,
        i: common_vendor.o(($event) => password.value = $event.detail.value),
        j: common_vendor.t(showPassword.value ? "👁️" : "🙈"),
        k: common_vendor.o(togglePassword),
        l: common_vendor.o(handleRegister)
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-bac4a35d"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/register/register.js.map
