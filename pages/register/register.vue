<template>
  <view class="register-page">
    <view class="title">注册账号</view>

    <!-- 姓名（必填） -->
    <view class="form-item">
      <input
        v-model="name"
        placeholder="请输入姓名（必填）"
        placeholder-class="placeholder"
      />
    </view>

    <!-- 手机号（必填） -->
    <view class="form-item">
      <input
        v-model="phone"
        placeholder="请输入手机号（必填）"
        placeholder-class="placeholder"
      />
    </view>

    <!-- 学号（非必填） -->
    <view class="form-item">
      <input
        v-model="studentId"
        placeholder="请输入学号（可选）"
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
        {{ showPassword ? '👁️' : '🙈' }}
      </view>
    </view>

    <button class="btn" @click="handleRegister">
      注册
    </button>
  </view>
</template>


<script setup>
import { ref } from 'vue'
import { registerApi } from '@/api/auth'

const name = ref('')
const phone = ref('')
const studentId = ref('')
const password = ref('')
const showPassword = ref(false)

// 切换密码可见
const togglePassword = () => {
  showPassword.value = !showPassword.value
}

// 手机号正则校验
const isValidPhone = (val) => {
  return /^1[3-9]\d{9}$/.test(val)
}

const handleRegister = async () => {
  // 必填校验
  if (!name.value || !phone.value || !password.value) {
    uni.showToast({
      title: '姓名、手机号和密码必填',
      icon: 'none'
    })
    return
  }

  // 手机号格式校验
  if (!isValidPhone(phone.value)) {
    uni.showToast({
      title: '请输入有效手机号',
      icon: 'none'
    })
    return
  }

  const params = {
    name: name.value,
    phone: phone.value,
    student_id: studentId.value || null,
    password: password.value,
	role:'student'
  }

  try {
    const res = await registerApi(params)

    uni.showToast({
      title: '注册成功',
      icon: 'success'
    })

    uni.navigateBack()
  } catch (error) {
    console.log('注册失败', error)
    uni.showToast({
      title: error?.msg || '注册失败，请重试',
      icon: 'none'
    })
  }
}
</script>


<style lang="scss" scoped>
.register-page {
  min-height: 100vh;
  background: #fff;
  padding: 80rpx 40rpx;
}

.title {
  font-size: 44rpx;
  font-weight: 600;
  margin-bottom: 60rpx;
}

.btn {
  margin-top: 40rpx;
  background: #2979ff;
  color: #fff;
  border-radius: 50rpx;
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
</style>
