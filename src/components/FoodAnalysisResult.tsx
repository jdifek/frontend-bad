import { motion } from 'framer-motion'
import { IoRestaurantOutline, IoNutritionOutline } from 'react-icons/io5'

export const FoodAnalysisResult = ({ analysis }) => {
	const resultVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
	}

	return (
		<motion.div
			className='my-8'
			variants={resultVariants}
			initial='hidden'
			animate='visible'
		>
			<h2 className='text-xl font-semibold mb-4 text-text-primary flex items-center'>
				<IoRestaurantOutline className='mr-2 text-spring-green' size={22} />{' '}
				Анализ питания
			</h2>
			<div className='bg-white rounded-xl shadow-md border border-spring-green border-opacity-30 overflow-hidden'>
				<div className='bg-spring-green bg-opacity-20 p-4 flex items-center'>
					<IoNutritionOutline size={24} className='mr-3 text-text-primary' />
					<h3 className='font-medium text-text-primary'>{analysis.dish}</h3>
				</div>
				<div className='p-5'>
					<div className='grid grid-cols-3 gap-3 mb-4'>
						<div className='bg-sky-blue bg-opacity-20 p-3 rounded-lg text-center'>
							<div className='text-sm text-gray-500'>Калории</div>
							<div className='font-bold text-text-primary'>
								{analysis.calories} ккал
							</div>
						</div>
						<div className='bg-blossom-pink bg-opacity-20 p-3 rounded-lg text-center'>
							<div className='text-sm text-gray-500'>Белки</div>
							<div className='font-bold text-text-primary'>
								{analysis.nutrients.protein} г
							</div>
						</div>
						<div className='bg-spring-green bg-opacity-20 p-3 rounded-lg text-center'>
							<div className='text-sm text-gray-500'>Жиры</div>
							<div className='font-bold text-text-primary'>
								{analysis.nutrients.fats} г
							</div>
						</div>
					</div>
					<div className='bg-sunshine-yellow bg-opacity-20 p-3 rounded-lg text-center mb-4'>
						<div className='text-sm text-gray-500'>Углеводы</div>
						<div className='font-bold text-text-primary'>
							{analysis.nutrients.carbs} г
						</div>
					</div>
					<div className='border-t border-gray-100 pt-4 mt-2'>
						<p className='text-gray-600'>{analysis.suggestions}</p>
					</div>
				</div>
			</div>
		</motion.div>
	)
}
