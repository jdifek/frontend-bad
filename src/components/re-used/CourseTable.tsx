import { motion } from 'framer-motion';
import { IoSunny, IoPizzaOutline, IoMoonOutline } from 'react-icons/io5';

type Course = {
  goal: string;
  supplements: { name: string; dose?: string }[];
  schedule: {
    morning: string[];
    afternoon: string[];
    evening: string[];
  };
  duration: number;
  suggestions: string;
};

type CourseTableProps = {
  course: Course;
};

export const CourseTable = ({ course }: CourseTableProps) => {
  const scheduleItems = [
    { time: 'Утро', items: course.schedule.morning, icon: <IoSunny className='text-blue-500' /> },
    { time: 'День', items: course.schedule.afternoon, icon: <IoPizzaOutline className='text-blue-500' /> },
    { time: 'Вечер', items: course.schedule.evening, icon: <IoMoonOutline className='text-blue-500' /> },
  ];

  return (
    <motion.div
      className='bg-white rounded-xl p-6 shadow-md mb-6 border border-blue-50'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className='text-lg font-semibold text-blue-900 mb-3'>{`Ваш курс для "${course.goal}"`}</h2>
      <p className='text-gray-600 mb-4 text-sm'>{`Длительность: ${course.duration} дней`}</p>
      
      <div className='mb-6'>
        <h3 className='text-md font-medium text-blue-900 mb-3'>Расписание приёма:</h3>
        {scheduleItems.map((item, index) => (
          <div key={index} className='mb-4'>
            <div className='flex items-center mb-2'>
              {item.icon}
              <span className='ml-2 text-blue-600 font-medium'>{item.time}:</span>
            </div>
            {item.items.length > 0 ? (
              <ul className='ml-8 list-disc text-gray-600 text-sm'>
                {item.items.map((supplement, idx) => (
                  <li key={idx}>{supplement}</li>
                ))}
              </ul>
            ) : (
              <p className='ml-8 text-gray-600 italic text-sm'>Нет добавок</p>
            )}
          </div>
        ))}
      </div>
      
      <div className='bg-blue-50 p-4 rounded-lg'>
        <h3 className='text-md font-medium text-blue-900 mb-2'>Рекомендации:</h3>
        <p className='text-gray-600 text-sm'>{course.suggestions}</p>
      </div>
    </motion.div>
  );
};