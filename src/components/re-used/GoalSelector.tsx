import { useState } from 'react';
import { motion } from 'framer-motion';

const goals = [
  'Повысить концентрацию',
  'Энергия / бодрость',
  'Улучшить сон',
  'Поддержка иммунитета',
  'Снижение веса',
  'Другое',
];

type GoalSelectorProps = {
  onSelect: (goal: string) => void;
};

export const GoalSelector = ({ onSelect }: GoalSelectorProps) => {
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [customGoal, setCustomGoal] = useState<string>('');

  const handleSelect = (goal: string) => {
    if (goal !== 'Другое') {
      setSelectedGoal(goal);
      setCustomGoal('');
      onSelect(goal);
    } else {
      setSelectedGoal(goal);
    }
  };

  const handleCustomGoalSubmit = () => {
    if (customGoal.trim()) {
      setSelectedGoal(customGoal);
      onSelect(customGoal);
    }
  };

  return (
    <div className='mb-6'>
      <h2 className='text-lg font-semibold text-blue-900 mb-3'>Выберите цель:</h2>
      <div className='grid grid-cols-2 gap-3'>
        {goals.map(goal => (
          <motion.button
            key={goal}
            className={`p-3 text-sm rounded-xl border ${
              selectedGoal === goal
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-blue-900 border-gray-300 hover:border-blue-600'
            } transition-all shadow-sm`}
            onClick={() => handleSelect(goal)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            {goal}
          </motion.button>
        ))}
      </div>
      {selectedGoal === 'Другое' && (
        <div className='mt-4'>
          <input
            type='text'
            value={customGoal}
            onChange={(e) => setCustomGoal(e.target.value)}
            className='w-full p-3 rounded-xl border border-gray-300 focus:border-blue-600 focus:outline-none bg-white text-blue-900'
            placeholder='Введите вашу цель'
          />
          <motion.button
            onClick={handleCustomGoalSubmit}
            className='mt-2 bg-blue-600 text-white p-3 rounded-xl w-full font-medium shadow-sm'
            disabled={!customGoal.trim()}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Подтвердить
          </motion.button>
        </div>
      )}
    </div>
  );
};