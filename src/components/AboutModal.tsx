import { motion } from 'framer-motion'
import { IoClose } from 'react-icons/io5'

interface AboutModalProps {
	isOpen: boolean
	onClose: () => void
}

export const AboutModal = ({ isOpen, onClose }: AboutModalProps) => {
	if (!isOpen) return null

	const modalVariants = {
		hidden: { opacity: 0, scale: 0.8 },
		visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
	}

	return (
		<div className='fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50'>
			<motion.div
				className='bg-white p-8 rounded-xl max-w-sm w-full shadow-lg border border-lavender'
				variants={modalVariants}
				initial='hidden'
				animate='visible'
			>
				<div className='flex justify-between items-center mb-4'>
					<h2 className='text-xl font-bold text-text-primary'>О сервисе</h2>
					<button
						onClick={onClose}
						className='text-gray-400 hover:text-text-primary transition-colors'
					>
						<IoClose size={24} />
					</button>
				</div>
				<p className='text-gray-600 mb-6'>
					ИИ-Нутрициолог помогает составить персональные курсы добавок и
					анализировать питание с помощью ИИ. Выбирайте цель, загружайте анализы
					или фото еды, чтобы получить рекомендации.
				</p>
				<button
					onClick={onClose}
					className='bg-blossom-pink text-text-primary p-3 rounded-lg w-full font-medium transition-all hover:shadow-md'
				>
					Закрыть
				</button>
			</motion.div>
		</div>
	)
}
