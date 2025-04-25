import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useAuth } from '../helpers/context/AuthContext'
import $api from '../api/http'
import { Slide, toast } from 'react-toastify'
import { FaCheck, FaTimes } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

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
	createdAt: Date
	reminders: Reminder[]
	progress: Progress[]
	surveys: Survey[]
	disclaimer: string
}

type Reminder = {
	id: string
	type: string
	time: string
	message: string
	status?: string
	surveyResponse?: string
}

type Progress = {
	id: string
	supplement: string
	date: string
	status: string
}

type Survey = {
	id: string
	question: string
	response: string
	status: string
	createdAt: Date
}

export const MyCourse = () => {
	const [courses, setCourses] = useState<Course[]>([])
	const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
	const [error, setError] = useState<string | null>(null)
	const [loading, setLoading] = useState<boolean>(false)
	const [updateDialog, setUpdateDialog] = useState<boolean>(false)
	const [newGoal, setNewGoal] = useState<string>('')
	const [newSupplements, setNewSupplements] = useState<string[]>([])
	const { user, isLoading: authLoading } = useAuth()
	const navigate = useNavigate()

	useEffect(() => {
		const fetchCourses = async () => {
			if (authLoading || !user?.telegramId) return

			try {
				const res = await $api.get(
					`/api/my-course/all-courses?telegramId=${user.telegramId}`
				)
				setCourses(res.data.courses)
				if (res.data.courses.length > 0) {
					setSelectedCourse(res.data.courses[0])
				}
			} catch (error) {
				console.error('Error fetching courses:', error)
				setError('Не удалось загрузить курсы. Попробуйте позже.')
			}
		}

		fetchCourses()
	}, [user, authLoading])

	// пулинг для автообновления прогресса
	useEffect(() => {
		if (!selectedCourse || !user?.telegramId) return

		const interval = setInterval(async () => {
			try {
				const res = await $api.get(
					`/api/my-course?telegramId=${user.telegramId}&courseId=${selectedCourse.id}`
				)
				setSelectedCourse(res.data.course)
			} catch (error) {
				console.error('Error polling course:', error)
			}
		}, 30000) // Каждые 30 секунд

		return () => clearInterval(interval)
	}, [selectedCourse, user])

	const calculateProgress = (course: Course) => {
		const startDate = new Date(course.createdAt)
		const daysPassed = Math.floor(
			(Date.now() - startDate.getTime()) / (1000 * 60 * 60 * 24)
		)
		const totalDays = course.duration || 30
		const progress = Math.min((daysPassed / totalDays) * 100, 100)

		const completed = course.progress.filter(p => p.status === 'TAKEN').length
		const totalProgress = course.progress.length
		const completionRate =
			totalProgress > 0 ? (completed / totalProgress) * 100 : 0

		return { daysPassed, totalDays, progress, completionRate }
	}

	const handleMarkProgress = async (
		courseId: string,
		supplement: string,
		date: string,
		status: 'TAKEN' | 'SKIPPED'
	) => {
		try {
			await $api.post('/api/my-course/progress', {
				telegramId: user!.telegramId,
				courseId,
				supplement,
				date: new Date(date).toISOString(),
				status,
			})
			const res = await $api.get(
				`/api/my-course?telegramId=${user!.telegramId}&courseId=${courseId}`
			)
			if (!res.data.course) {
				throw new Error('Курс не найден в ответе сервера')
			}
			setSelectedCourse(res.data.course)
			setCourses(courses.map(c => (c.id === courseId ? res.data.course : c)))
			toast.success(
				`Прогресс отмечен: ${status === 'TAKEN' ? 'Принято' : 'Пропущено'}`,
				{
					position: 'bottom-center',
					theme: 'light',
					transition: Slide,
				}
			)
		} catch (error) {
			console.error('Error marking progress:', error)
			toast.error('Не удалось отметить прогресс.', {
				position: 'bottom-center',
				theme: 'light',
				transition: Slide,
			})
		}
	}

	const handleUpdateCourse = async () => {
		if (!newGoal || newSupplements.length === 0) {
			toast.error('Укажите цель и добавки.')
			return
		}

		try {
			setLoading(true)
			const res = await $api.post('/api/my-course/update', {
				telegramId: user!.telegramId,
				goal: newGoal,
				supplements: newSupplements,
			})
			const newCourse = res.data.course
			setCourses([newCourse, ...courses])
			setSelectedCourse(newCourse)
			setUpdateDialog(false)
			setNewGoal('')
			setNewSupplements([])
			toast.success('Курс обновлён!')
			navigate('/my-course')
		} catch (error) {
			console.error('Error updating course:', error)
			toast.error('Не удалось обновить курс.')
		} finally {
			setLoading(false)
		}
	}

	if (authLoading) {
		return <div className='p-4 text-center text-blue-900'>Загрузка...</div>
	}

	if (!user) {
		return (
			<div className='p-4 text-center text-red-700'>Ошибка авторизации.</div>
		)
	}

	if (error) {
		return <div className='p-4 text-center text-red-700'>{error}</div>
	}

	if (courses.length === 0) {
		return (
			<div className='p-4 text-center text-blue-900'>Курсы не найдены.</div>
		)
	}

	return (
		<div className='relative p-4 py-40 max-w-md mx-auto bg-blue-50'>
			<motion.h1
				className='text-2xl font-bold mb-6 text-blue-900'
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
			>
				Мой курс
			</motion.h1>

			{/* Выбор курса */}
			<motion.div
				className='bg-white p-4 rounded-xl shadow-sm mb-6'
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
			>
				<h2 className='text-lg font-medium text-blue-900 mb-2'>
					Выберите курс
				</h2>
				<select
					className='w-full p-3 border border-blue-200 rounded-lg'
					value={selectedCourse?.id || ''}
					onChange={e =>
						setSelectedCourse(
							courses.find(c => c.id === e.target.value) || null
						)
					}
				>
					{courses.map(course => (
						<option key={course.id} value={course.id}>
							{course.goal} (создан:{' '}
							{new Date(course.createdAt).toLocaleDateString()})
						</option>
					))}
				</select>
			</motion.div>

			{selectedCourse && selectedCourse.progress && (
				<>
					{/* Прогресс */}
					<motion.div
						className='bg-white p-4 rounded-xl shadow-sm mb-6'
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
					>
						<h2 className='text-lg font-medium text-blue-900 mb-2'>
							Прогресс курса
						</h2>
						{(() => {
							const { daysPassed, totalDays, progress, completionRate } =
								calculateProgress(selectedCourse)
							return (
								<>
									<div className='mb-2'>
										<p className='text-sm text-blue-700'>
											Дни: {daysPassed} / {totalDays}
										</p>
										<div className='w-full bg-blue-100 rounded-full h-2.5'>
											<div
												className='bg-blue-600 h-2.5 rounded-full'
												style={{ width: `${progress}%` }}
											></div>
										</div>
									</div>
									<div>
										<p className='text-sm text-blue-700'>
											Выполнено: {completionRate.toFixed(1)}%
										</p>
										<div className='w-full bg-blue-100 rounded-full h-2.5'>
											<div
												className='bg-blue-600 h-2.5 rounded-full'
												style={{ width: `${completionRate}%` }}
											></div>
										</div>
									</div>
								</>
							)
						})()}
					</motion.div>

					{/* Таблица курса */}
					<motion.div
						className='bg-white p-4 rounded-xl shadow-sm mb-6'
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
					>
						<h2 className='text-lg font-medium text-blue-900 mb-2'>
							Расписание
						</h2>
						<table className='w-full text-left'>
							<thead>
								<tr className='text-blue-700'>
									<th className='p-2'>Время</th>
									<th className='p-2'>Добавки</th>
									<th className='p-2'>Статус</th>
								</tr>
							</thead>
							<tbody>
								{selectedCourse.schedule.morning.length > 0 && (
									<tr>
										<td className='p-2'>Утро (08:00)</td>
										<td className='p-2'>
											{selectedCourse.schedule.morning.join(', ')}
										</td>
										<td className='p-2'>
											{selectedCourse.schedule.morning.map(supplement => {
												const today = new Date().toISOString().split('T')[0]
												const progress = selectedCourse.progress.find(
													p =>
														p.supplement === supplement &&
														p.date.includes(today)
												)
												return (
													<div key={supplement} className='flex gap-2 mb-2'>
														{progress?.status === 'TAKEN' ? (
															<FaCheck className='text-green-600' />
														) : progress?.status === 'SKIPPED' ? (
															<FaTimes className='text-red-600' />
														) : (
															<>
																<button
																	onClick={() =>
																		handleMarkProgress(
																			selectedCourse.id,
																			supplement,
																			today,
																			'TAKEN'
																		)
																	}
																	className='text-green-600'
																>
																	<FaCheck />
																</button>
																<button
																	onClick={() =>
																		handleMarkProgress(
																			selectedCourse.id,
																			supplement,
																			today,
																			'SKIPPED'
																		)
																	}
																	className='text-red-600'
																>
																	<FaTimes />
																</button>
															</>
														)}
													</div>
												)
											})}
										</td>
									</tr>
								)}
								{selectedCourse.schedule.afternoon.length > 0 && (
									<tr>
										<td className='p-2'>День (14:00)</td>
										<td className='p-2'>
											{selectedCourse.schedule.afternoon.join(', ')}
										</td>
										<td className='p-2'>
											{selectedCourse.schedule.afternoon.map(supplement => {
												const today = new Date().toISOString().split('T')[0]
												const progress = selectedCourse.progress.find(
													p =>
														p.supplement === supplement &&
														p.date.includes(today)
												)
												return (
													<div key={supplement} className='flex gap-2 mb-2'>
														{progress?.status === 'TAKEN' ? (
															<FaCheck className='text-green-600' />
														) : progress?.status === 'SKIPPED' ? (
															<FaTimes className='text-red-600' />
														) : (
															<>
																<button
																	onClick={() =>
																		handleMarkProgress(
																			selectedCourse.id,
																			supplement,
																			today,
																			'TAKEN'
																		)
																	}
																	className='text-green-600'
																>
																	<FaCheck />
																</button>
																<button
																	onClick={() =>
																		handleMarkProgress(
																			selectedCourse.id,
																			supplement,
																			today,
																			'SKIPPED'
																		)
																	}
																	className='text-red-600'
																>
																	<FaTimes />
																</button>
															</>
														)}
													</div>
												)
											})}
										</td>
									</tr>
								)}
								{selectedCourse.schedule.evening.length > 0 && (
									<tr>
										<td className='p-2'>Вечер (20:00)</td>
										<td className='p-2'>
											{selectedCourse.schedule.evening.join(', ')}
										</td>
										<td className='p-2'>
											{selectedCourse.schedule.evening.map(supplement => {
												const today = new Date().toISOString().split('T')[0]
												const progress = selectedCourse.progress.find(
													p =>
														p.supplement === supplement &&
														p.date.includes(today)
												)
												return (
													<div key={supplement} className='flex gap-2 mb-2'>
														{progress?.status === 'TAKEN' ? (
															<FaCheck className='text-green-600' />
														) : progress?.status === 'SKIPPED' ? (
															<FaTimes className='text-red-600' />
														) : (
															<>
																<button
																	onClick={() =>
																		handleMarkProgress(
																			selectedCourse.id,
																			supplement,
																			today,
																			'TAKEN'
																		)
																	}
																	className='text-green-600'
																>
																	<FaCheck />
																</button>
																<button
																	onClick={() =>
																		handleMarkProgress(
																			selectedCourse.id,
																			supplement,
																			today,
																			'SKIPPED'
																		)
																	}
																	className='text-red-600'
																>
																	<FaTimes />
																</button>
															</>
														)}
													</div>
												)
											})}
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</motion.div>

					{/* История настроения */}
					{selectedCourse &&
						selectedCourse.surveys &&
						selectedCourse.surveys.length > 0 && (
							<motion.div
								className='bg-white p-4 rounded-xl shadow-sm mb-6'
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
							>
								<h2 className='text-lg font-medium text-blue-900 mb-2'>
									Самочувствие
								</h2>
								<ul className='text-blue-700'>
									{selectedCourse.surveys
										.filter(s => s.status === 'COMPLETED')
										.map(survey => (
											<li key={survey.id} className='py-1'>
												{new Date(survey.createdAt).toLocaleDateString()}:{' '}
												{survey.response}
											</li>
										))}
								</ul>
							</motion.div>
						)}

					{/* Кнопка обновления */}
					<motion.button
						onClick={() => setUpdateDialog(true)}
						className='bg-blue-600 text-white p-3 rounded-xl w-full font-medium shadow-md'
						whileHover={{
							scale: 1.03,
							boxShadow: '0 8px 16px rgba(0,0,0,0.08)',
						}}
						whileTap={{ scale: 0.97 }}
					>
						Обновить курс
					</motion.button>

					{/* Диалог обновления */}
					{updateDialog && (
						<motion.div
							className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4'
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
						>
							<div className='bg-white p-6 rounded-xl max-w-md w-full'>
								<h2 className='text-lg font-medium text-blue-900 mb-4'>
									Обновить курс
								</h2>
								<input
									type='text'
									placeholder='Новая цель (например, Энергия)'
									value={newGoal}
									onChange={e => setNewGoal(e.target.value)}
									className='w-full p-3 border border-blue-200 rounded-lg mb-4'
								/>
								<input
									type='text'
									placeholder='Добавки (через запятую)'
									onChange={e =>
										setNewSupplements(
											e.target.value.split(',').map(s => s.trim())
										)
									}
									className='w-full p-3 border border-blue-200 rounded-lg mb-4'
								/>
								<div className='flex gap-4'>
									<button
										onClick={handleUpdateCourse}
										disabled={loading}
										className='bg-blue-600 text-white p-3 rounded-lg flex-1'
									>
										{loading ? 'Обновление...' : 'Обновить'}
									</button>
									<button
										onClick={() => setUpdateDialog(false)}
										className='bg-gray-200 text-blue-900 p-3 rounded-lg flex-1'
									>
										Отмена
									</button>
								</div>
							</div>
						</motion.div>
					)}

					{/* Дисклеймер */}
					<motion.p
						className='text-sm text-blue-700 mt-6 text-center'
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
					>
						ИИ-нутрициолог не заменяет консультацию врача. Это рекомендации
						общего характера, основанные на открытых данных.
					</motion.p>
				</>
			)}
		</div>
	)
}
