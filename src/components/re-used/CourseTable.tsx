import { motion } from 'framer-motion'
import { IoPinOutline, IoTimeOutline, IoCalendarOutline } from 'react-icons/io5'

export const CourseTable = ({ course }) => {
	const tableVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
	}

	return (
		<motion.div
			className='mb-8'
			variants={tableVariants}
			initial='hidden'
			animate='visible'
		>
			<h2 className='text-xl font-semibold mb-4 text-text-primary flex items-center'>
				<IoPinOutline className='mr-2 text-sky-blue' size={22} /> Ваш курс
			</h2>
			<div className='bg-white rounded-xl shadow-md border border-sky-blue border-opacity-30 overflow-hidden'>
				<table className='w-full border-collapse'>
					<thead>
						<tr className='bg-sky-blue bg-opacity-20 text-text-primary'>
							<th className='p-3 text-left font-medium'>Добавка</th>
							<th className='p-3 text-left font-medium'>Время</th>
							<th className='p-3 text-left font-medium'>Длительность</th>
							<th className='p-3 text-left font-medium'>Прогресс</th>
						</tr>
					</thead>
					<tbody>
						{course.supplements.map((supplement, index) => (
							<tr key={index} className='border-b border-gray-100'>
								<td className='p-3 text-text-primary font-medium'>
									{supplement.name}
								</td>
								<td className='p-3 text-gray-600 flex items-center'>
									<IoTimeOutline className='mr-2' />
									{course.schedule.morning.includes(supplement.name)
										? 'Утро'
										: course.schedule.afternoon.includes(supplement.name)
										? 'День'
										: 'Вечер'}
								</td>
								<td className='p-3 text-gray-600 flex items-center'>
									<IoCalendarOutline className='mr-2' />
									{course.duration} дней
								</td>
								<td className='p-3'>
									<div className='w-full bg-gray-100 rounded-full h-2'>
										<div
											className='bg-sky-blue h-2 rounded-full'
											style={{ width: `${Math.random() * 100}%` }}
										></div>
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
				{course.suggestions && (
					<div className='p-4 border-t border-gray-100'>
						<p className='text-gray-600'>{course.suggestions}</p>
					</div>
				)}
			</div>
		</motion.div>
	)
}
