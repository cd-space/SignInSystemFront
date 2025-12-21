import { request } from '@/utils/request'

export const seacherclassApi = () => {
	return request({
		url: '/api/searchclass',
		method: 'get'
	})
}

export const publishSignIgApi = (data) => {
	return request({
		url: '/api/publish_sign_task',
		method: 'post',
		data
	})
}

//查询老师名下有没有进行的签到
export const queryTeacherSign = (data) => {
	return request({
		url: '/api/query_teacher_sign',
		method: 'post',
		data
	})
}


export const querySignTaskStudents = (data) => {
	return request({
		url: '/api/query_sign_task_students',
		method: 'post',
		data
	})
}
