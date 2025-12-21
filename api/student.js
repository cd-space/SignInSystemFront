import { request } from '@/utils/request'

export const quaryStudentSignApi = (data) => {
	return request({
		url: '/api/query_student_sign',
		method: 'post',
		data
	})
}