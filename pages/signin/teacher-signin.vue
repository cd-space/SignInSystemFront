<template>
  <view class="teacher-signin-page">
    <!-- 发布/结束签到 -->
	<view class="action-card">
		<view class="action-header">
			<text class="action-title">课堂签到</text>
			<text class="action-desc">
				{{ isSigninActive ? '当前签到进行中' : '请选择班级并发布签到' }}
			</text>
		</view>

		<button class="action-btn" @click="toggleSignin">
			{{ isSigninActive ? '结束签到' : '发布签到' }}
		</button>
	</view>

	<!-- 班级选择 -->
	<view v-if="!isSigninActive" class="class-card">
		<view class="card-title">选择签到班级</view>

		<view class="class-grid">
			<view
				v-for="cls in classes"
				:key="cls.id"
				class="class-box"
				:class="{ active: selectedClasses.includes(cls.id) }"
				@click="toggleClass(cls.id)"
			>
				{{ cls.name }}
			</view>
		</view>
	</view>

    <!-- 上传签到图片 -->
    <view v-if="isSigninActive" class="upload-section">
      <view class="title">上传签到图片</view>
      <view class="upload-list">
        <view class="upload-item" v-for="(img, index) in images" :key="index">
          <image :src="img" class="img" />
          <!-- <view class="remove" @click="removeImage(index)">✕</view> -->
        </view>
        <button class="upload-btn" @click="chooseImage">+ 上传图片</button>
      </view>
    </view>

    <!-- 学生签到结果 -->
    <view v-if="isSigninActive" class="results-section">
      <view class="title">学生签到结果</view>
      <view class="result-list">
		<view class="result-item" v-for="(student, index) in students" :key="student.id">
		  <text>{{ student.name }}</text>
		  <picker :value="student.statusIndex" :range="statusOptions" @change="updateStatus(index, $event)">
			<text :style="{ color: statusColors[student.statusIndex] }">
			  {{ statusOptions[student.statusIndex] }}
			</text>
		  </picker>
		</view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
// import { uniChooseImage } from '@dcloudio/uni-app'
import { seacherclassApi, publishSignIgApi, queryTeacherSign,querySignTaskStudents } from '@/api/teacher.js'

const cacheUser = uni.getStorageSync('userinfo')

/* 状态控制 */
const isSigninActive = ref(false)

/* 班级列表示例 */
const classes = ref([])
const selectedClasses = ref([])
// 签到任务的id
const taskId = ref(null)

 

/* 上传图片 */
const images = ref([])

/* 学生签到结果 */
const students = ref([
  { id: 1, name: '张三', statusIndex: 0 },
  { id: 2, name: '李四', statusIndex: 0 },
  { id: 3, name: '王五', statusIndex: 0 }
])
const statusOptions = ['未签到', '已签到', '请假', '迟到']
const statusColors = ['#ff3b30', '#4cd964', '#007aff', '#ff3b30'] // 未签到/迟到红色, 已签到绿色, 请假蓝色

/* 切换班级选择 */
const toggleClass = (id) => {
  const index = selectedClasses.value.indexOf(id)
  if (index === -1) selectedClasses.value.push(id)
  else selectedClasses.value.splice(index, 1)
}

/* 上传图片 */
const chooseImage = async () => {
  const res = await uni.chooseImage({
    count: 9 - images.value.length,
    sizeType: ['original', 'compressed'],
    sourceType: ['album', 'camera']
  })
  images.value.push(...res.tempFilePaths)
}

/* 删除图片 */
const removeImage = (index) => {
  images.value.splice(index, 1)
}

/* 发布/结束签到 */
const toggleSignin = async() => {
  if (!isSigninActive.value && selectedClasses.value.length === 0) {
    uni.showToast({ title: '请先选择班级', icon: 'none' })
    return
  }
  isSigninActive.value = !isSigninActive.value
  if (!isSigninActive.value) {
    // 结束签到，可在这里处理保存数据逻辑
    uni.showToast({ title: '签到结束', icon: 'success' })
    images.value = []
    // students.value 可以清空或保留
  } else {
	try{
		await publishSignIgApi({
			"classlist":selectedClasses.value,
			"initiator":cacheUser.id
		})
		uni.showToast({ title: '签到已发布', icon: 'success' })
	}catch(err){
		uni.showToast({ title: '签到发布失败', icon: 'none' })
	}
  }
}

/* 修改学生签到状态 */
const updateStatus = (index, event) => {
  students.value[index].statusIndex = event.detail.value
  sortStudents()
}

