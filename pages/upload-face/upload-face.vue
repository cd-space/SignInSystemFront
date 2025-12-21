<template>
	<view class="page">
		<!-- 摄像头预览 -->
		<camera
			class="camera"
			device-position="front"
			flash="off"
		></camera>

		<!-- 引导遮罩 -->
		<view class="mask">
			<view class="face-frame"></view>
			<text class="tip">请将人脸对准取景框</text>
		</view>

		<!-- 操作按钮 -->
		<view class="bottom">
			<view class="btn" @click="handleCapture">
				采集人脸信息
			</view>
		</view>
	</view>
</template>


<script setup>
const handleCapture = () => {
	const ctx = uni.createCameraContext()
	ctx.takePhoto({
		quality: 'high',
		success(res) {
			console.log('采集到的图片路径：', res.tempImagePath)
			// 👉 后续：上传到后端 / 提取人脸特征
			uni.showToast({
				title: '采集成功',
				icon: 'success'
			})
		},
		fail() {
			uni.showToast({
				title: '采集失败，请重试',
				icon: 'none'
			})
		}
	})
}
</script>

<style lang="scss">
.page {
	position: relative;
	width: 100vw;
	height: 100vh;
	background: #000;
	overflow: hidden;
}

.camera {
	width: 100%;
	height: 100%;
}

/* 遮罩层 */
.mask {
	position: absolute;
	inset: 0;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	pointer-events: none;
}

/* 人脸引导框 */
.face-frame {
	width: 420rpx;
	height: 520rpx;
	border: 4rpx solid #4a8cff;
	border-radius: 50%;
	box-shadow: 0 0 0 2000rpx rgba(0, 0, 0, 0.45);
}

/* 提示文字 */
.tip {
	margin-top: 36rpx;
	color: #fff;
	font-size: 28rpx;
	letter-spacing: 2rpx;
}

/* 底部区域 */
.bottom {
	position: absolute;
	left: 0;
	right: 0;
	bottom: 80rpx;
	display: flex;
	justify-content: center;
}

/* 按钮 */
.btn {
	background: #4a8cff;
	color: #fff;
	padding: 26rpx 90rpx;
	border-radius: 999rpx;
	font-size: 30rpx;
	box-shadow: 0 12rpx 30rpx rgba(74, 140, 255, 0.45);
}

</style>