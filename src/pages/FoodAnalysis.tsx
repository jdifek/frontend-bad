import { useState } from 'react'
import { motion } from 'framer-motion'
import { IoCamera, IoPencil } from 'react-icons/io5'
import { FoodAnalysisResult } from '../components/FoodAnalysisResult'
import $api from '../api/http'
import { Slide, toast } from 'react-toastify'

type Analysis = {
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

export const FoodAnalysis = () => {
	const [analysis, setAnalysis] = useState<Analysis | null>(null)
	const [photo, setPhoto] = useState<File | null>(null)
	const [error, setError] = useState<string | null>(null)
	const [loading, setLoading] = useState<boolean>(false)
	const [showManualInput, setShowManualInput] = useState<boolean>(false)
	const [manualInput, setManualInput] = useState({
		dish: '',
		calories: '',
		protein: '',
		fats: '',
		carbs: '',
		suggestions: '',
	})

	const telegramId = '6464907797'

	const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			const file = e.target.files[0]
			setPhoto(file)
			setError(null)
		}
	}

	const handleAnalyze = async () => {
		if (!photo) {
			setError('Пожалуйста, загрузите фото еды.')
			return
		}

		try {
			setLoading(true)
			setError(null)

			const formData = new FormData()
			formData.append('telegramId', telegramId)
			formData.append('photo', photo)

			const res = await $api.post('/api/food-analysis/photo', formData, {
				headers: { 'Content-Type': 'multipart/form-data' },
			})

			setAnalysis(res.data.foodAnalysis)
			toast.success('Анализ еды завершён!', {
				position: 'bottom-center',
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				theme: 'light',
				transition: Slide,
			})
		} catch (error) {
			console.error('Error analyzing food:', error)
			setError(
				'Не удалось проанализировать еду. Попробуйте ввести данные вручную.'
			)
			setShowManualInput(true)
		} finally {
			setLoading(false)
		}
	}

	const handleManualInputSubmit = async () => {
		if (
			!manualInput.dish ||
			!manualInput.calories ||
			!manualInput.protein ||
			!manualInput.fats ||
			!manualInput.carbs
		) {
			setError('Заполните все поля для ручного ввода.')
			return
		}

		try {
			setLoading(true)
			setError(null)

			const res = await $api.post('/api/food-analysis/manual', {
				telegramId,
				dish: manualInput.dish,
				calories: parseInt(manualInput.calories),
				nutrients: {
					protein: parseFloat(manualInput.protein),
					fats: parseFloat(manualInput.fats),
					carbs: parseFloat(manualInput.carbs),
				},
				suggestions:
					manualInput.suggestions || 'Нет дополнительных рекомендаций.',
			})

			setAnalysis(res.data.foodAnalysis)
			setShowManualInput(false)
			setManualInput({
				dish: '',
				calories: '',
				protein: '',
				fats: '',
				carbs: '',
				suggestions: '',
			})
			toast.success('Ручной ввод сохранён!', {
				position: 'bottom-center',
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				theme: 'light',
				transition: Slide,
			})
		} catch (error) {
			console.error('Error saving manual input:', error)
			setError('Не удалось сохранить ручной ввод. Попробуйте снова.')
		} finally {
			setLoading(false)
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
				Анализ питания
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
			<div className='mb-6'>
				<h2 className='text-lg font-semibold text-blue-900 mb-3'>
					Загрузите фото еды:
				</h2>
				<label className='block'>
					<input
						type='file'
						accept='image/*'
						onChange={handlePhotoUpload}
						className='hidden'
					/>
					<motion.div
						className='p-4 bg-green-50 rounded-xl border border-dashed border-green-600 text-center cursor-pointer'
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
					>
						<IoCamera size={24} className='mx-auto mb-2 text-green-600' />
						<p className='text-green-900 text-sm'>
							{photo ? photo.name : 'Нажмите, чтобы загрузить фото еды'}
						</p>
					</motion.div>
				</label>
				{photo && (
					<motion.button
						onClick={() => setPhoto(null)}
						className='mt-2 text-green-600 text-sm'
						whileHover={{ scale: 1.1 }}
						whileTap={{ scale: 0.9 }}
					>
						Удалить фото
					</motion.button>
				)}
			</div>
			<motion.button
				onClick={handleAnalyze}
				className='bg-green-200 text-gray-700 p-3 rounded-lg w-full mb-4 font-medium shadow-md border border-white'
				disabled={!photo || loading}
				whileHover={{ scale: 1.03, boxShadow: '0 8px 16px rgba(0,0,0,0.08)' }}
				whileTap={{ scale: 0.97 }}
			>
				{loading ? 'Анализ...' : 'Проанализировать'}
			</motion.button>
			<motion.button
				onClick={() => setShowManualInput(true)}
				className='bg-blue-200 text-gray-700 p-3 rounded-lg w-full mb-6 font-medium shadow-md border border-white flex items-center justify-center'
				whileHover={{ scale: 1.03, boxShadow: '0 8px 16px rgba(0,0,0,0.08)' }}
				whileTap={{ scale: 0.97 }}
			>
				<IoPencil size={20} className='mr-2' />
				Ввести данные вручную
			</motion.button>
			{showManualInput && (
				<motion.div
					className='bg-white rounded-xl p-4 shadow-sm border border-gray-300 mb-6'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
				>
					<h3 className='text-lg font-semibold text-blue-900 mb-3'>
						Ручной ввод
					</h3>
					<input
						type='text'
						placeholder='Название блюда'
						value={manualInput.dish}
						onChange={e =>
							setManualInput({ ...manualInput, dish: e.target.value })
						}
						className='w-full p-2 mb-2 border rounded-lg'
					/>
					<input
						type='number'
						placeholder='Калории (ккал)'
						value={manualInput.calories}
						onChange={e =>
							setManualInput({ ...manualInput, calories: e.target.value })
						}
						className='w-full p-2 mb-2 border rounded-lg'
					/>
					<input
						type='number'
						placeholder='Белки (г)'
						value={manualInput.protein}
						onChange={e =>
							setManualInput({ ...manualInput, protein: e.target.value })
						}
						className='w-full p-2 mb-2 border rounded-lg'
					/>
					<input
						type='number'
						placeholder='Жиры (г)'
						value={manualInput.fats}
						onChange={e =>
							setManualInput({ ...manualInput, fats: e.target.value })
						}
						className='w-full p-2 mb-2 border rounded-lg'
					/>
					<input
						type='number'
						placeholder='Углеводы (г)'
						value={manualInput.carbs}
						onChange={e =>
							setManualInput({ ...manualInput, carbs: e.target.value })
						}
						className='w-full p-2 mb-2 border rounded-lg'
					/>
					<input
						type='text'
						placeholder='Рекомендации (опционально)'
						value={manualInput.suggestions}
						onChange={e =>
							setManualInput({ ...manualInput, suggestions: e.target.value })
						}
						className='w-full p-2 mb-2 border rounded-lg'
					/>
					<div className='flex gap-2'>
						<motion.button
							onClick={handleManualInputSubmit}
							className='bg-green-200 text-gray-700 p-2 rounded-lg flex-1'
							whileHover={{ scale: 1.03 }}
							whileTap={{ scale: 0.97 }}
						>
							Сохранить
						</motion.button>
						<motion.button
							onClick={() => setShowManualInput(false)}
							className='bg-red-200 text-gray-700 p-2 rounded-lg flex-1'
							whileHover={{ scale: 1.03 }}
							whileTap={{ scale: 0.97 }}
						>
							Отмена
						</motion.button>
					</div>
				</motion.div>
			)}
			{analysis && <FoodAnalysisResult analysis={analysis} />}
		</div>
	)
}
