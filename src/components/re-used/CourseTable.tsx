import { useState } from 'react'
import { motion } from 'framer-motion'
import { IoSunny, IoPizzaOutline, IoMoonOutline } from 'react-icons/io5'

type Supplement = {
  name: string
  dose?: string
  time?: string
  intakeInstructions?: string
}

type Course = {
  id: string
  goal: string
  supplements: Supplement[]
  schedule: {
    morning: string[]
    afternoon: string[]
    evening: string[]
  }
  duration: number | null
  suggestions: string
  warnings: string
  questions: string[]
  repeatAnalysis: string
  disclaimer: string
  compatibilityNotes: string;

}

type CourseTableProps = {
  course: Course
}

export const CourseTable = ({ course }: CourseTableProps) => {
  const [duration, setDuration] = useState<number>(course.duration || 30)

  const scheduleItems = [
    {
      time: 'Утро',
      items: course.schedule.morning,
      icon: <IoSunny className='text-blue-500' />,
    },
    {
      time: 'День',
      items: course.schedule.afternoon,
      icon: <IoPizzaOutline className='text-blue-500' />,
    },
    {
      time: 'Вечер',
      items: course.schedule.evening,
      icon: <IoMoonOutline className='text-blue-500' />,
    },
  ]

  return (
    <motion.div
      className='bg-white rounded-xl p-6 shadow-md my-6 border border-blue-50'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className='text-lg font-semibold text-blue-900 mb-3'>{`Ваш курс для "${course.goal}"`}</h2>

      {/* Длительность курса */}
      <div className='mb-4 flex items-center'>
        <label className='text-sm text-gray-600 mr-2'>
          Длительность курса (дней):
        </label>
        <input
          type='number'
          value={duration}
          onChange={e =>
            setDuration(Math.max(1, parseInt(e.target.value) || 1))
          }
          className='w-20 p-2 rounded-lg border border-gray-300 focus:border-blue-600 focus:outline-none bg-white'
        />
      </div>

      {/* Расписание приёма */}
      <div className='mb-6'>
        <h3 className='text-md font-medium text-blue-900 mb-3'>
          Расписание приёма:
        </h3>
        {scheduleItems.map((item, index) => (
          <div key={index} className='mb-4'>
            <div className='flex items-center mb-2'>
              {item.icon}
              <span className='ml-2 text-blue-600 font-medium'>
                {item.time}:
              </span>
            </div>
            {item.items.length > 0 ? (
              <ul className='ml-8 text-gray-600 text-sm'>
                {item.items.map((supplement, idx) => {
                  const suppData = course.supplements.find(
                    s => s.name === supplement
                  )
                  return (
                    <li key={idx} className='mb-2'>
                      <div className='flex items-center justify-between'>
                        <span>
                          {supplement}{' '}
                          {suppData?.dose ? `(${suppData.dose})` : ''}
                          {suppData?.intakeInstructions ? (
                            <span className='text-gray-500 italic'>
                              {' — '}{suppData.intakeInstructions}
                            </span>
                          ) : ''}
                        </span>
                      </div>
                    </li>
                  )
                })}
              </ul>
            ) : (
              <p className='ml-8 text-gray-600 italic text-sm'>Нет добавок</p>
            )}
          </div>
        ))}
      </div>

      {/* Рекомендации */}
      <div className='bg-blue-50 p-4 rounded-lg mb-4'>
        <h3 className='text-md font-medium text-blue-900 mb-2'>
          Рекомендации:
        </h3>
        <p className='text-gray-600 text-sm'>{course.suggestions} </p>
        <p className='text-gray-600 text-sm'>{course.compatibilityNotes} </p>
      </div>

      {/* Дисклеймер */}
      <div className='bg-gray-50 p-4 rounded-lg'>
        <h3 className='text-md font-medium text-gray-900 mb-2'>Важно:</h3>
        <p className='text-gray-600 text-sm'>{course.disclaimer}</p>
      </div>
    </motion.div>
  )
}