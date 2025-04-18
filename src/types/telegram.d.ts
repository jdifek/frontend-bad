interface TelegramWebApp {
	initData: string
	initDataUnsafe: any
	MainButton: {
		text: string
		show: () => void
		hide: () => void
		onClick: (callback: () => void) => void
	}
	ready: () => void
	expand: () => void
	close: () => void
  requestFullscreen:  () => void
}

interface Window {
	Telegram: {
		WebApp: TelegramWebApp
	}
}
