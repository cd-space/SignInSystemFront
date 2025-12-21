<template>
  <view class="mine-page">
    <!-- 顶部用户信息 -->
    <view class="user-card" @click="handleLogin">
      <image
        class="avatar"
        :src="isLogin ? userInfo.avatar : defaultAvatar"
      />

      <view class="user-info">
        <view class="nickname">
          {{ isLogin ? userInfo.name : '点击登录 / 注册' }}
        </view>
        <view v-if="isLogin" class="desc">
          {{ userInfo.phone }}
        </view>
      </view>

      <view v-if="!isLogin" class="arrow">›</view>
    </view>

    <!-- 功能列表 -->
    <view class="menu-list">
      <view
        class="menu-item"
        v-for="item in menus"
        :key="item.title"
        @click="handleMenuClick(item)"
      >
        <text>{{ item.title }}</text>
        <text class="arrow">›</text>
      </view>
    </view>

    <!-- 退出登录 -->
    <view v-if="isLogin" class="logout" @click="logout">
      退出登录
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'

const defaultAvatar =
  'https://tse3-mm.cn.bing.net/th/id/OIP-C.MpGc1WMpmJATpTSKSG-3ogAAAA?w=163&h=176&c=7&r=0&o=7&cb=ucfimg2&pid=1.7&rm=3&ucfimg=1'

const isLogin = ref(false)

const userInfo = ref({
  name: '',
  phone: '',
  avatar: defaultAvatar
})

const menus = ref([
  { title: '账号与安全', page: '/pages/account/account' },
  { title: '上传人脸信息', page: '/pages/upload-face/upload-face' }
])

/**
 * 页面显示时检查登录态
 */
const checkLogin = () => {
  const cacheUser = uni.getStorageSync('userinfo')
  if (cacheUser) {
    isLogin.value = true
    userInfo.value = {
      ...cacheUser,
      avatar: cacheUser.avatar || defaultAvatar
    }
  } else {
    isLogin.value = false
    userInfo.value = {
      name: '',
      phone: '',
      avatar: defaultAvatar
    }
  }
}

const handleLogin = () => {
  if (isLogin.value) return

  uni.navigateTo({
    url: '/pages/login/login'
  })
}

const logout = () => {
  uni.showModal({
    title: '提示',
    content: '确定退出登录吗？',
    success: res => {
      if (res.confirm) {
        uni.removeStorageSync('userinfo')
        checkLogin()
      }
    }
  })
}

// 点击功能列表
const handleMenuClick = (item) => {
  if (!isLogin.value) {
    uni.showToast({
      title: '请先登录',
      icon: 'none'
    })
    return
  }

  if (item.page) {
    uni.navigateTo({
      url: item.page
    })
  }
}

onShow(() => {
  checkLogin()
})
</script>

<style lang="scss" scoped>
.mine-page {
  min-height: 100vh;
  background: #f6f7f8;
  padding: 30rpx;
}

/* 用户卡片 */
.user-card {
  display: flex;
  align-items: center;
  background: #fff;
  padding: 30rpx;
  border-radius: 16rpx;
  margin-bottom: 30rpx;
}

.avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  margin-right: 24rpx;
}

.user-info {
  flex: 1;
}

.nickname {
  font-size: 34rpx;
  font-weight: 600;
}

.desc {
  margin-top: 8rpx;
  font-size: 24rpx;
  color: #999;
}

.arrow {
  font-size: 36rpx;
  color: #ccc;
}

/* 菜单 */
.menu-list {
  background: #fff;
  border-radius: 16rpx;
  overflow: hidden;
}

.menu-item {
  display: flex;
  justify-content: space-between;
  padding: 28rpx 30rpx;
  font-size: 28rpx;
  border-bottom: 1px solid #eee;
}

.menu-item:last-child {
  border-bottom: none;
}

/* 退出 */
.logout {
  margin-top: 40rpx;
  background: #fff;
  text-align: center;
  padding: 28rpx;
  color: #ff3b30;
  border-radius: 16rpx;
  font-size: 30rpx;
}
</style>
