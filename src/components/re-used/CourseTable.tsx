import { motion } from 'framer-motion'
import { IoSunny, IoPizzaOutline, IoMoonOutline } from 'react-icons/io5'

type Course = {
  goal: string
  supplements: { name: string; dose?: string }[]
  schedule: {
    morning: string[]
    afternoon: string[]
    evening: string[]
  }
  duration: number
  suggestions: string
}

type CourseTableProps = {
  course: Course
}

export const CourseTable = ({ course }: CourseTableProps) => {
  const scheduleItems = [
    { time: 'Утро', items: course.schedule.morning, icon: <IoSunny className='text-bright-blue' /> },
    { time: 'День', items: course.schedule.afternoon, icon: <IoPizzaOutline className='text-bright-blue' /> },
    { time: 'Вечер', items: course.schedule.evening, icon: <IoMoonOutline className='text-bright-blue' /> },
  ]

  return (
    <motion.div
      className='bg-white rounded-xl p-6 shadow-medium mb-6 border border-light-blue'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className='text-lg font-semibold text-navy-blue mb-3'>{`Ваш курс для "${course.goal}"`}</h2>
      <p className='text-text-light mb-4 text-sm'>{`Длительность: ${course.duration} дней`}</p>
      
      <div className='mb-6'>
        <h3 className='text-md font-medium text-navy-blue mb-3'>Расписание приёма:</h3>
        {scheduleItems.map((item, index) => (
          <div key={index} className='mb-4'>
            <div className='flex items-center mb-2'>
              {item.icon}
              <span className='ml-2 text-primary-blue font-medium'>{item.time}:</span>
            </div>
            {item.items.length > 0 ? (
              <ul className='ml-8 list-disc text-text-light text-sm'>
                {item.items.map((supplement, idx) => (
                  <li key={idx}>{supplement}</li>
                ))}
              </ul>
            ) : (
              <p className='ml-8 text-text-light italic text-sm'>Нет добавок</p>
            )}
          </div>
        ))}
      </div>
      
      <div className='bg-light-blue p-4 rounded-lg'>
        <h3 className='text-md font-medium text-navy-blue mb-2'>Рекомендации:</h3>
        <p className='text-text-light text-sm'>{course.suggestions}</p>
      </div>
    </motion.div>
  )
}