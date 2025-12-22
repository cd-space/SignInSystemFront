<template>
  <view class="record-page">
    <!-- 无记录提示 -->
    <view v-if="records.length === 0" class="empty">
      <view class="empty-card">
        <view class="empty-icon">📭</view>
        <view class="empty-title">暂无发布的签到</view>
        <view class="empty-desc">还没有发起过签到，稍后再来查看</view>
      </view>
    </view>

    <!-- 有记录 -->
    <view v-else>
      <view
        class="record-item"
        v-for="(record, index) in records"
        :key="record.sign_task_id || record.id || index"
        @click="viewDetail(record)"
      >
        <view class="record-header">
          <view class="left">
            <!-- 若已结束（status !== 1）显示开始/结束时间；进行中仅显示开始时间 -->
            <view class="time-block">
              <text class="time">开始：{{ record.created_time || record.time }}</text>
              <text v-if="record.status !== 1" class="time end">结束：{{ record.update_time || record.endTime || '-' }}</text>
            </view>
            <text class="classes">{{ (record.class_name || record.classNames || []).join('，') }}</text>
          </view>
          <view class="right">
            <text class="status-tag" :class="record.status === 1 ? 'ongoing' : 'ended'">
              {{ record.status === 1 ? '进行中' : '已结束' }}
            </text>
            <text class="summary">已签到 {{ record['1num'] ?? record.checkedCount ?? 0 }}/{{ record.total_num ?? record.totalCount ?? 0 }}</text>
          </view>
        </view>

        <view class="counts">
          <view class="count-item not-signed">
            <text class="num">{{ record['0num'] ?? 0 }}</text>
            <text class="label">未签到</text>
          </view>
          <view class="count-item signed">
            <text class="num">{{ record['1num'] ?? 0 }}</text>
            <text class="label">已签到</text>
          </view>
          <view class="count-item leave">
            <text class="num">{{ record['2num'] ?? 0 }}</text>
            <text class="label">请假</text>
          </view>
          <view class="count-item late">
            <text class="num">{{ record['3num'] ?? 0 }}</text>
            <text class="label">迟到</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { queryTeacherHistoryApi } from '@/api/teacher.js'

const cacheUser = uni.getStorageSync('userinfo')
const records = ref([])

const viewDetail = (record) => {
  const id = record.sign_task_id || record.id
  if (!id) return
  uni.navigateTo({
    url: `/pages/record-detail/record-detail?recordId=${id}`
  })
}

onShow(async () => {
  try {
    const res = await queryTeacherHistoryApi({ initiator: cacheUser.id })
    records.value = res?.data ?? []
  } catch (error) {
    uni.showToast({ title: '获取签到记录失败', icon: 'error' })
    console.error(error)
  }
})
</script>

<style lang="scss" scoped>
.record-page {
  padding: 30rpx;
  background: #f6f7f8;
  min-height: 100vh;
}

.empty {
  min-height: 70vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.empty-card {
  background: #fff;
  width: 84%;
  padding: 40rpx;
  border-radius: 18rpx;
  text-align: center;
  box-shadow: 0 12rpx 30rpx rgba(0,0,0,0.06);
}

.empty-icon {
  font-size: 48rpx;
  margin-bottom: 12rpx;
}

.empty-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 8rpx;
}

.empty-desc {
  font-size: 24rpx;
  color: #888;
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
  align-items: flex-start;
  margin-bottom: 14rpx;
}

.left .time {
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
}

.time-block .time {
  display: block;
}

.time-block .end {
  font-size: 24rpx;
  color: #888;
  margin-top: 6rpx;
}

.left .classes {
  font-size: 24rpx;
  color: #888;
  margin-top: 8rpx;
}

.right {
  text-align: right;
}

.status-tag {
  display: inline-block;
  padding: 6rpx 14rpx;
  border-radius: 999rpx;
  font-size: 22rpx;
  color: #fff;
  margin-bottom: 8rpx;
}

.status-tag.ongoing {
  background: linear-gradient(90deg,#4caf50,#67d37f);
}

.status-tag.ended {
  background: #e6e9ef;
  color: #7a8596;
}

.summary {
  display: block;
  font-size: 24rpx;
  color: #666;
  margin-top: 6rpx;
}

/* counts 行 */
.counts {
  display: flex;
  justify-content: space-between;
  gap: 12rpx;
  margin-top: 6rpx;
}

.count-item {
  flex: 1;
  background: #fafafa;
  padding: 12rpx;
  border-radius: 12rpx;
  text-align: center;
}

.count-item .num {
  display: block;
  font-size: 28rpx;
  font-weight: 700;
  margin-bottom: 6rpx;
}

.count-item .label {
  font-size: 22rpx;
  color: #666;
}

/* 颜色 */
.count-item.not-signed { background: rgba(255,152,0,0.06); }
.count-item.signed { background: rgba(76,175,80,0.06); }
.count-item.leave { background: rgba(91,133,255,0.06); }
.count-item.late { background: rgba(244,67,54,0.06); }
</style>
