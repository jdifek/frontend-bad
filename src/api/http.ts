import axios from 'axios'

const BASE_URL = import.meta.env.VITE_BASE_API_URL

const $api = axios.create({
	baseURL: BASE_URL || 'http://localhost:5000',
})

$api.interceptors.request.use(config => {
	const accessToken = localStorage.getItem('accessToken')
	if (accessToken) {
		config.headers.Authorization = `Bearer ${accessToken}`
	}
	return config
})

$api.interceptors.response.use(
	response => response,
	async error => {
		const originalRequest = error.config
		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true

			try {
				const refreshToken = localStorage.getItem('refreshToken')
				const res = await axios.post(`${BASE_URL}/api/auth/refresh`, {
					refreshToken,
				})
				localStorage.setItem('accessToken', res.data.accessToken)
				localStorage.setItem('refreshToken', res.data.refreshToken)
				originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`
				return $api(originalRequest)
			} catch (refreshError) {
				console.error('Error refreshing token:', refreshError)
				localStorage.removeItem('accessToken')
				localStorage.removeItem('refreshToken')
				window.location.href = '/'
			}
		}
		return Promise.reject(error)
	}
)

export default $api
