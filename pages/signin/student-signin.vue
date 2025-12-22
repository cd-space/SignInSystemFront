<template>
    <view class="page">
        <!-- 无签到 -->
        <view v-if="signInfo.length === 0" class="no-sign">
            <view class="no-sign-card">
                <view class="circle">
                    <text class="icon">✔</text>
                </view>
        
                <text class="title">当前无需签到</text>
                <text class="desc">
                    暂时没有进行中的签到任务<br />
                    请留意老师发起的签到
                </text>
            </view>
        </view>

        <!-- 有签到 -->
        <view v-else>
            <view
                v-for="(s, idx) in signInfo"
                :key="s.sign_task_id || idx"
                class="card"
            >
                <view class="card-header">
                    <text class="card-title">课堂签到</text>
                    <text class="status-badge" :class="statusClass(s.sign_status)">
                        {{ getStatusText(s.sign_status) }}
                    </text>
                </view>

                <view class="card-body">
                    <view class="row">
                        <text class="label">发起人</text>
                        <text class="value">{{ s.initiator_name }}</text>
                    </view>

                    <view class="row">
                        <text class="label">开始时间</text>
                        <text class="value">{{ s.created_at || s.created_time }}</text>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>


<script setup>
import { ref, computed, onUnmounted } from 'vue'
import { onShow, onHide } from '@dcloudio/uni-app'
import { quaryStudentSignApi } from '@/api/student.js'

const cacheUser = uni.getStorageSync('userinfo')

/** 签到信息（数组） */
const signInfo = ref([])

/** 轮询控制 */
const polling = ref(false)
let timerId = null
const POLL_INTERVAL = 1500 // ms

/** 状态文字映射 */
const getStatusText = (status) => {
    const map = {
        0: '未签到',
        1: '已签到',
        2: '请假',
        3: '迟到',
    }
    return map[status] ?? ''
}

const statusClass = (status) => {
    if (status === 1) return 'signed'
    if (status === 3) return 'late'
    if (status === 0) return 'not_signed'
    if (status === 2) return 'leave'
    return ''
}

/** 请求并返回数组（保证返回 []） */
const fetchMySign = async () => {
    if (!cacheUser || !cacheUser.id) {
        // 无用户 id，直接返回空数组
        return []
    }
    const res = await quaryStudentSignApi({ student_id: cacheUser.id })
    if (res && res.code === 200) {
        return Array.isArray(res.data) ? res.data : (res.data ? res.data : [])
    } else {
        uni.showToast({ title: '获取签到信息失败', icon: 'error' })
        return []
    }
}

/** 启动轮询：当存在任一未签到(0)时持续轮询，直到全部非 0 或页面隐藏/卸载 */
const startPollingIfNeeded = async () => {
    if (polling.value) return
    // 初次检查
    if (!signInfo.value.some(s => Number(s.sign_status) === 0)) return
    polling.value = true
    timerId = setInterval(async () => {
        try {
            const latest = await fetchMySign()
            signInfo.value = latest
            // 如果没有未签到了，停止轮询
            if (!signInfo.value.some(s => Number(s.sign_status) === 0)) {
                clearInterval(timerId)
                timerId = null
                polling.value = false
            }
        } catch (e) {
            console.error('轮询异常', e)
        }
    }, POLL_INTERVAL)
}

/** 停止轮询 */
const stopPolling = () => {
    if (timerId) {
        clearInterval(timerId)
        timerId = null
    }
    polling.value = false
}

onShow(async () => {
    signInfo.value = await fetchMySign()
    // 若有未签到项则开始轮询
    await startPollingIfNeeded()
    console.log('signInfo', signInfo.value);
})

onHide(() => {
    // 页面隐藏时停止轮询
    stopPolling()
})

onUnmounted(() => {
    stopPolling()
})
</script>

<style lang="scss">
.page {
    min-height: 100vh;
    background: #f6f7f8;
    padding: 40rpx 24rpx;
    box-sizing: border-box;
}

.center {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 30vh;
}

.loading-card,
.empty-card {
    width: 100%;
    max-width: 600rpx;
    background: #fff;
    border-radius: 24rpx;
    padding: 60rpx 40rpx;
    text-align: center;
    box-shadow: 0 16rpx 40rpx rgba(0, 0, 0, 0.06);
}

.tip {
    font-size: 28rpx;
    color: #666;
}

.empty-title {
    font-size: 34rpx;
    font-weight: 600;
    color: #333;
    margin-bottom: 16rpx;
}

.empty-sub {
    font-size: 26rpx;
    color: #999;
}

.card {
    background: #fff;
    border-radius: 28rpx;
    padding: 36rpx;
    box-shadow: 0 20rpx 50rpx rgba(64, 95, 255, 0.15);
	margin-top: 35rpx;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 32rpx;

    .card-title {
        font-size: 34rpx;
        font-weight: 600;
        color: #222;
    }
}

.status-badge {
    padding: 8rpx 20rpx;
    border-radius: 999rpx;
    font-size: 24rpx;
    font-weight: 500;

    &.not_signed {
        background: rgba(255, 152, 0, 0.15);
        color: #ff9800;
    }

    &.signed {
        background: rgba(76, 175, 80, 0.15);
        color: #4caf50;
    }

    &.late {
        background: rgba(244, 67, 54, 0.15);
        color: #f44336;
    }

    &.leave {
        background: rgba(91, 133, 255, 0.15);
        color: #5b85ff;
    }
}

.card-body {
    .row {
        display: flex;
        justify-content: space-between;
        padding: 20rpx 0;
        border-bottom: 1rpx solid #f0f0f0;

        &:last-child {
            border-bottom: none;
        }

        .label {
            font-size: 26rpx;
            color: #888;
        }

        .value {
            font-size: 28rpx;
            color: #333;
            font-weight: 500;
        }
    }
}

.no-sign {
    min-height: 85vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #f6f7f8;
}

.no-sign-card {
    width: 86%;
    background: #ffffff;
    border-radius: 32rpx;
    padding: 80rpx 40rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 0 24rpx 60rpx rgba(0, 0, 0, 0.08);
}

.circle {
    width: 120rpx;
    height: 120rpx;
    border-radius: 50%;
    background: linear-gradient(135deg, #5b8cff, #7aa2ff);
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 40rpx;

    .icon {
        color: #fff;
        font-size: 56rpx;
        font-weight: bold;
    }
}

.title {
    font-size: 36rpx;
    font-weight: 600;
    color: #222;
    margin-bottom: 16rpx;
}

.desc {
    font-size: 26rpx;
    color: #888;
    text-align: center;
    line-height: 1.6;
}


</style>
