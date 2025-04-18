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
			icon: <ImTarget className='mr-2 text-lg' />,
			bgColor: 'bg-sky-blue',
		},
		{
			path: '/analysis-course',
			label: 'Курс по анализам',
			icon: <IoFlask className='mr-2 text-lg' />,
			bgColor: 'bg-blossom-pink',
		},
		{
			path: '/food-analysis',
			label: 'Анализ питания',
			icon: <IoRestaurant className='mr-2 text-lg' />,
			bgColor: 'bg-spring-green',
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
			className='bg-white shadow-md p-4 sticky top-0 z-999 border-b border-sunshine-yellow'
			initial='hidden'
			animate='visible'
			variants={navVariants}
		>
			<div className='max-w-md mx-auto flex items-center justify-between'>
				<Link
					to='/'
					className='text-xl font-bold text-text-primary flex items-center gap-2'
				>
					<ImLeaf className='text-lime-green' />
					<span className='bg-gradient-to-r from-sky-blue to-blossom-pink bg-clip-text text-transparent'>
						ИИ-Нутрициолог
					</span>
				</Link>
				<button
					className='text-text-primary p-2 rounded-full hover:bg-gray-100 transition-colors'
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
				<div className='flex flex-col space-y-2 mt-3 bg-white/80 backdrop-blur-sm rounded-xl p-2'>
					{navItems.map(item => (
						<Link
							key={item.path}
							to={item.path}
							className={`flex items-center p-3 text-text-primary hover:bg-gray-50 rounded-lg transition-all ${item.bgColor} bg-opacity-25`}
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
