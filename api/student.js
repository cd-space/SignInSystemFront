import { request } from '@/utils/request'

export const quaryStudentSignApi = (data) => {
	return request({
		url: '/api/query_student_sign',
		method: 'post',
		data
	})
}


export const quaryStudentHistoryApi = (data) => {
	return request({
		url: '/api/query_student_history',
		method: 'post',
		data
	})
}