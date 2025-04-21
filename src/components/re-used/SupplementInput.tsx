import { useState } from 'react';
import { motion } from 'framer-motion';
import { IoAdd } from 'react-icons/io5';

type Supplement = {
  name: string;
  dose?: string;
};

type SupplementInputProps = {
  onAdd: (supplement: Supplement) => void;
};

export const SupplementInput = ({ onAdd }: SupplementInputProps) => {
  const [name, setName] = useState('');
  const [selectedSupplements, setSelectedSupplements] = useState<string[]>([]);

  const handleAddSupplement = () => {
    if (name.trim()) {
      onAdd({ name: name.trim() });
      setName('');
    }
  };

  const commonSupplements = [
    'Омега-3',
    'Витамин D',
    'Магний',
    'Цинк',
    'Пробиотики',
    'Витамин С',
  ];

  const handleQuickAdd = (supplement: string) => {
    if (!selectedSupplements.includes(supplement)) {
      onAdd({ name: supplement });
      setSelectedSupplements([...selectedSupplements, supplement]);
    }
  };

  return (
    <div className='mb-6'>
      <h2 className='text-lg font-semibold text-blue-900 mb-3'>Добавьте добавки:</h2>
      
      <div className='flex mb-4'>
        <input
          type='text'
          value={name}
          onChange={e => setName(e.target.value)}
          className='flex-grow p-3 rounded-l-xl border border-gray-300 focus:border-blue-600 focus:outline-none bg-white'
          placeholder='Название добавки'
        />
        <motion.button
          onClick={handleAddSupplement}
          className='bg-blue-600 text-white p-3 rounded-r-xl flex items-center justify-center'
          disabled={!name.trim()}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <IoAdd size={20} />
        </motion.button>
      </div>
      
      <div className='grid grid-cols-3 gap-2'>
        {commonSupplements.map(supplement => (
          <motion.button
            key={supplement}
            onClick={() => handleQuickAdd(supplement)}
            className={`p-2 text-xs rounded-lg border ${
              selectedSupplements.includes(supplement)
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-blue-900 border-gray-300 hover:border-blue-600'
            } transition-all text-center shadow-sm`}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            disabled={selectedSupplements.includes(supplement)}
          >
            {supplement}
          </motion.button>
        ))}
      </div>
    </div>
  );
};