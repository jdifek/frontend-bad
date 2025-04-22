import axios from 'axios'

const BASE_URL = import.meta.env.VITE_BASE_API_URL

const $api = axios.create({
	baseURL: BASE_URL || 'http://localhost:5000',
})

export default $api
