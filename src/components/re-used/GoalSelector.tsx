import { useState } from 'react'
import { motion } from 'framer-motion'

const goals = [
  'Улучшение сна',
  'Повышение иммунитета',
  'Энергия',
  'Спокойствие',
  'Здоровье суставов',
  'Улучшение памяти',
]

type GoalSelectorProps = {
  onSelect: (goal: string) => void
}

export const GoalSelector = ({ onSelect }: GoalSelectorProps) => {
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null)

  const handleSelect = (goal: string) => {
    setSelectedGoal(goal)
    onSelect(goal)
  }

  return (
    <div className='mb-6'>
      <h2 className='text-lg font-semibold text-navy-blue mb-3'>Выберите цель:</h2>
      <div className='grid grid-cols-2 gap-3'>
        {goals.map(goal => (
          <motion.button
            key={goal}
            className={`p-3 text-sm rounded-xl border ${
              selectedGoal === goal
                ? 'bg-primary-blue text-white border-primary-blue'
                : 'bg-white text-navy-blue border-silver hover:border-primary-blue'
            } transition-all shadow-soft`}
            onClick={() => handleSelect(goal)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            {goal}
          </motion.button>
        ))}
      </div>
    </div>
  )
}