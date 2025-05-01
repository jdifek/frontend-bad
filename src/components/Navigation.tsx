import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { IoMenu, IoClose, IoFlask, IoRestaurant } from 'react-icons/io5'
import { ImTarget } from 'react-icons/im'
import { FaBook } from 'react-icons/fa'

export const Navigation = () => {
	const [isOpen, setIsOpen] = useState(false)

	const navItems = [
		{
			path: '/quick-course',
			label: 'Быстрый курс',
			icon: <ImTarget className='mr-2 text-lg text-blue-600' />,
			bgColor: 'bg-blue-50',
		},
		{
			path: '/analysis-course',
			label: 'Курс по анализам',
			icon: <IoFlask className='mr-2 text-lg text-blue-600' />,
			bgColor: 'bg-blue-50',
		},
		{
			path: '/food-analysis',
			label: 'Анализ питания',
			icon: <IoRestaurant className='mr-2 text-lg text-blue-600' />,
			bgColor: 'bg-blue-50',
		},
		{
			path: '/my-course',
			label: 'Мой курс',
			icon: <FaBook className='mr-2 text-lg text-blue-600' />,
			bgColor: 'bg-blue-50',
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
			className='fixed top-0 left-0 w-full z-50 h-auto bg-white border-b border-blue-600 shadow-sm'
			initial='hidden'
			animate='visible'
			variants={navVariants}
		>
			<div className='max-w-md mx-auto pt-[80px] px-4 pb-4 flex items-center justify-between'>
				<Link
					to='/'
					className='text-xl font-bold text-blue-900 flex items-center gap-2'
				>
					<img src='/Group 14.png' alt='logo' className='w-10 h-10' />
					<span>Limitless.Pharm</span>
				</Link>
				<button
					className='text-blue-900 p-2 rounded-full hover:bg-blue-50 transition-colors'
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
				<div className='flex flex-col space-y-2 mt-3 bg-white rounded-xl p-2 mx-4 mb-4 shadow-sm'>
					{navItems.map(item => (
						<Link
							key={item.path}
							to={item.path}
							className={`flex items-center p-3 text-blue-900 hover:bg-blue-50 rounded-lg transition-all border border-transparent hover:border-blue-600`}
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
