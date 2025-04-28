import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { IoFlask, IoRestaurant, IoInformationCircle } from 'react-icons/io5';
import { ImTarget } from 'react-icons/im';
import { AboutModal } from '../components/AboutModal';

export const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const buttonVariants = {
    hover: {
      scale: 1.05,
      boxShadow: '0 8px 16px rgba(0,0,0,0.08)',
      transition: { duration: 0.3 },
    },
    tap: { scale: 0.97 },
  };

  return (
    <div className='p-6 py-40 max-w-md mx-auto relative bg-blue-50'>
      <motion.h1
        className='text-3xl font-bold text-center mb-6 text-blue-900'
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Limitless.Pharm
      </motion.h1>
      <motion.p
        className='text-center mb-10 text-gray-600 font-light text-lg'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        Выберите, с чего начнём
      </motion.p>
      <div className='space-y-5'>
        <motion.div variants={buttonVariants} whileHover='hover' whileTap='tap'>
          <Link
            to='/quick-course'
            className='flex items-center justify-center w-full p-4 bg-white text-blue-900 rounded-xl shadow-md border border-gray-300 hover:border-blue-600'
          >
            <ImTarget className='mr-3 text-xl text-blue-600' />
            <span className='font-medium'>Быстрый курс по цели</span>
          </Link>
        </motion.div>
        <motion.div variants={buttonVariants} whileHover='hover' whileTap='tap'>
          <Link
            to='/analysis-course'
            className='flex items-center justify-center w-full p-4 bg-white text-blue-900 rounded-xl shadow-md border border-gray-300 hover:border-blue-600'
          >
            <IoFlask className='mr-3 text-xl text-blue-600' />
            <span className='font-medium'>Курс по анализам</span>
          </Link>
        </motion.div>
        <motion.div variants={buttonVariants} whileHover='hover' whileTap='tap'>
          <Link
            to='/food-analysis'
            className='flex items-center justify-center w-full p-4 bg-white text-blue-900 rounded-xl shadow-md border border-gray-300 hover:border-blue-600'
          >
            <IoRestaurant className='mr-3 text-xl text-blue-600' />
            <span className='font-medium'>Анализ питания по фото</span>
          </Link>
        </motion.div>
        <motion.div variants={buttonVariants} whileHover='hover' whileTap='tap'>
          <button
            onClick={() => setIsModalOpen(true)}
            className='flex items-center justify-center w-full p-4 bg-white text-blue-900 rounded-xl shadow-md border border-gray-300 hover:border-blue-600'
          >
            <IoInformationCircle className='mr-3 text-xl text-blue-600' />
            <span className='font-medium'>О сервисе</span>
          </button>
        </motion.div>
      </div>
      
      <AboutModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};