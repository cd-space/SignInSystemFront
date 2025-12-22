<template>
    <view class="page">
        <!-- 无记录 -->
        <view v-if="records.length === 0" class="empty">
            <view class="empty-card">
                <view class="empty-icon">📄</view>
                <view class="empty-title">暂无签到记录</view>
                <view class="empty-desc">你的签到历史会显示在这里</view>
            </view>
        </view>

        <!-- 有记录 -->
        <scroll-view
            v-else
            scroll-y
            class="list"
        >
            <view
                v-for="item in records"
                :key="item.sign_task_id || item.id"
                class="record-card"
            >
                <view class="card-top">
                    <view style="display:flex;align-items:center;gap:12rpx">
                        <text class="publisher">{{ item.initiator_name || item.publisher }}</text>
                        <text class="task-status" :class="taskStatusClass(item.sign_task_status)">
                            {{ taskStatusText(item.sign_task_status) }}
                        </text>
                    </view>

                    <text class="result" :class="statusClass(item.my_sign_status)">
                        {{ resultText(item.my_sign_status) }}
                    </text>
                </view>

                <view class="time">
                    <text v-if="item.sign_task_status === 1">开始：{{ item.created_at }}</text>
                    <text v-else>时间：{{ item.created_at }} - {{ item.updated_at || '-' }}</text>
                </view>

                <view class="classes" v-if="item.class_name && item.class_name.length">
                    <text>班级：{{ item.class_name.join('，') }}</text>
                </view>
            </view>
        </scroll-view>
    </view>
</template>


<script setup>
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { quaryStudentHistoryApi } from '@/api/student.js'

const cacheUser = uni.getStorageSync('userinfo')
/** 签到记录列表 */
const records = ref([])

/** 状态文字（按 my_sign_status 数字） */
const resultText = (status) => {
    const map = {
        0: '未签到',
        1: '已签到',
        2: '请假',
        3: '迟到'
    }
    return map[Number(status)] ?? ''
}

const statusClass = (status) => {
    if (Number(status) === 1) return 'signed'
    if (Number(status) === 3) return 'late'
    if (Number(status) === 0) return 'not-signed'
    if (Number(status) === 2) return 'leave'
    return ''
}

/** 签到任务状态文案与样式（sign_task_status）*/
const taskStatusText = (s) => {
    return Number(s) === 1 ? '进行中' : '已结束'
}
const taskStatusClass = (s) => {
    return Number(s) === 1 ? 'ongoing' : 'ended'
}

onShow(async () => {
    try {
        if (!cacheUser || !cacheUser.id) {
            // 无用户 id，直接返回空数组
            return []
        }
        const res = await quaryStudentHistoryApi({ student_id: cacheUser.id })
        if (res && res.code === 200) {
            records.value = Array.isArray(res.data) ? res.data : (res.data ? res.data : [])
        } else {
            uni.showToast({ title: '获取记录失败', icon: 'error' })
        }
    } catch (err) {
        console.error(err)
        uni.showToast({ title: '获取记录异常', icon: 'error' })
    }
})
</script>


<style lang="scss">
.page {
    min-height: 100vh;
    background: #f6f8fc;
}

.center {
    margin-top: 40vh;
    text-align: center;
    color: #999;
}

.loading-text {
    font-size: 26rpx;
}

.empty {
    min-height: 82vh;
    display: flex;
    justify-content: center;
    align-items: center;
}

.empty-card {
    background: #fff;
    width: 80%;
    padding: 60rpx 40rpx;
    border-radius: 28rpx;
    text-align: center;
    box-shadow: 0 20rpx 50rpx rgba(0, 0, 0, 0.08);
}

.empty-icon {
    font-size: 64rpx;
    margin-bottom: 24rpx;
}

.empty-title {
    font-size: 34rpx;
    font-weight: 600;
    color: #222;
    margin-bottom: 12rpx;
}

.empty-desc {
    font-size: 26rpx;
    color: #888;
}

.list {
    padding: 24rpx;
    box-sizing: border-box;
}

.record-card {
    background: #fff;
    border-radius: 24rpx;
    padding: 32rpx;
    margin-bottom: 24rpx;
    box-shadow: 0 12rpx 30rpx rgba(0, 0, 0, 0.06);
}

.card-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;
}

.publisher {
    font-size: 30rpx;
    font-weight: 600;
    color: #333;
}

.task-status {
    font-size: 20rpx;
    padding: 4rpx 10rpx;
    border-radius: 999rpx;
    color: #fff;
}

/* 任务状态颜色 */
.task-status.ongoing {
    background: linear-gradient(90deg,#4caf50,#67d37f);
}
.task-status.ended {
    background: #e6e9ef;
    color: #7a8596;
}

.result {
    font-size: 24rpx;
    padding: 6rpx 18rpx;
    border-radius: 999rpx;

    &.signed {
        background: rgba(76, 175, 80, 0.15);
        color: #4caf50;
    }

    &.late {
        background: rgba(255, 152, 0, 0.15);
        color: #ff9800;
    }

    &.not-signed {
        background: rgba(255, 152, 0, 0.06);
        color: #ff9800;
    }

    &.leave {
        background: rgba(91, 133, 255, 0.15);
        color: #5b85ff;
    }
}

.time {
    display: flex;
    flex-direction: column;
    font-size: 26rpx;
    color: #666;
    line-height: 1.6;
    margin-top: 10rpx;
}

.classes {
    margin-top: 8rpx;
    font-size: 24rpx;
    color: #888;
}
</style>