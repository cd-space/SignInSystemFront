<template>
  <view>
    <student-signin-record v-if="role === 'student'|| role === ''" />
    <teacher-signin-record v-else-if="role === 'teacher' || role === 'admin'" />
  </view>
</template>

<script setup>
import { ref} from 'vue'
import { onShow } from '@dcloudio/uni-app'
import StudentSigninRecord from '@/pages/sign-in-record/student-signinrecord.vue'
import TeacherSigninRecord from '@/pages/sign-in-record/teacher-signinrecord.vue'

const role = ref('')

onShow(() => {
  const user = uni.getStorageSync('userinfo')
  role.value = user?.role || ''
})
</script>
