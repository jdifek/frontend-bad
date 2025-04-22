import { useState } from 'react'
import { motion } from 'framer-motion'
import { IoCamera, IoCheckmarkCircle } from 'react-icons/io5'

type AnalysisChecklistProps = {
	onSelect: (biomarker: string) => void
	onPhotoUpload: (file: File) => void
}

export const AnalysisChecklist = ({
	onSelect,
	onPhotoUpload,
}: AnalysisChecklistProps) => {
	const [selectedBiomarkers, setSelectedBiomarkers] = useState<string[]>([])
	const [photo, setPhoto] = useState<File | null>(null)
	const biomarkers = [
		'Витамин D',
		'Ферритин',
		'Витамин B12',
		'Фолиевая кислота',
		'Гемоглобин',
		'Магний',
		'Цинк',
		'Селен',
	]

	const handleSelect = (biomarker: string) => {
		const isSelected = selectedBiomarkers.includes(biomarker)
		if (isSelected) {
			setSelectedBiomarkers(selectedBiomarkers.filter(b => b !== biomarker))
		} else {
			setSelectedBiomarkers([...selectedBiomarkers, biomarker])
			onSelect(biomarker)
		}
	}

	const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			const file = e.target.files[0]
			setPhoto(file)
			onPhotoUpload(file)
		}
	}

	return (
		<div className='mb-6'>
			<h2 className='text-lg font-semibold text-blue-900 mb-3'>
				Отметьте проверенные биомаркеры:
			</h2>
			<div className='bg-white rounded-xl p-4 shadow-sm border border-gray-300'>
				<div className='grid grid-cols-2 gap-2'>
					{biomarkers.map(biomarker => (
						<motion.button
							key={biomarker}
							className={`p-3 rounded-lg flex items-center justify-between border ${
								selectedBiomarkers.includes(biomarker)
									? 'bg-blue-50 border-blue-600'
									: 'border-gray-300 hover:border-blue-600'
							}`}
							onClick={() => handleSelect(biomarker)}
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
						>
							<span className='text-blue-900 text-sm'>{biomarker}</span>
							{selectedBiomarkers.includes(biomarker) && (
								<IoCheckmarkCircle className='text-blue-600' />
							)}
						</motion.button>
					))}
				</div>
			</div>
			<div className='mt-4'>
				<h3 className='text-lg font-semibold text-blue-900 mb-2'>
					Загрузите фото анализов:
				</h3>
				<label className='block'>
					<input
						type='file'
						accept='image/*'
						onChange={handlePhotoUpload}
						className='hidden'
					/>
					<motion.div
						className='p-4 bg-blue-50 rounded-xl border border-dashed border-blue-600 text-center cursor-pointer'
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
					>
						<IoCamera size={24} className='mx-auto mb-2 text-blue-600' />
						<p className='text-blue-900 text-sm'>
							{photo ? photo.name : 'Нажмите, чтобы загрузить фото анализов'}
						</p>
					</motion.div>
				</label>
				{photo && (
					<motion.button
						onClick={() => setPhoto(null)}
						className='mt-2 text-blue-600 text-sm'
						whileHover={{ scale: 1.1 }}
						whileTap={{ scale: 0.9 }}
					>
						Удалить фото
					</motion.button>
				)}
			</div>
		</div>
	)
}
