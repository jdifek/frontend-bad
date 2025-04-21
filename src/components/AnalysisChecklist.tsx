import { useState } from 'react';
import { motion } from 'framer-motion';
import { IoCheckmarkCircle } from 'react-icons/io5';

type AnalysisChecklistProps = {
  onSelect: (biomarker: string) => void;
};

export const AnalysisChecklist = ({ onSelect }: AnalysisChecklistProps) => {
  const [selectedBiomarkers, setSelectedBiomarkers] = useState<string[]>([]);
  const biomarkers = [
    'Витамин D',
    'Ферритин',
    'Витамин B12',
    'Фолиевая кислота',
    'Гемоглобин',
    'Магний',
    'Цинк',
    'Селен',
  ];

  const handleSelect = (biomarker: string) => {
    const isSelected = selectedBiomarkers.includes(biomarker);
    
    if (isSelected) {
      const updated = selectedBiomarkers.filter(b => b !== biomarker);
      setSelectedBiomarkers(updated);
    } else {
      setSelectedBiomarkers([...selectedBiomarkers, biomarker]);
      onSelect(biomarker);
    }
  };

  return (
    <div className='mb-6'>
      <h2 className='text-lg font-semibold text-blue-900 mb-3'>Отметьте проверенные биомаркеры:</h2>
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
    </div>
  );
};