import { motion } from 'framer-motion'
import { IoRestaurantOutline, IoNutritionOutline } from 'react-icons/io5'

interface Analysis {
	dish: string
	calories: number
	nutrients: {
		protein: number
		fats: number
		carbs: number
	}
	suggestions: string
	questions: string[]
	warnings: string
}

export const FoodAnalysisResult = ({ analysis }: { analysis: Analysis }) => {
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
			<h2 className='text-xl font-semibold mb-4 text-blue-900 flex items-center'>
				<IoRestaurantOutline className='mr-2 text-blue-600' size={22} />
				Анализ питания
			</h2>
			<div className='bg-white rounded-xl shadow-md border border-blue-50 overflow-hidden'>
				<div className='bg-blue-50 p-4 flex items-center'>
					<IoNutritionOutline size={24} className='mr-3 text-blue-900' />
					<h3 className='font-medium text-blue-900'>{analysis.dish}</h3>
				</div>
				<div className='p-5'>
					<div className='grid grid-cols-3 gap-3 mb-4'>
						<div className='bg-blue-50 p-3 rounded-lg text-center'>
							<div className='text-sm text-gray-600'>Калории</div>
							<div className='font-bold text-blue-900'>
								{analysis.calories} ккал
							</div>
						</div>
						<div className='bg-blue-50 p-3 rounded-lg text-center'>
							<div className='text-sm text-gray-600'>Белки</div>
							<div className='font-bold text-blue-900'>
								{analysis.nutrients.protein} г
							</div>
						</div>
						<div className='bg-blue-50 p-3 rounded-lg text-center'>
							<div className='text-sm text-gray-600'>Жиры</div>
							<div className='font-bold text-blue-900'>
								{analysis.nutrients.fats} г
							</div>
						</div>
					</div>
					<div className='bg-blue-50 p-3 rounded-lg text-center mb-4'>
						<div className='text-sm text-gray-600'>Углеводы</div>
						<div className='font-bold text-blue-900'>
							{analysis.nutrients.carbs} г
						</div>
					</div>
					<div className='border-t border-gray-300 pt-4 mt-2'>
						<h4 className='text-md font-medium text-blue-900 mb-2'>
							Рекомендации
						</h4>
						<p className='text-gray-600 text-sm'>{analysis.suggestions}</p>
					</div>
					{analysis.questions.length > 0 && (
						<div className='border-t border-gray-300 pt-4 mt-4'>
							<h4 className='text-md font-medium text-blue-900 mb-2'>
								Уточняющие вопросы
							</h4>
							<ul className='text-gray-600 text-sm list-disc pl-5'>
								{analysis.questions.map((question, index) => (
									<li key={index}>{question}</li>
								))}
							</ul>
						</div>
					)}
					{analysis.warnings && (
						<div className='border-t border-gray-300 pt-4 mt-4'>
							<h4 className='text-md font-medium text-blue-900 mb-2'>
								Предостережения
							</h4>
							<p className='text-gray-600 text-sm'>{analysis.warnings}</p>
						</div>
					)}
				</div>
			</div>
		</motion.div>
	)
}
