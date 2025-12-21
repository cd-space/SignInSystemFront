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
				:key="item.id"
				class="record-card"
			>
				<view class="card-top">
					<text class="publisher">{{ item.publisher }}</text>
					<text class="result" :class="item.result">
						{{ resultText(item.result) }}
					</text>
				</view>

				<view class="time">
					<text>开始：{{ item.startTime }}</text>
					<text>结束：{{ item.endTime }}</text>
				</view>
			</view>
		</scroll-view>
	</view>
</template>


<script setup>
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'

/** 签到记录列表 */
const records = ref([])

/** 结果文案 */
const resultText = (result) => {
	const map = {
		signed: '已签到',
		late: '迟到',
		absent: '缺勤'
	}
	return map[result]
}

/** 模拟接口 */
const fetchSignRecords = () => {
	return new Promise(resolve => {
		setTimeout(() => {
			// 👇 改成 [] 即可测试“暂无记录”
			// resolve([
			// 	{
			// 		id: '1',
			// 		publisher: '王老师',
			// 		startTime: '2025-12-18 08:00',
			// 		endTime: '2025-12-18 08:15',
			// 		result: 'signed'
			// 	},
			// 	{
			// 		id: '2',
			// 		publisher: '李老师',
			// 		startTime: '2025-12-17 14:00',
			// 		endTime: '2025-12-17 14:10',
			// 		result: 'late'
			// 	},
			// 	{
			// 		id: '3',
			// 		publisher: '张老师',
			// 		startTime: '2025-12-16 10:00',
			// 		endTime: '2025-12-16 10:10',
			// 		result: 'absent'
			// 	}
			// ])
			resolve([])
		}, 800)
	})
}

onShow(async () => {
	records.value = await fetchSignRecords()
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

	&.absent {
		background: rgba(244, 67, 54, 0.15);
		color: #f44336;
	}
}

.time {
	display: flex;
	flex-direction: column;
	font-size: 26rpx;
	color: #666;
	line-height: 1.6;
}

</style>