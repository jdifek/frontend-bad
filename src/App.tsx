import { useEffect } from 'react'
import { RoutesConfig } from './routes'
import { Navigation } from './components/Navigation'
import { ToastContainer } from 'react-toastify'

export const App = () => {
	useEffect(() => {
		if (window.Telegram?.WebApp) {
			window.Telegram.WebApp.ready()
			window.Telegram.WebApp.expand()
		}
	}, [])

	return (
		<div className='min-h-screen bg-neutral-beige'>
			<Navigation />
			<div className='max-w-5xl mx-auto p-4'>
				<RoutesConfig />
			</div>
			<ToastContainer />
		</div>
	)
}

export default App
