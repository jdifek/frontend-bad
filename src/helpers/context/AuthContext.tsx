import {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
} from 'react'
import $api from '../../api/http'

interface User {
	telegramId: string
	name: string
  goal: number
	photoUrl?: string | null
}

interface AuthContextType {
	user: User | null
	accessToken: string | null
	refreshToken: string | null
	isLoading: boolean
	login: (telegramData: {
		telegramId: string
		name?: string
		photoUrl?: string
	}) => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
	user: null,
	accessToken: null,
	refreshToken: null,
	isLoading: true,
	login: async () => {},
})

interface AuthProviderProps {
	children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
	const [user, setUser] = useState<User | null>(null)
	const [accessToken, setAccessToken] = useState<string | null>(null)
	const [refreshToken, setRefreshToken] = useState<string | null>(null)
	const [isLoading, setIsLoading] = useState<boolean>(true)

	const login = async (telegramData: {
		telegramId: string
		name?: string
		photoUrl?: string
	}) => {
		try {
			setIsLoading(true)
			console.log('Attempting login with:', telegramData)
			const response = await $api.post('/api/auth/login', telegramData)
			console.log('Login response:', response.data)
			setUser(response.data.user)
			setAccessToken(response.data.accessToken)
			setRefreshToken(response.data.refreshToken)
			localStorage.setItem('refreshToken', response.data.refreshToken)
			localStorage.setItem('accessToken', response.data.accessToken)
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (error: any) {
			console.error('Login error:', {
				message: error.message,
				response: error.response?.data,
				status: error.response?.status,
			})
			setUser(null)
			setAccessToken(null)
			setRefreshToken(null)
			localStorage.removeItem('refreshToken')
			localStorage.removeItem('accessToken')
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		const storedRefreshToken = localStorage.getItem('refreshToken')
		console.log('Checking stored refreshToken:', storedRefreshToken)
		if (storedRefreshToken) {
			console.log('Attempting to refresh token')
			$api
				.post('/api/auth/refresh', { refreshToken: storedRefreshToken })
				.then(response => {
					console.log('Refresh token response:', response.data)
					setAccessToken(response.data.accessToken)
					setRefreshToken(response.data.refreshToken)
					localStorage.setItem('refreshToken', response.data.refreshToken)
					localStorage.setItem('accessToken', response.data.accessToken)
					return $api.get('/api/auth/me', {
						headers: { Authorization: `Bearer ${response.data.accessToken}` },
					})
				})
				.then(response => {
					console.log('GetMe response:', response.data)
					setUser(response.data.user)
				})
				.catch(error => {
					console.error('Refresh token error:', {
						message: error.message,
						response: error.response?.data,
						status: error.response?.status,
					})
					setUser(null)
					setAccessToken(null)
					setRefreshToken(null)
					localStorage.removeItem('refreshToken')
					localStorage.removeItem('accessToken')
				})
				.finally(() => {
					console.log('Finished refresh attempt, setting isLoading to false')
					setIsLoading(false)
				})
		} else {
			console.log('No refreshToken found, setting isLoading to false')
			setIsLoading(false)
		}
	}, [])

	return (
		<AuthContext.Provider
			value={{ user, accessToken, refreshToken, isLoading, login }}
		>
			{children}
		</AuthContext.Provider>
	)
}

export const useAuth = () => useContext(AuthContext)
