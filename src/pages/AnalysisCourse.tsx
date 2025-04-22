import { useState } from 'react'
import { motion } from 'framer-motion'
import { AnalysisChecklist } from '../components/AnalysisChecklist'
import { GoalSelector } from '../components/re-used/GoalSelector'
import { CourseTable } from '../components/re-used/CourseTable'
import { IoCalendarOutline } from 'react-icons/io5'
import { Slide, toast } from 'react-toastify'
import $api from '../api/http'

type Course = {
	id: string
	goal: string
	supplements: { name: string; dose: string }[]
	schedule: {
		morning: string[]
		afternoon: string[]
		evening: string[]
	}
	duration: number
	suggestions: string
	warnings: string
	questions: string[]
	repeatAnalysis: string
	disclaimer: string
}

export const AnalysisCourse = () => {
	const [goal, setGoal] = useState('')
	const [biomarkers, setBiomarkers] = useState<string[]>([])
	const [photo, setPhoto] = useState<File | null>(null)
	const [course, setCourse] = useState<Course | null>(null)
	const [error, setError] = useState<string | null>(null)
	const [loading, setLoading] = useState<boolean>(false)

	// Для тестов
	const telegramId = '6464907797'

	const handleGenerateCourse = async () => {
		if (!goal || biomarkers.length === 0) {
			setError('Выберите цель и отметьте хотя бы один биомаркер.')
			return
		}

		try {
			setLoading(true)
			setError(null)

			const formData = new FormData()
			formData.append('telegramId', telegramId)
			formData.append('goal', goal)
			formData.append('checklist', JSON.stringify(biomarkers))
			if (photo) {
				formData.append('photo', photo)
			}

			const response = await $api.post('/api/analyses', formData, {
				headers: { 'Content-Type': 'multipart/form-data' },
			})

			setCourse({
				...response.data.course,
				suggestions: response.data.suggestions,
				warnings: response.data.warnings,
				questions: response.data.questions,
				repeatAnalysis: response.data.repeatAnalysis,
				disclaimer: response.data.disclaimer,
			})

			// Уведомление о том, что напоминания отправлены в Telegram
			toast.info('Напоминания отправлены в Telegram-бот!', {
				position: 'bottom-center',
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				theme: 'light',
				transition: Slide,
			})
		} catch (err) {
			console.error('Error generating analysis course:', err)
			setError(
				'Не удалось сгенерировать курс. Убедитесь, что API-ключ настроен, и попробуйте снова.'
			)
		} finally {
			setLoading(false)
		}
	}

	const handleAddReminder = async (type: 'ANALYSIS' | 'SURVEY') => {
		if (!course) {
			toast.error('Сначала сгенерируйте курс.', {
				position: 'bottom-center',
				theme: 'light',
				transition: Slide,
			})
			return
		}

		try {
			const message =
				type === 'ANALYSIS'
					? course.repeatAnalysis || 'Сдайте повторные анализы через 8 недель'
					: 'Как ты себя сегодня чувствуешь? Это поможет уточнить твой курс.'

			await $api.post('/api/reminders', {
				telegramId,
				courseId: course.id,
				type,
				message,
			})

			toast.success(
				type === 'ANALYSIS'
					? 'Напоминание о повторных анализах отправлено в Telegram!'
					: 'Опрос отправлен в Telegram!',
				{
					position: 'bottom-center',
					autoClose: 5000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					theme: 'light',
					transition: Slide,
				}
			)
		} catch (err) {
			console.error('Error adding reminder:', err)
			toast.error('Не удалось отправить напоминание в Telegram.', {
				position: 'bottom-center',
				theme: 'light',
				transition: Slide,
			})
		}
	}

	return (
		<div className='p-4 py-40 max-w-md mx-auto'>
			<motion.h1
				className='text-2xl font-bold mb-6 text-gray-700'
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
			>
				Курс по анализам
			</motion.h1>
			{error && (
				<motion.div
					className='bg-red-100 text-red-700 p-3 rounded-lg mb-4'
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
				>
					{error}
				</motion.div>
			)}
			<AnalysisChecklist
				onSelect={(biomarker: string) =>
					setBiomarkers([...biomarkers, biomarker])
				}
				onPhotoUpload={(file: File) => setPhoto(file)}
			/>
			<GoalSelector onSelect={setGoal} />
			<motion.button
				onClick={handleGenerateCourse}
				className='bg-pink-200 text-gray-700 p-3 rounded-lg w-full mb-6 font-medium shadow-md border border-white'
				disabled={!goal || biomarkers.length === 0 || loading}
				whileHover={{ scale: 1.03, boxShadow: '0 8px 16px rgba(0,0,0,0.08)' }}
				whileTap={{ scale: 0.97 }}
			>
				{loading ? 'Генерация...' : 'Сгенерировать курс'}
			</motion.button>
			{course && (
				<>
					<CourseTable course={course} />
					<motion.button
						onClick={() => handleAddReminder('ANALYSIS')}
						className='bg-purple-200 text-gray-700 p-3 rounded-lg w-full mb-4 font-medium shadow-md border border-white flex items-center justify-center'
						whileHover={{
							scale: 1.03,
							boxShadow: '0 8px 16px rgba(0,0,0,0.08)',
						}}
						whileTap={{ scale: 0.97 }}
					>
						<IoCalendarOutline size={20} className='mr-2' />
						Напоминание о повторных анализах
					</motion.button>
					<motion.button
						onClick={() => handleAddReminder('SURVEY')}
						className='bg-blue-200 text-gray-700 p-3 rounded-lg w-full font-medium shadow-md border border-white flex items-center justify-center'
						whileHover={{
							scale: 1.03,
							boxShadow: '0 8px 16px rgba(0,0,0,0.08)',
						}}
						whileTap={{ scale: 0.97 }}
					>
						<IoCalendarOutline size={20} className='mr-2' />
						Отправить микро-опрос
					</motion.button>
				</>
			)}
		</div>
	)
}
