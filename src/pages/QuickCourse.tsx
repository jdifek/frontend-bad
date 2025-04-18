import { useState } from 'react'
import { motion } from 'framer-motion'
import { GoalSelector } from '../components/re-used/GoalSelector'
import { SupplementInput } from '../components/re-used/SupplementInput'
import { CourseTable } from '../components/re-used/CourseTable'

type Supplement = {
  name: string
  dose?: string
}

type Course = {
  goal: string
  supplements: Supplement[]
  schedule: {
    morning: string[]
    afternoon: string[]
    evening: string[]
  }
  duration: number
  suggestions: string
}

export const QuickCourse = () => {
  const [goal, setGoal] = useState<string>('')
  const [supplements, setSupplements] = useState<Supplement[]>([])
  const [course, setCourse] = useState<Course | null>(null)

  const handleGenerateCourse = () => {
    setCourse({
      goal,
      supplements: supplements.map(s => ({ name: s.name, dose: '200mg' })),
      schedule: {
        morning: supplements.map(s => s.name),
        afternoon: [],
        evening: [],
      },
      duration: 30,
      suggestions: `Для ${goal} попробуйте добавить мелатонин в низкой дозе.`,
    })
  }

  return (
    <div className='relative p-4 max-w-md mx-auto'>
      <motion.h1
        className='text-2xl font-bold mb-6 text-text-primary relative z-10'
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Создать быстрый курс
      </motion.h1>
      <GoalSelector onSelect={(g: string) => setGoal(g)} />
      <SupplementInput
        onAdd={(supplement: Supplement) =>
          setSupplements([...supplements, supplement])
        }
      />
      <motion.button
        onClick={handleGenerateCourse}
        className='bg-sky-blue text-text-primary p-3 rounded-lg w-full relative z-10 font-medium shadow-md border border-white'
        disabled={!goal || supplements.length === 0}
        whileHover={{ scale: 1.03, boxShadow: '0 8px 16px rgba(0,0,0,0.08)' }}
        whileTap={{ scale: 0.97 }}
      >
        Сгенерировать курс
      </motion.button>
      {course && <CourseTable course={course} />}
    </div>
  )
}
