<template>
  <view class="login-page">
    <view class="title">欢迎登录</view>

    <!-- 账号输入 -->
    <view class="form-item">
      <input
        v-model="account"
        placeholder="请输入手机号或学号"
        placeholder-class="placeholder"
      />
    </view>

    <!-- 密码 -->
    <view class="form-item">
      <input
        v-model="password"
        :type="showPassword ? 'text' : 'password'"
        placeholder="请输入密码"
        placeholder-class="placeholder"
      />
    
      <view class="eye" @click="togglePassword">
        {{ showPassword ? '👁' : '️🙈' }}
      </view>
    </view>

    <!-- 登录按钮 -->
    <button class="btn" @click="handleLogin">
      登录
    </button>

    <!-- 去注册 -->
    <view class="footer">
      还没有账号？
      <text class="link" @click="goRegister">去注册</text>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { loginApi } from '@/api/auth'

const account = ref('')
const password = ref('')

const showPassword = ref(false)

const togglePassword = () => {
  showPassword.value = !showPassword.value
}


const isPhone = (val) => {
  return /^1[3-9]\d{9}$/.test(val)
}

const handleLogin = async () => {
  if (!account.value || !password.value) {
    uni.showToast({
      title: '请输入完整信息',
      icon: 'none'
    })
    return
  }

  const isPhone = /^1[3-9]\d{9}$/.test(account.value)

  const params = isPhone
    ? {
        phone: account.value,
        password: password.value
      }
    : {
        student_id: account.value,
        password: password.value
      }

  try {
    const data = await loginApi(params)

    uni.setStorageSync('userinfo', data)

    uni.showToast({
      title: '登录成功',
      icon: 'success'
    })

    uni.switchTab({
      url: '/pages/mine/mine'
    })
  } catch (e) {
    console.log('登录失败', e)
  }
}

const goRegister = () => {
  uni.navigateTo({
    url: '/pages/register/register'
  })
}
</script>

<style lang="scss" scoped>
.login-page {
  min-height: 100vh;
  background: #fff;
  padding: 80rpx 40rpx;
}

.title {
  font-size: 44rpx;
  font-weight: 600;
  margin-bottom: 60rpx;
}

.form-item {
  position: relative;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #eee;

  input {
    flex: 1;
    height: 90rpx;
    font-size: 30rpx;
  }

  .eye {
    position: absolute;
    right: 20rpx;
    font-size: 32rpx;
    color: #999;
  }
}

.btn {
  margin-top: 40rpx;
  background: #2979ff;
  color: #fff;
  border-radius: 50rpx;
}

.footer {
  margin-top: 40rpx;
  text-align: center;
  color: #999;
}

.link {
  color: #2979ff;
}
</style>
