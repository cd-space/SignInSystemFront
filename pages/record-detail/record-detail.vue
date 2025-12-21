<template>
  <view class="detail-page">
    <!-- 顶部信息 -->
    <view class="header">
      <view class="title">签到详情</view>
      <view class="sub">2025-12-19 09:00 ｜ 软件工程 1 班</view>
    </view>

    <!-- 学生签到列表 -->
    <view class="list">
      <view
        class="student-item"
        v-for="(item, index) in sortedStudents"
        :key="item.id"
      >
        <text class="name">{{ item.name }}</text>

        <picker
          mode="selector"
          :range="statusOptions"
          :value="item.status"
          @change="changeStatus(item.id, $event)"
        >
          <text
            class="status"
            :style="{ color: statusColor[item.status] }"
          >
            {{ statusOptions[item.status] }}
          </text>
        </picker>
      </view>
    </view>

    <!-- 底部固定按钮 -->
    <view class="footer">
      <button class="save-btn" @click="saveResult">
        保存修改
      </button>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

/**
 * 状态说明
 * 0 未签到（红）
 * 1 已签到（绿）
 * 2 病假（蓝）
 * 3 迟到（红）
 */
const statusOptions = ['未签到', '已签到', '病假', '迟到']
const statusColor = {
  0: '#ff3b30',
  1: '#4cd964',
  2: '#007aff',
  3: '#ff3b30'
}

const students = ref([])

/**
 * 假数据获取
 */
const fetchDetail = () => {
  students.value = [
    { id: 1, name: '张三', status: 0 },
    { id: 2, name: '李四', status: 1 },
    { id: 3, name: '王五', status: 3 },
    { id: 4, name: '赵六', status: 2 },
    { id: 5, name: '钱七', status: 0 }
  ]
}

/**
 * 未签到排在前面
 */
const sortedStudents = computed(() => {
  return [...students.value].sort((a, b) => a.status - b.status)
})

/**
 * 修改状态
 */
const changeStatus = (id, e) => {
  const target = students.value.find(item => item.id === id)
  if (target) {
    target.status = Number(e.detail.value)
  }
}

/**
 * 保存（暂时只是打印）
 */
const saveResult = () => {
  console.log('最终签到结果：', students.value)

  uni.showToast({
    title: '保存成功',
    icon: 'success'
  })
}

onMounted(() => {
  fetchDetail()
})
</script>

<style lang="scss" scoped>
.detail-page {
  min-height: 100vh;
  background: #f6f7f8;
  padding-bottom: 140rpx;
}

.header {
  background: #fff;
  padding: 30rpx;
  margin-bottom: 20rpx;
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

.list {
  padding: 0 20rpx;
}

.student-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  padding: 24rpx;
  border-radius: 16rpx;
  margin-bottom: 20rpx;
}

.name {
  font-size: 30rpx;
}

.status {
  font-size: 28rpx;
  font-weight: 500;
}

.footer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background: #fff;
  padding: 20rpx 30rpx;
  box-shadow: 0 -6rpx 20rpx rgba(0, 0, 0, 0.05);
}

.save-btn {
  background: #007aff;
  color: #fff;
  font-size: 30rpx;
  border-radius: 16rpx;
}
</style>
