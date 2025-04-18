import { motion } from 'framer-motion'
import { IoFlaskOutline, IoCloudUploadOutline } from 'react-icons/io5'

interface AnalysisChecklistProps {
	onSelect: (biomarker: string) => void;
}

export const AnalysisChecklist = ({ onSelect }: AnalysisChecklistProps) => {
	const biomarkers = ['Витамин D', 'Витамин B12', 'Ферритин', 'Магний', 'Цинк']

	const handleChange = (biomarker: string) => {
		onSelect(biomarker)
	}

	return (
		<motion.div
			className='mb-8'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
		>
			<h2 className='text-xl font-semibold mb-4 text-text-primary flex items-center'>
				<IoFlaskOutline className='mr-2 text-blossom-pink' size={22} /> Выберите
				анализы
			</h2>
			<div className='space-y-3 bg-white p-4 rounded-lg shadow-sm mb-6 border border-gray-100'>
				{biomarkers.map(biomarker => (
					<label
						key={biomarker}
						className='flex items-center text-text-primary hover:bg-gray-50 p-2 rounded-md transition-colors cursor-pointer'
					>
						<input
							type='checkbox'
							onChange={() => handleChange(biomarker)}
							className='mr-3 h-4 w-4 text-blossom-pink focus:ring-blossom-pink rounded'
						/>
						{biomarker}
					</label>
				))}
			</div>
			<div className='p-6 bg-blossom-pink bg-opacity-20 rounded-xl border border-blossom-pink'>
				<div className='flex flex-col items-center justify-center'>
					<IoCloudUploadOutline
						size={36}
						className='text-text-primary opacity-60 mb-3'
					/>
					<p className='text-text-primary text-center'>
						Загрузка фото анализов (будет реализовано позже)
					</p>
				</div>
			</div>
		</motion.div>
	)
}
