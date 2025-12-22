<template>
  <view class="page">
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
import { BASE_URL } from '@/utils/request.js'
import { onUnload } from '@dcloudio/uni-app'

const cacheUser = uni.getStorageSync('userinfo') || {}
const selectedImage = ref('')
const uploading = ref(false)
const MAX_SIZE = 1 * 1024 * 1024 // 1MB

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

const compressImageFromUrl = (url, maxSize = MAX_SIZE) => {
  return new Promise(async (resolve) => {
    try {
      const resp = await fetch(url)
      const originalBlob = await resp.blob()
      console.log('原始图片大小:', originalBlob.size)
      if (originalBlob.size <= maxSize) return resolve(originalBlob)

      const img = new Image()
      img.crossOrigin = 'Anonymous'
      const objectUrl = URL.createObjectURL(originalBlob)
      img.onload = async () => {
        try {
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          const origW = img.width
          const origH = img.height

          let quality = 0.92
          const MIN_QUALITY = 0.45
          let ratio = 1
          const SCALE_STEP = 0.9
          const toBlob = (q) => new Promise((res) => canvas.toBlob(res, 'image/jpeg', q))

          canvas.width = origW
          canvas.height = origH
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

          let blob = await toBlob(quality)

          while (blob && blob.size > maxSize) {
            if (quality > MIN_QUALITY) {
              quality = Math.max(MIN_QUALITY, quality * 0.85)
            } else {
              ratio = ratio * SCALE_STEP
              const w = Math.max(200, Math.round(origW * ratio))
              const h = Math.max(200, Math.round(origH * ratio))
              canvas.width = w
              canvas.height = h
              ctx.clearRect(0, 0, w, h)
              ctx.drawImage(img, 0, 0, w, h)
              quality = Math.max(MIN_QUALITY, quality * 0.9)
            }
            blob = await toBlob(quality)
            if ((canvas.width <= 200 || canvas.height <= 200) && quality <= MIN_QUALITY) break
          }

          URL.revokeObjectURL(objectUrl)
          console.log('压缩后图片大小:', blob ? blob.size : originalBlob.size)
          resolve(blob || originalBlob)
        } catch (err) {
          URL.revokeObjectURL(objectUrl)
          console.error('compress error', err)
          resolve(originalBlob)
        }
      }
      img.onerror = () => {
        URL.revokeObjectURL(objectUrl)
        resolve(originalBlob)
      }
      img.src = objectUrl
    } catch (e) {
      console.error('fetch for compress failed', e)
      resolve(null)
    }
  })
}

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
  uni.showLoading({ title: '处理中...' })

  try {
    const compressedBlob = await compressImageFromUrl(selectedImage.value, MAX_SIZE)
    if (!compressedBlob) {
      uni.showToast({ title: '读取图片失败', icon: 'none' })
      uploading.value = false
      uni.hideLoading()
      return
    }

    console.log('最终上传大小:', compressedBlob.size)
    const fileName = `face_${Date.now()}.jpg`
    const file = new File([compressedBlob], fileName, { type: compressedBlob.type || 'image/jpeg' })

    const fd = new FormData()
    fd.append('user_id', cacheUser.id)
    fd.append('face_image', file)

    const resp = await fetch(`${BASE_URL}/api/upload_face`, {
      method: 'POST',
      body: fd
    })
    const data = await resp.json()
    if (data && data.code === 200) {
      uni.showToast({ title: '上传成功', icon: 'success' })
    } else {
      uni.showToast({ title: data?.message || '上传失败', icon: 'none' })
    }
  } catch (err) {
    console.error('upload error', err)
    uni.showToast({ title: '上传出错', icon: 'none' })
  } finally {
    uploading.value = false
    uni.hideLoading()
  }
}

onUnload(() => {
  selectedImage.value = ''
})
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