import { useState } from 'react'
import { motion } from 'framer-motion'
import { IoAtOutline } from 'react-icons/io5'

export const GoalSelector = ({ onSelect }) => {
	const goals = [
		'Повысить концентрацию',
		'Энергия / бодрость',
		'Улучшить сон',
		'Поддержка иммунитета',
		'Снижение веса',
		'Другое',
	]
	const [selectedGoal, setSelectedGoal] = useState('')
	const [customGoal, setCustomGoal] = useState('')

	const handleSelect = goal => {
		setSelectedGoal(goal)
		if (goal !== 'Другое') {
			onSelect(goal)
		}
	}

	const handleCustomGoal = e => {
		setCustomGoal(e.target.value)
		onSelect(e.target.value)
	}

	const buttonVariants = {
		hover: { scale: 1.02, transition: { duration: 0.2 } },
		tap: { scale: 0.98 },
	}

	// Colors for each goal
	const goalColors = {
		'Повысить концентрацию': 'bg-sky-blue',
		'Энергия / бодрость': 'bg-sunshine-yellow',
		'Улучшить сон': 'bg-lavender',
		'Поддержка иммунитета': 'bg-spring-green',
		'Снижение веса': 'bg-blossom-pink',
		Другое: 'bg-gray-200',
	}

	return (
		<motion.div
			className='mb-8'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
		>
			<h2 className='text-xl font-semibold mb-4 text-text-primary flex items-center'>
				<IoAtOutline className='mr-2 text-sky-blue' size={22} /> Выберите вашу
				цель
			</h2>
			<div className='grid grid-cols-2 gap-3'>
				{goals.map(goal => (
					<motion.button
						key={goal}
						onClick={() => handleSelect(goal)}
						className={`p-4 rounded-xl text-left flex items-center justify-center ${
							selectedGoal === goal
								? `${goalColors[goal]} text-text-primary shadow-md`
								: `${goalColors[goal]} bg-opacity-30 text-text-primary`
						} transition-all border border-white`}
						variants={buttonVariants}
						whileHover='hover'
						whileTap='tap'
					>
						<span className='font-medium'>{goal}</span>
					</motion.button>
				))}
			</div>
			{selectedGoal === 'Другое' && (
				<motion.input
					type='text'
					value={customGoal}
					onChange={handleCustomGoal}
					placeholder='Введите свою цель'
					className='mt-4 w-full p-3 border rounded-lg border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-blue'
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.3 }}
				/>
			)}
		</motion.div>
	)
}
