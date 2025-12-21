<template>
  <view class="detail-page">
    <!-- 顶部信息 -->
    <view class="header">
      <view class="title">签到详情</view>
      <view class="sub">
        <view class="time-row">
          <!-- 进行中只显示开始时间；已结束显示 开始 - 结束 -->
          <text v-if="isOngoing">开始：{{ taskTime }}</text>
          <text v-else>时间：{{ taskTime }} - {{ taskEndTime || '-' }}</text>
        </view>
        <view class="meta-row">
          <text>{{ classesText }}</text>
          <text v-if="taskStatusText">　·　{{ taskStatusText }}</text>
        </view>
      </view>
    </view>

    <!-- 学生签到列表 -->
    <view class="list">
      <view
        class="student-item"
        v-for="(item, index) in sortedStudents"
        :key="item.user_id ?? item.student_id ?? index"
      >
        <view class="left">
          <text class="name">{{ item.name || '学生' }}</text>
        </view>

        <picker
          mode="selector"
          :range="statusOptions"
          :value="Number(item.status) || 0"
          :disabled="item.saving || !isOngoing"
          @change="changeStatus(item, $event)"
        >
          <text
            class="status"
            :style="{ color: statusColor[item.status ?? 0] }"
          >
            {{ statusOptions[item.status ?? 0] }}<text v-if="item.saving">（保存中）</text>
          </text>
        </picker>
      </view>

      <view v-if="students.length === 0" class="empty-tip">
        暂无学生数据
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { querySignTaskStudentsApi, updateSignStatusApi } from '@/api/teacher.js'

const statusOptions = ['未签到', '已签到', '请假', '迟到']
const statusColor = {
  0: '#ff3b30',
  1: '#4caf50',
  2: '#007aff',
  3: '#ff3b30'
}

const students = ref([])
const taskInfo = ref({})
const signTaskId = ref('')

const getSignTaskIdFromRoute = () => {
  try {
    const pages = getCurrentPages()
    const current = pages[pages.length - 1] || {}
    return current?.options?.recordId || current?.options?.sign_task_id || ''
  } catch (e) {
    return ''
  }
}
signTaskId.value = getSignTaskIdFromRoute()

const fetchDetail = async () => {
  if (!signTaskId.value) return
  try {
    const res = await querySignTaskStudentsApi({ sign_task_id: signTaskId.value })
    if (res && res.code === 200) {
      const d = res ?? {}
      // 保存任务信息（created_time/update_time/task_status/class_name）
      taskInfo.value = {
        created_time: d.created_time ?? d.start_time ?? d.time ?? '',
        update_time: d.update_time ?? d.end_time ?? '',
        class_name: d.class_name ?? d.classNames ?? [],
        task_status: d.task_status ?? d.status ?? ''
      }
      // d.data 或 d 为数组
      let list = []
      if (Array.isArray(d)) list = d
      else if (Array.isArray(d.data)) list = d.data
      else if (Array.isArray(d.students)) list = d.students
      else if (Array.isArray(res.data)) list = res.data

      students.value = (list || []).map((it, idx) => ({
        user_id: it.user_id ?? it.student_id ?? it.id ?? (`_${idx}`),
        name: it.name ?? it.student_name ?? it.nickname ?? '学生',
        status: Number(it.sign_status ?? it.status ?? 0),
        raw: it,
        saving: false
      }))
    } else {
      uni.showToast({ title: '获取详情失败', icon: 'error' })
    }
  } catch (err) {
    console.error(err)
    uni.showToast({ title: '获取详情异常', icon: 'error' })
  }
}

const sortedStudents = computed(() => {
  return [...students.value].sort((a, b) => {
    if (a.status === b.status) return (a.user_id + '') > (b.user_id + '') ? 1 : -1
    return a.status - b.status
  })
})

const changeStatus = async (item, e) => {
  const newStatus = Number(e.detail.value)
  const prev = item.status
  if (prev === newStatus) return
  item.status = newStatus
  item.saving = true
  try {
    const payload = {
      sign_task_id: signTaskId.value,
      user_id: item.user_id,
      status: newStatus
    }
    const res = await updateSignStatusApi(payload)
    if (res && res.code === 200) {
      uni.showToast({ title: '更新成功', icon: 'success' })
      // 可选：更新 taskInfo.update_time 来反映变动时间
    } else {
      item.status = prev
      uni.showToast({ title: res?.message ?? '更新失败', icon: 'error' })
    }
  } catch (err) {
    item.status = prev
    console.error(err)
    uni.showToast({ title: '更新异常', icon: 'error' })
  } finally {
    item.saving = false
  }
}

/* 头部显示文本 */
const taskTime = computed(() => taskInfo.value.created_time || '-')
const taskEndTime = computed(() => taskInfo.value.update_time || '')
const classesText = computed(() => {
  const names = taskInfo.value.class_name || []
  return Array.isArray(names) ? names.join('，') : (names || '-')
})
const taskStatusText = computed(() => {
  const st = Number(taskInfo.value.task_status)
  if (st === 1) return '进行中'
  return '已结束'
})

const isOngoing = computed(() => Number(taskInfo.value.task_status) === 1)

onMounted(() => {
  fetchDetail()
})
</script>

<style lang="scss" scoped>
.detail-page {
  min-height: 100vh;
  background: #f6f7f8;
  padding-bottom: 40rpx;
}

.header {
  background: #fff;
  padding: 30rpx;
  margin-bottom: 12rpx;
}

.title {
  font-size: 34rpx;
  font-weight: 600;
}

.sub {
  margin-top: 10rpx;
  font-size: 26rpx;
  color: #999;
}

.time-row {
  font-size: 26rpx;
  color: #666;
}

.meta-row {
  margin-top: 6rpx;
  font-size: 24rpx;
  color: #999;
}

.list {
  padding: 12rpx 20rpx;
}

.student-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  padding: 18rpx;
  border-radius: 12rpx;
  margin-bottom: 10rpx;
}

.left {
  display: flex;
  flex-direction: column;
}

.name {
  font-size: 30rpx;
  color: #222;
}

.meta {
  font-size: 22rpx;
  color: #888;
  margin-top: 6rpx;
}

.status {
  font-size: 26rpx;
  font-weight: 500;
}

.empty-tip {
  text-align: center;
  color: #999;
  padding: 40rpx 0;
}
</style>
