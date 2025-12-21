"use strict";
const common_vendor = require("../../common/vendor.js");
const defaultAvatar = "https://tse3-mm.cn.bing.net/th/id/OIP-C.MpGc1WMpmJATpTSKSG-3ogAAAA?w=163&h=176&c=7&r=0&o=7&cb=ucfimg2&pid=1.7&rm=3&ucfimg=1";
const _sfc_main = {
  __name: "mine",
  setup(__props) {
    const isLogin = common_vendor.ref(false);
    const userInfo = common_vendor.ref({
      nickname: "",
      phone: "",
      avatar: defaultAvatar
    });
    const menus = common_vendor.ref([
      { title: "我的签到" },
      { title: "账号与安全" },
      { title: "上传人脸信息" }
    ]);
    const checkLogin = () => {
      const cacheUser = common_vendor.index.getStorageSync("userinfo");
      if (cacheUser) {
        isLogin.value = true;
        userInfo.value = {
          ...cacheUser,
          avatar: cacheUser.avatar || defaultAvatar
        };
      } else {
        isLogin.value = false;
        userInfo.value = {
          nickname: "",
          phone: "",
          avatar: defaultAvatar
        };
      }
    };
    const handleLogin = () => {
      if (isLogin.value)
        return;
      common_vendor.index.navigateTo({
        url: "/pages/login/login"
      });
    };
    const logout = () => {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定退出登录吗？",
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.removeStorageSync("userinfo");
            checkLogin();
          }
        }
      });
    };
    common_vendor.onShow(() => {
      checkLogin();
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: isLogin.value ? userInfo.value.avatar : defaultAvatar,
        b: common_vendor.t(isLogin.value ? userInfo.value.name : "点击登录 / 注册"),
        c: isLogin.value
      }, isLogin.value ? {
        d: common_vendor.t(userInfo.value.phone)
      } : {}, {
        e: !isLogin.value
      }, !isLogin.value ? {} : {}, {
        f: common_vendor.o(handleLogin),
        g: common_vendor.f(menus.value, (item, k0, i0) => {
          return {
            a: common_vendor.t(item.title),
            b: item.title
          };
        }),
        h: isLogin.value
      }, isLogin.value ? {
        i: common_vendor.o(logout)
      } : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-7c2ebfa5"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/mine/mine.js.map