// 按签到状态排序：未签到/迟到/请假/已签到
const sortStudents = () => {
  students.value.sort((a, b) => {
    // 优先未签到/迟到/请假，最后已签到
    const statusPriority = (statusIndex) => {
      if (statusIndex === 1) return 1 // 已签到最低优先
      return 0
    }
    return statusPriority(a.statusIndex) - statusPriority(b.statusIndex)
  })
}
onShow(async () => {
	try{
      const signTaskRes = await queryTeacherSign({
        "initiator":cacheUser.id
      })
      console.log('signTaskRes',signTaskRes)
      if (signTaskRes && signTaskRes.code === 200) {
        isSigninActive.value = true
        taskId.value = signTaskRes.sign_task_id
        return
      } else {
        isSigninActive.value = false
        taskId.value = null
      }
		 const res = await seacherclassApi()
		 if (res) {
		   classes.value = res.data.classes || []
		 } else {
		   classes.value = []
		   uni.showToast({
		     title: res.msg || '获取班级失败',
		     icon: 'none'
		   })
		 }
		
	}catch(err){
		classes.value = []
		uni.showToast({
		  title: res.msg || '获取班级失败',
		  icon: 'none'
		})
	}
})

</script>

<style lang="scss" scoped>
.teacher-signin-page {
  padding: 30rpx;
  background: #f6f7f8;
  min-height: 100vh;
}

.btn {
  background: #007aff;
  color: #fff;
  font-size: 30rpx;
  padding: 20rpx;
  border-radius: 16rpx;
  text-align: center;
  margin-bottom: 30rpx;
}

.class-selection .title,
.upload-section .title,
.results-section .title {
  font-size: 30rpx;
  font-weight: 600;
  margin-bottom: 20rpx;
}

.class-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
}
.class-item {
  padding: 15rpx 30rpx;
  background: #fff;
  border-radius: 16rpx;
}
.class-item.selected {
  background: #4cd964;
  color: #fff;
}

.upload-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
  align-items: center;
}
.upload-item {
  position: relative;
}
.upload-item .img {
  width: 150rpx;
  height: 150rpx;
  border-radius: 16rpx;
}
.upload-item .remove {
  position: absolute;
  top: -10rpx;
  right: -10rpx;
  background: #ff3b30;
  color: #fff;
  width: 36rpx;
  height: 36rpx;
  border-radius: 50%;
  text-align: center;
  line-height: 36rpx;
  font-weight: bold;
  font-size: 24rpx;
}

.upload-btn {
  padding: 20rpx;
  background: #fff;
  border-radius: 16rpx;
  font-size: 28rpx;
}

.result-list {
  margin-top: 20rpx;
}
.result-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  padding: 20rpx;
  border-radius: 16rpx;
  margin-bottom: 20rpx;
}


/* 顶部操作卡片 */
.action-card {
	background: linear-gradient(135deg, #4a8cff, #6aa8ff);
	border-radius: 28rpx;
	padding: 40rpx;
	color: #fff;
	margin-bottom: 40rpx;
	box-shadow: 0 20rpx 40rpx rgba(74, 140, 255, 0.35);
}

.action-header {
	margin-bottom: 32rpx;
}

.action-title {
	font-size: 36rpx;
	font-weight: 600;
	margin-bottom: 10rpx;
	display: block;
}

.action-desc {
	font-size: 26rpx;
	opacity: 0.9;
}

.action-btn {
	background: #fff;
	color: #4a8cff;
	font-size: 30rpx;
	font-weight: 600;
	border-radius: 999rpx;
	padding: 22rpx 0;
	box-shadow: 0 10rpx 24rpx rgba(0, 0, 0, 0.15);
}

/* 班级选择卡片 */
.class-card {
	background: #fff;
	border-radius: 28rpx;
	padding: 36rpx;
	box-shadow: 0 14rpx 36rpx rgba(0, 0, 0, 0.06);
}

.card-title {
	font-size: 30rpx;
	font-weight: 600;
	color: #222;
	margin-bottom: 24rpx;
}

/* 班级网格 */
.class-grid {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 24rpx;
}

.class-box {
	text-align: center;
	padding: 24rpx 0;
	border-radius: 20rpx;
	background: #f3f5f9;
	color: #333;
	font-size: 28rpx;
	transition: all 0.2s ease;
}

/* 选中态 */
.class-box.active {
	background: rgba(74, 140, 255, 0.15);
	color: #4a8cff;
	font-weight: 600;
	box-shadow: inset 0 0 0 2rpx #4a8cff;
}

</style>
