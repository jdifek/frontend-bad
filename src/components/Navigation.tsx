import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { IoMenu, IoClose, IoFlask, IoRestaurant } from 'react-icons/io5'
import { ImTarget, ImLeaf } from 'react-icons/im'

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    {
      path: '/quick-course',
      label: 'Быстрый курс',
      icon: <ImTarget className='mr-2 text-lg text-primary-blue' />,
      bgColor: 'bg-light-blue',
    },
    {
      path: '/analysis-course',
      label: 'Курс по анализам',
      icon: <IoFlask className='mr-2 text-lg text-primary-blue' />,
      bgColor: 'bg-light-blue',
    },
    {
      path: '/food-analysis',
      label: 'Анализ питания',
      icon: <IoRestaurant className='mr-2 text-lg text-primary-blue' />,
      bgColor: 'bg-light-blue',
    },
  ]

  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  const menuVariants = {
    closed: { height: 0, opacity: 0, transition: { duration: 0.3 } },
    open: { height: 'auto', opacity: 1, transition: { duration: 0.3 } },
  }

  return (
    <motion.nav
      className="fixed top-0 left-0 w-full z-50 h-auto bg-white border-b border-primary-blue  shadow-soft"
      initial="hidden"
      animate="visible"
      variants={navVariants}
    >
      
      <div className='max-w-md mx-auto pt-[70px] px-4 pb-4 flex items-center justify-between'>
        <Link
          to='/'
          className='text-xl font-bold text-navy-blue flex items-center gap-2'
        >
          <ImLeaf className='text-primary-blue' />
          <span>ИИ-Нутрициолог</span>
        </Link>
        <button
          className='text-navy-blue p-2 rounded-full hover:bg-light-blue transition-colors'
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <IoClose size={24} /> : <IoMenu size={24} />}
        </button>
      </div>
      <motion.div
        className='overflow-hidden'
        variants={menuVariants}
        animate={isOpen ? 'open' : 'closed'}
      >
        <div className='flex flex-col space-y-2 mt-3 bg-white rounded-xl p-2 mx-4 mb-4 shadow-soft'>
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center p-3 text-navy-blue hover:bg-light-blue rounded-lg transition-all border border-transparent hover:border-primary-blue`}
              onClick={() => setIsOpen(false)}
            >
              {item.icon}
              <span className='font-medium'>{item.label}</span>
            </Link>
          ))}
        </div>
      </motion.div>
    </motion.nav>
  )
}