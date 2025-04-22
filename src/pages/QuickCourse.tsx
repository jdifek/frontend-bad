import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { GoalSelector } from '../components/re-used/GoalSelector'
import { SupplementInput } from '../components/re-used/SupplementInput'
import { CourseTable } from '../components/re-used/CourseTable'
import $api from '../api/http'

type Supplement = {
	name: string
	dose?: string
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
	duration: number
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

	// для тестов
	const telegramId = '6464907797'

	useEffect(() => {
		const fetchCourses = async () => {
			try {
				const response = await $api.get(`/api/courses/${telegramId}`)
				if (response.data.length > 0) {
					const latestCourse = response.data[0]
					setCourse({
						...latestCourse,
						suggestions:
							latestCourse.suggestions ||
							'Следуйте расписанию для достижения цели.',
						warnings: latestCourse.warnings || 'Проконсультируйтесь с врачом.',
						questions: latestCourse.questions || [],
						disclaimer:
							latestCourse.disclaimer || 'ИИ-нутрициолог не заменяет врача.',
					})
				}
			} catch (err) {
				console.error('Error fetching courses:', err)
				setError('Не удалось загрузить курсы. Попробуйте позже.')
			}
		}

		fetchCourses()
	}, [])

	const handleAddSupplement = async (supplement: Supplement, file?: File) => {
		try {
			setError(null)
			let newSupplement
			if (file) {
				// Загрузка фото
				const formData = new FormData()
				formData.append('telegramId', telegramId)
				formData.append('photo', file)
				const response = await $api.post('/api/courses/supplements', formData, {
					headers: { 'Content-Type': 'multipart/form-data' },
				})
				newSupplement = response.data.supplement
			} else {
				// Ручной ввод
				const response = await $api.post('/api/courses/supplements', {
					telegramId,
					name: supplement.name,
				})
				newSupplement = response.data.supplement
			}
			setSupplements([...supplements, newSupplement])
		} catch (err) {
			console.error('Error adding supplement:', err)
			setError(
				'Не удалось добавить добавку. Убедитесь, что API-ключ настроен, и попробуйте снова.'
			)
		}
	}

	const handleRemoveSupplement = (supplementName: string) => {
		setSupplements(supplements.filter(s => s.name !== supplementName))
	}

	const handleGenerateCourse = async () => {
		if (!goal || supplements.length === 0) {
			setError('Выберите цель и добавьте хотя бы одну добавку.')
			return
		}

		try {
			setLoading(true)
			setError(null)
			const response = await $api.post('/api/courses', {
				telegramId,
				goal,
			})
			setCourse({
				...response.data.course,
				suggestions: response.data.suggestions,
				warnings: response.data.warnings,
				questions: response.data.questions,
				disclaimer: response.data.disclaimer,
			})
		} catch (err) {
			console.error('Error generating course:', err)
			setError(
				'Не удалось сгенерировать курс. Убедитесь, что API-ключ настроен, и попробуйте позже.'
			)
		} finally {
			setLoading(false)
		}
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
