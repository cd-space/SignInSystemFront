<template>
  <view class="account-page">
    <view class="title">修改密码</view>

    <!-- 原密码 -->
    <view class="form-item">
      <input
        v-model="oldPassword"
        :type="showOldPassword ? 'text' : 'password'"
        placeholder="请输入原密码"
        placeholder-class="placeholder"
      />
      <view class="eye" @click="toggleOldPassword">
        {{ showOldPassword ? '👁' : '🙈' }}
      </view>
    </view>

    <!-- 新密码 -->
    <view class="form-item">
      <input
        v-model="newPassword"
        :type="showNewPassword ? 'text' : 'password'"
        placeholder="请输入新密码"
        placeholder-class="placeholder"
      />
      <view class="eye" @click="toggleNewPassword">
        {{ showNewPassword ? '👁' : '🙈' }}
      </view>
    </view>

    <button class="btn" @click="handleChangePassword">
      提交
    </button>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { changePasswordApi } from '@/api/auth' 

const oldPassword = ref('')
const newPassword = ref('')

const showOldPassword = ref(false)
const showNewPassword = ref(false)

const toggleOldPassword = () => {
  showOldPassword.value = !showOldPassword.value
}

const toggleNewPassword = () => {
  showNewPassword.value = !showNewPassword.value
}

const handleChangePassword = async () => {
  if (!oldPassword.value || !newPassword.value) {
    uni.showToast({
      title: '请填写完整信息',
      icon: 'none'
    })
    return
  }

  const user = uni.getStorageSync('userinfo')

  try {
    const res = await changePasswordApi({
      old_password: oldPassword.value,
      new_password: newPassword.value,
      id: user?.id
    })

    uni.showToast({
      title: '修改成功',
      icon: 'success'
    })


    uni.removeStorageSync('userinfo')

    setTimeout(() => {
        uni.navigateBack()
    }, 800)

  } catch (err) {
    uni.showToast({
      title: err?.message || '修改失败',
      icon: 'none'
    })
  }
}
</script>

<style lang="scss" scoped>
.account-page {
  padding: 30rpx;
  background: #f6f7f8;
  min-height: 100vh;
}

.title {
  font-size: 34rpx;
  font-weight: 600;
  margin-bottom: 40rpx;
}

.form-item {
  margin-bottom: 30rpx;
  background: #fff;
  border-radius: 16rpx;
  padding: 0 24rpx;
  position: relative;

  input {
    height: 90rpx;
    font-size: 30rpx;
    width: 100%;
  }

  .eye {
    position: absolute;
    right: 24rpx;
    top: 50%;
    transform: translateY(-50%);
    font-size: 28rpx;
  }
}

.btn {
  background: #007aff;
  color: #fff;
  font-size: 30rpx;
  text-align: center;
  padding: 20rpx;
  border-radius: 16rpx;
  margin-top: 40rpx;
}
</style>
