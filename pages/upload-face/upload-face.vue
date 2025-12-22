<template>
  <view class="page">
    <!-- 预览/上传 -->
    <view class="preview-area">
      <image v-if="selectedImage" :src="selectedImage" class="preview-img" mode="aspectFill" />
      <view v-else class="placeholder">
        <text>尚未选择图片</text>
      </view>
    </view>

    <view class="actions">
      <button @click="chooseFromAlbum" class="btn">从相册选择</button>
      <button @click="uploadImage" class="btn" :disabled="!selectedImage || uploading">
        {{ uploading ? '上传中...' : '上传图片' }}
      </button>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { uploadFaceApi } from '@/api/faceRecognitionService'
import {BASE_URL} from '@/utils/request.js'

const cacheUser = uni.getStorageSync('userinfo') || {}
const selectedImage = ref('')
const uploading = ref(false)

/** 仅 H5：从相册选择图片 */
const chooseFromAlbum = () => {
  uni.chooseImage({
    count: 1,
    sourceType: ['album'],
    success(res) {
      const tempPath = res.tempFilePaths && res.tempFilePaths[0]
      if (tempPath) selectedImage.value = tempPath
    },
    fail(err) {
      console.error('chooseImage fail', err)
      uni.showToast({ title: '选择图片失败', icon: 'none' })
    }
  })
}

/** H5 上传：把本地图片 fetch 为 blob，再用 FormData 调用 uploadFaceApi */
const uploadImage = async () => {
  if (!selectedImage.value) {
    uni.showToast({ title: '请先选择图片', icon: 'none' })
    return
  }
  if (!cacheUser.id) {
    uni.showToast({ title: '未获取到用户信息', icon: 'none' })
    return
  }

  uploading.value = true
  uni.showLoading({ title: '上传中...' })

  try {
    // 方案1: 使用 uni.uploadFile (推荐)
    uni.uploadFile({
      url: `${BASE_URL}/api/upload_face`, 
      filePath: selectedImage.value,
      name: 'face_image',  // 字段名
      formData: {
        'user_id': cacheUser.id
      },
      success: (uploadRes) => {
        const res = JSON.parse(uploadRes.data)
        if (res && res.code === 200) {
          uni.showToast({ title: '上传成功', icon: 'success' })
        } else {
          uni.showToast({ title: res?.message || '上传失败', icon: 'none' })
        }
      },
      fail: (err) => {
        console.error('上传失败', err)
        uni.showToast({ title: '上传出错', icon: 'none' })
      },
      complete: () => {
        uploading.value = false
        uni.hideLoading()
      }
    })

    // 方案2: 如果必须用 FormData + fetch
    // const resp = await fetch(selectedImage.value)
    // const blob = await resp.blob()
    // const file = new File([blob], 'face.jpg', { type: 'image/jpeg' })
    // 
    // const fd = new FormData()
    // fd.append('user_id', cacheUser.id)
    // fd.append('face_image', file)  // 使用 File 对象而不是 blob
    //
    // // 直接用 fetch，不通过封装的 request
    // const response = await fetch('http://your-api-url/api/upload_face', {
    //   method: 'POST',
    //   body: fd
    //   // 不要设置 Content-Type
    // })
    // const res = await response.json()

  } catch (err) {
    console.error('uploadImage error', err)
    uni.showToast({ title: '上传出错', icon: 'none' })
    uploading.value = false
    uni.hideLoading()
  }
}
</script>

<style lang="scss" scoped>
.page {
  padding: 30rpx;
  background: #f6f7f8;
  min-height: 100vh;
  box-sizing: border-box;
}
.preview-area {
  background: #fff;
  border-radius: 16rpx;
  padding: 20rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60vh;
  margin-bottom: 20rpx;
}
.preview-img {
  width: 100%;
  height: 100%;
  border-radius: 12rpx;
}
.placeholder {
  color: #999;
  font-size: 28rpx;
}
.actions {
  display: flex;
  gap: 20rpx;
  justify-content: center;
  margin-bottom: 24rpx;
}
.btn {
  background: #4a8cff;
  color: #fff;
  padding: 20rpx 40rpx;
  border-radius: 12rpx;
  font-size: 28rpx;
}
</style>