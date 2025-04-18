import { useState } from 'react'
import { motion } from 'framer-motion'
import { IoCamera } from 'react-icons/io5'
import { FoodAnalysisResult } from '../components/FoodAnalysisResult'

type Analysis = {
	dish: string
	calories: number
	nutrients: {
		protein: number
		fats: number
		carbs: number
	}
	suggestions: string
}

export const FoodAnalysis = () => {
	const [analysis, setAnalysis] = useState<Analysis | null>(null)

	const handleAnalyze = () => {
		setAnalysis({
			dish: 'Салат с курицей',
			calories: 500,
			nutrients: { protein: 20, fats: 15, carbs: 60 },
			suggestions: 'Добавь больше клетчатки, например, овощей.',
		})
	}

	return (
		<div className='p-4 max-w-md mx-auto'>
			<motion.h1
				className='text-2xl font-bold mb-6 text-text-primary'
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
			>
				Анализ питания
			</motion.h1>
			<motion.div
				className='mb-6 p-6 bg-spring-green bg-opacity-30 rounded-xl border border-spring-green'
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
			>
				<div className='flex flex-col items-center justify-center'>
					<IoCamera size={48} className='text-text-primary opacity-50 mb-4' />
					<p className='text-text-primary text-center'>
						Загрузка фото еды (будет реализовано позже)
					</p>
				</div>
			</motion.div>
			<motion.button
				onClick={handleAnalyze}
				className='bg-spring-green text-text-primary p-3 rounded-lg w-full font-medium shadow-md border border-white'
				whileHover={{ scale: 1.03, boxShadow: '0 8px 16px rgba(0,0,0,0.08)' }}
				whileTap={{ scale: 0.97 }}
			>
				Проанализировать (заглушка)
			</motion.button>
			{analysis && <FoodAnalysisResult analysis={analysis} />}
		</div>
	)
}
