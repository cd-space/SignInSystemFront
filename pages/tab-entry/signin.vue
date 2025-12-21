<template>
  <view>
    <student-signin v-if="role === 'student'|| role === ''" />
    <teacher-signin v-else-if="role === 'teacher' || role === 'admin'" />
  </view>
</template>

<script setup>
import { ref} from 'vue'
import { onShow } from '@dcloudio/uni-app'
import StudentSignin from '@/pages/signin/student-signin.vue'
import TeacherSignin from '@/pages/signin/teacher-signin.vue'

const role = ref('')

onShow(() => {
  const user = uni.getStorageSync('userinfo')
  role.value = user?.role || ''
})
</script>