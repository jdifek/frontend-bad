import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { GoalSelector } from '../components/re-used/GoalSelector'
import { SupplementInput } from '../components/re-used/SupplementInput'
import { CourseTable } from '../components/re-used/CourseTable'
import $api from '../api/http'
import { useAuth } from '../helpers/context/AuthContext'

type Supplement = {
	name: string
	dose?: string
	time?: string
}

type Course = {
	id: string
	goal: string
	supplements: Supplement[]
	schedule: {
		morning: string[]
		afternoon: string[]
		evening: string[]
	}
	duration: number | null
	suggestions: string
	warnings: string
	repeatAnalysis: string
	questions: string[]
	disclaimer: string
}

export const QuickCourse = () => {
	const [goal, setGoal] = useState<string>('')
	const [supplements, setSupplements] = useState<Supplement[]>([])
	const [course, setCourse] = useState<Course | null>(null)
	const [error, setError] = useState<string | null>(null)
	const [loading, setLoading] = useState<boolean>(false)
	const { user, isLoading: authLoading } = useAuth()

	const telegramId = '6464907797'

	useEffect(() => {
		const fetchCourses = async () => {
			console.log('fetchCourses called with:', { authLoading, user })
			if (authLoading || !user?.telegramId) {
				console.log('Skipping fetchCourses: authLoading or no user', {
					authLoading,
					user,
				})
				return
			}

			try {
				const response = await $api.get(`/api/courses/${user.telegramId}`)
				console.log('Course data:', response.data)
				if (response.data.length > 0) {
					const latestCourse = response.data[0]
					setCourse({
						...latestCourse,
						supplements: latestCourse.supplements || [],
						suggestions:
							latestCourse.suggestions ||
							'Следуйте расписанию для достижения цели.',
						warnings: latestCourse.warnings || 'Проконсультируйтесь с врачом.',
						questions: latestCourse.questions || [],
						disclaimer:
							latestCourse.disclaimer || 'Limitless.Pharm не заменяет врача.',
						repeatAnalysis: latestCourse.repeatAnalysis || '',
						duration: latestCourse.duration || 30,
					})
				}
			} catch (error) {
				console.error('Error fetching courses:', error)
				setError('Не удалось загрузить курсы. Попробуйте позже.')
			}
		}

		fetchCourses()
	}, [user, authLoading])

	const handleAddSupplement = async (supplement: Supplement, file?: File) => {
		if (authLoading || !user?.telegramId) {
			setError(
				'Пользователь не авторизован. Попробуйте перезагрузить приложение.'
			)
			return
		}

		try {
			setError(null)
			let newSupplement
			if (file) {
				const formData = new FormData()
				formData.append('telegramId', user.telegramId)
				formData.append('photo', file)
				const response = await $api.post('/api/courses/supplements', formData, {
					headers: { 'Content-Type': 'multipart/form-data' },
				})
				newSupplement = response.data.supplement
			} else {
				const response = await $api.post('/api/courses/supplements', {
					telegramId: user.telegramId,
					name: supplement.name,
				})
				newSupplement = response.data.supplement
			}
			setSupplements([...supplements, newSupplement])
		} catch (error) {
			console.error('Error adding supplement:', error)
			setError(
				'Не удалось добавить добавку. Попробуйте снова или перезагрузите приложение.'
			)
		}
	}

	const handleRemoveSupplement = (supplementName: string) => {
		setSupplements(supplements.filter(s => s.name !== supplementName))
	}

	const handleGenerateCourse = async () => {
		if (authLoading || !user?.telegramId) {
			setError(
				'Пользователь не авторизован. Попробуйте перезагрузить приложение.'
			)
			return
		}

		if (!goal || supplements.length === 0) {
			setError('Выберите цель и добавьте хотя бы одну добавку.')
			return
		}

		try {
			setLoading(true)
			setError(null)
			const response = await $api.post('/api/courses', {
				telegramId: user.telegramId,
				goal,
			})
			console.log('Generated course:', response.data)
			setCourse({
				...response.data.course,
				supplements: response.data.course.supplements || [],
				suggestions:
					response.data.suggestions ||
					'Следуйте расписанию для достижения цели.',
				warnings: response.data.warnings || 'Проконсультируйтесь с врачом.',
				questions: response.data.questions || [],
				disclaimer:
					response.data.disclaimer || 'Limitless.Pharm не заменяет врача.',
				repeatAnalysis: response.data.repeatAnalysis || '',
				duration: response.data.course.duration || 30,
			})
		} catch (error) {
			console.error('Error generating course:', error)
			setError(
				'Не удалось сгенерировать курс. Попробуйте снова или перезагрузите приложение.'
			)
		} finally {
			setLoading(false)
		}
	}

	if (authLoading) {
		return <div className='p-4 text-center text-blue-900'>Загрузка...</div>
	}

	if (!user) {
		return (
			<div className='p-4 text-center text-red-700'>
				Ошибка авторизации. Попробуйте перезагрузить приложение или войти снова.
			</div>
		)
	}

	return (
		<div className='relative p-4 py-40 max-w-md mx-auto bg-blue-50'>
			<motion.h1
				className='text-2xl font-bold mb-6 text-blue-900 relative z-10'
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
			>
				Создать быстрый курс
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
			<GoalSelector onSelect={(g: string) => setGoal(g)} />
			<SupplementInput
				onAdd={handleAddSupplement}
				onRemove={handleRemoveSupplement}
			/>
			<motion.button
				onClick={handleGenerateCourse}
				className='bg-blue-600 text-white p-3 rounded-xl w-full relative z-10 font-medium shadow-md mt-4'
				disabled={!goal || supplements.length === 0 || loading}
				whileHover={{ scale: 1.03, boxShadow: '0 8px 16px rgba(0,0,0,0.08)' }}
				whileTap={{ scale: 0.97 }}
			>
				{loading ? 'Генерация...' : 'Сгенерировать курс'}
			</motion.button>
			{course && <CourseTable course={course} />}
		</div>
	)
}

export default QuickCourse
