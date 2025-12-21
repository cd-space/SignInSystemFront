<template>
  <view class="record-page">
    <view class="record-item" v-for="(record, index) in records" :key="record.id" @click="viewDetail(record)">
      <view class="record-header">
        <text>{{ record.time }}</text>
        <text>{{ record.classNames.join(', ') }}</text>
      </view>
      <view class="record-summary">
        已签到 {{ record.checkedCount }}/{{ record.totalCount }}
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const records = ref([
  {
    id: 1,
    time: '2025-12-19 09:00',
    classNames: ['一班', '二班'],
    checkedCount: 15,
    totalCount: 20
  },
  {
    id: 2,
    time: '2025-12-18 14:00',
    classNames: ['三班'],
    checkedCount: 10,
    totalCount: 12
  }
])

const viewDetail = (record) => {
  uni.navigateTo({
    url: `/pages/record-detail/record-detail?recordId=${record.id}`
  })
}
</script>

<style lang="scss" scoped>
.record-page {
  padding: 30rpx;
  background: #f6f7f8;
  min-height: 100vh;
}

.record-item {
  background: #fff;
  padding: 24rpx;
  border-radius: 16rpx;
  margin-bottom: 20rpx;
}

.record-header {
  display: flex;
  justify-content: space-between;
  font-size: 28rpx;
  font-weight: 500;
  margin-bottom: 10rpx;
}

.record-summary {
  font-size: 26rpx;
  color: #666;
}
</style>
