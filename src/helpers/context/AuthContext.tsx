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
	photoUrl?: string
}

interface AuthContextType {
	user: User | null
	accessToken: string | null
	refreshToken: string | null
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
	login: async () => {},
})

interface AuthProviderProps {
	children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
	const [user, setUser] = useState<User | null>(null)
	const [accessToken, setAccessToken] = useState<string | null>(null)
	const [refreshToken, setRefreshToken] = useState<string | null>(null)

	const login = async (telegramData: {
		telegramId: string
		name?: string
		photoUrl?: string
	}) => {
		try {
			const response = await $api.post('/api/auth/login', telegramData)
			setUser(response.data.user)
			setAccessToken(response.data.accessToken)
			setRefreshToken(response.data.refreshToken)
			localStorage.setItem('refreshToken', response.data.refreshToken)
			localStorage.setItem('accessToken', response.data.accessToken)
		} catch (error) {
			console.error('Error during login:', error)
		}
	}

	useEffect(() => {
		const storedRefreshToken = localStorage.getItem('refreshToken')
		if (storedRefreshToken) {
			$api
				.post('/api/auth/refresh', { refreshToken: storedRefreshToken })
				.then(response => {
					setAccessToken(response.data.accessToken)
					setRefreshToken(response.data.refreshToken)
					localStorage.setItem('refreshToken', response.data.refreshToken)
					localStorage.setItem('accessToken', response.data.accessToken)
					return $api.get('/api/auth/me', {
						headers: { Authorization: `Bearer ${response.data.accessToken}` },
					})
				})
				.then(response => {
					setUser(response.data.user)
				})
				.catch(error => {
					console.error('Error refreshing token:', error)
					setUser(null)
					setAccessToken(null)
					setRefreshToken(null)
					localStorage.removeItem('refreshToken')
					localStorage.removeItem('accessToken')
				})
		}
	}, [])

	return (
		<AuthContext.Provider value={{ user, accessToken, refreshToken, login }}>
			{children}
		</AuthContext.Provider>
	)
}

export const useAuth = () => useContext(AuthContext)
