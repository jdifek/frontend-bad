import { motion } from 'framer-motion'
import { IoRestaurantOutline, IoNutritionOutline } from 'react-icons/io5'

interface Analysis {
	dish: string;
	calories: number;
	nutrients: {
		protein: number;
		fats: number;
		carbs: number;
	};
	suggestions: string;
}

export const FoodAnalysisResult = ({ analysis }: { analysis: Analysis }) => {
  const resultVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <motion.div
      className='my-8'
      variants={resultVariants}
      initial='hidden'
      animate='visible'
    >
      <h2 className='text-xl font-semibold mb-4 text-navy-blue  flex items-center'>
        <IoRestaurantOutline className='mr-2 text-primary-blue' size={22} />
        Анализ питания
      </h2>
      <div className='bg-white rounded-xl shadow-medium border border-light-blue overflow-hidden'>
        <div className='bg-light-blue p-4 flex items-center'>
          <IoNutritionOutline size={24} className='mr-3 text-navy-blue' />
          <h3 className='font-medium text-navy-blue'>{analysis.dish}</h3>
        </div>
        <div className='p-5'>
          <div className='grid grid-cols-3 gap-3 mb-4'>
            <div className='bg-light-blue p-3 rounded-lg text-center'>
              <div className='text-sm text-text-light'>Калории</div>
              <div className='font-bold text-navy-blue'>
                {analysis.calories} ккал
              </div>
            </div>
            <div className='bg-light-blue p-3 rounded-lg text-center'>
              <div className='text-sm text-text-light'>Белки</div>
              <div className='font-bold text-navy-blue'>
                {analysis.nutrients.protein} г
              </div>
            </div>
            <div className='bg-light-blue p-3 rounded-lg text-center'>
              <div className='text-sm text-text-light'>Жиры</div>
              <div className='font-bold text-navy-blue'>
                {analysis.nutrients.fats} г
              </div>
            </div>
          </div>
          <div className='bg-light-blue p-3 rounded-lg text-center mb-4'>
            <div className='text-sm text-text-light'>Углеводы</div>
            <div className='font-bold text-navy-blue'>
              {analysis.nutrients.carbs} г
            </div>
          </div>
          <div className='border-t border-silver pt-4 mt-2'>
            <p className='text-text-light text-sm'>{analysis.suggestions}</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}