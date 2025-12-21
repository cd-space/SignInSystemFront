<template>
	<view class="page">
		<!-- 无签到 -->
		<view v-if="!signInfo" class="no-sign">
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
		<view v-else class="card">
			<view class="card-header">
				<text class="card-title">课堂签到</text>
				<text class="status-badge" :class="signInfo.status">
					{{ statusText }}
				</text>
			</view>

			<view class="card-body">
				<view class="row">
					<text class="label">发起人</text>
					<text class="value">{{ signInfo.publisher }}</text>
				</view>

				<view class="row">
					<text class="label">开始时间</text>
					<text class="value">{{ signInfo.startTime }}</text>
				</view>
			</view>
		</view>
	</view>
</template>


<script setup>
import { ref, computed} from 'vue'
import { onShow } from '@dcloudio/uni-app'

/** 签到信息（为空表示没有签到） */
const signInfo = ref(null)

/** 状态文字映射 */
const statusText = computed(() => {
	if (!signInfo.value) return ''
	const map = {
		not_signed: '未签到',
		signed: '已签到',
		late: '迟到'
	}
	return map[signInfo.value.status]
})

/** 模拟接口请求 */
const fetchMySign = () => {
	return new Promise(resolve => {
		setTimeout(() => {
			// 👇 切换这里即可模拟不同情况
			const hasSign = true

			if (!hasSign) {
				resolve(null)
			} else {
				resolve({
					signId: 'sign_001',
					publisher: '王老师',
					startTime: '2025-12-20 09:00',
					status: 'not_signed' // not_signed | signed | late
				})
			}
		}, 800)
	})
}

onShow(async () => {
	signInfo.value = await fetchMySign()
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
