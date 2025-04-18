import { useState } from 'react'
import { motion } from 'framer-motion'
import { IoPencil, IoCamera, IoAddCircleOutline } from 'react-icons/io5'

interface SupplementInputProps {
	onAdd: (supplement: { name: string }) => void;
}

export const SupplementInput = ({ onAdd }: SupplementInputProps) => {
	const [supplement, setSupplement] = useState('')
	const [method, setMethod] = useState('manual')

	const handleAdd = () => {
		if (supplement.trim()) {
			onAdd({ name: supplement })
			setSupplement('')
		}
	}

	const buttonVariants = {
		hover: { scale: 1.03, transition: { duration: 0.2 } },
		tap: { scale: 0.97 },
	}

	return (
		<motion.div
			className='mb-8'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5, delay: 0.2 }}
		>
			<h2 className='text-xl font-semibold mb-4 text-text-primary'>
				Добавьте ваши добавки
			</h2>
			<div className='flex space-x-3 mb-5'>
				<motion.button
					onClick={() => setMethod('manual')}
					className={`p-3 rounded-lg flex items-center justify-center flex-1 ${
						method === 'manual'
							? 'bg-lavender text-text-primary shadow-md'
							: 'bg-lavender bg-opacity-30 text-text-primary'
					} border border-white`}
					variants={buttonVariants}
					whileHover='hover'
					whileTap='tap'
				>
					<IoPencil className='mr-2' size={18} /> Ввести вручную
				</motion.button>
				<motion.button
					onClick={() => setMethod('photo')}
					className={`p-3 rounded-lg flex items-center justify-center flex-1 ${
						method === 'photo'
							? 'bg-lavender text-text-primary shadow-md'
							: 'bg-lavender bg-opacity-30 text-text-primary'
					} border border-white`}
					variants={buttonVariants}
					whileHover='hover'
					whileTap='tap'
				>
					<IoCamera className='mr-2' size={18} /> Загрузить фото
				</motion.button>
			</div>
			{method === 'manual' ? (
				<div className='flex space-x-2'>
					<input
						type='text'
						value={supplement}
						onChange={e => setSupplement(e.target.value)}
						placeholder='Название добавки (например, Магний)'
						className='flex-1 p-3 border rounded-lg border-gray-200 focus:outline-none focus:ring-2 focus:ring-lavender'
					/>
					<motion.button
						onClick={handleAdd}
						className='bg-lavender text-text-primary p-3 rounded-lg flex items-center justify-center'
						variants={buttonVariants}
						whileHover='hover'
						whileTap='tap'
					>
						<IoAddCircleOutline size={22} />
					</motion.button>
				</div>
			) : (
				<div className='p-6 bg-lavender bg-opacity-20 rounded-xl border border-lavender'>
					<div className='flex flex-col items-center justify-center'>
						<IoCamera size={36} className='text-text-primary opacity-60 mb-3' />
						<p className='text-text-primary text-center'>
							Загрузка фото добавок (будет реализовано позже)
						</p>
					</div>
				</div>
			)}
		</motion.div>
	)
}
