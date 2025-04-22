import { useState } from 'react'
import { motion } from 'framer-motion'
import { IoSunny, IoPizzaOutline, IoMoonOutline } from 'react-icons/io5'

type Course = {
	id: string
	goal: string
	supplements: { name: string; dose?: string }[]
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

type CourseTableProps = {
	course: Course
}

export const CourseTable = ({ course }: CourseTableProps) => {
	const [duration, setDuration] = useState<number>(course.duration)
	const [progress, setProgress] = useState<{ [key: string]: number }>(
		course.supplements.reduce((acc, supp) => ({ ...acc, [supp.name]: 0 }), {})
	)

	const scheduleItems = [
		{
			time: 'Утро',
			items: course.schedule.morning,
			icon: <IoSunny className='text-blue-500' />,
		},
		{
			time: 'День',
			items: course.schedule.afternoon,
			icon: <IoPizzaOutline className='text-blue-500' />,
		},
		{
			time: 'Вечер',
			items: course.schedule.evening,
			icon: <IoMoonOutline className='text-blue-500' />,
		},
	]

	const handleProgressUpdate = (supplement: string, increment: number) => {
		setProgress(prev => ({
			...prev,
			[supplement]: Math.min(Math.max(prev[supplement] + increment, 0), 100),
		}))
	}

	return (
		<motion.div
			className='bg-white rounded-xl p-6 shadow-md mb-6 border border-blue-50'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
		>
			<h2 className='text-lg font-semibold text-blue-900 mb-3'>{`Ваш курс для "${course.goal}"`}</h2>

			{/* Длительность курса */}
			<div className='mb-4 flex items-center'>
				<label className='text-sm text-gray-600 mr-2'>
					Длительность курса (дней):
				</label>
				<input
					type='number'
					value={duration}
					onChange={e =>
						setDuration(Math.max(1, parseInt(e.target.value) || 1))
					}
					className='w-20 p-2 rounded-lg border border-gray-300 focus:border-blue-600 focus:outline-none bg-white'
				/>
			</div>

			{/* Расписание приёма */}
			<div className='mb-6'>
				<h3 className='text-md font-medium text-blue-900 mb-3'>
					Расписание приёма:
				</h3>
				{scheduleItems.map((item, index) => (
					<div key={index} className='mb-4'>
						<div className='flex items-center mb-2'>
							{item.icon}
							<span className='ml-2 text-blue-600 font-medium'>
								{item.time}:
							</span>
						</div>
						{item.items.length > 0 ? (
							<ul className='ml-8 text-gray-600 text-sm'>
								{item.items.map((supplement, idx) => (
									<li key={idx} className='mb-2'>
										<div className='flex items-center justify-between'>
											<span>
												{supplement}{' '}
												{course.supplements.find(s => s.name === supplement)
													?.dose || ''}
											</span>
											<div className='flex items-center space-x-2'>
												<motion.button
													onClick={() => handleProgressUpdate(supplement, -10)}
													className='text-blue-600'
													whileHover={{ scale: 1.1 }}
													whileTap={{ scale: 0.9 }}
												>
													-
												</motion.button>
												<div className='w-24 h-2 bg-gray-200 rounded-full'>
													<div
														className='h-full bg-blue-600 rounded-full'
														style={{ width: `${progress[supplement]}%` }}
													/>
												</div>
												<motion.button
													onClick={() => handleProgressUpdate(supplement, 10)}
													className='text-blue-600'
													whileHover={{ scale: 1.1 }}
													whileTap={{ scale: 0.9 }}
												>
													+
												</motion.button>
											</div>
										</div>
									</li>
								))}
							</ul>
						) : (
							<p className='ml-8 text-gray-600 italic text-sm'>Нет добавок</p>
						)}
					</div>
				))}
			</div>

			{/* Рекомендации */}
			<div className='bg-blue-50 p-4 rounded-lg mb-4'>
				<h3 className='text-md font-medium text-blue-900 mb-2'>
					Рекомендации:
				</h3>
				<p className='text-gray-600 text-sm'>{course.suggestions}</p>
			</div>

			{/* Предостережения */}
			<div className='bg-yellow-50 p-4 rounded-lg mb-4'>
				<h3 className='text-md font-medium text-yellow-900 mb-2'>
					Предостережения:
				</h3>
				<p className='text-gray-600 text-sm'>{course.warnings}</p>
			</div>

			{/* Уточняющие вопросы */}
			{course.questions.length > 0 && (
				<div className='bg-blue-50 p-4 rounded-lg mb-4'>
					<h3 className='text-md font-medium text-blue-900 mb-2'>
						Уточняющие вопросы:
					</h3>
					<ul className='text-gray-600 text-sm list-disc ml-4'>
						{course.questions.map((question, index) => (
							<li key={index}>{question}</li>
						))}
					</ul>
				</div>
			)}

			{/* Рекомендации по повторным анализам */}
			{course.repeatAnalysis && (
				<div className='bg-purple-50 p-4 rounded-lg mb-4'>
					<h3 className='text-md font-medium text-purple-900 mb-2'>
						Повторные анализы:
					</h3>
					<p className='text-gray-600 text-sm'>{course.repeatAnalysis}</p>
				</div>
			)}

			{/* Дисклеймер */}
			<div className='bg-gray-50 p-4 rounded-lg'>
				<h3 className='text-md font-medium text-gray-900 mb-2'>Важно:</h3>
				<p className='text-gray-600 text-sm'>{course.disclaimer}</p>
			</div>
		</motion.div>
	)
}
