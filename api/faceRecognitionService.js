import { request } from '@/utils/request'

export const uploadFaceApi = (data) => {
    return request({
        url: '/api/upload_face',
        method: 'post',
        // data 为 FormData（包含 user_id 和 face_image 文件）
        // header: { 'Content-Type': 'multipart/form-data' },
        data
    })
}