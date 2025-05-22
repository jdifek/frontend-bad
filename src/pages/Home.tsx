import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { IoFlask, IoRestaurant, IoInformationCircle } from "react-icons/io5";
import { ImTarget } from "react-icons/im";
import { AboutModal } from "../components/AboutModal";
import { FaBook } from "react-icons/fa";
import { useAuth } from "../helpers/context/AuthContext";
import $api from "../api/http";

export const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [courses, setCourses] = useState(false);
  const { user, isLoading: authLoading } = useAuth();

  const buttonVariants = {
    hover: {
      scale: 1.05,
      boxShadow: "0 8px 16px rgba(0,0,0,0.08)",
      transition: { duration: 0.3 },
    },
    tap: { scale: 0.97 },
  };

  useEffect(() => {
    const fetchCourses = async () => {
      if (authLoading || !user?.telegramId) return;

      try {
        const res = await $api.get(
          `/api/my-course/all-courses?telegramId=${user.telegramId}`
        );
        setCourses(res.data.courses ? true : false);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, [user, authLoading]);

  return (
    <div className="p-6 py-40 max-w-md mx-auto relative bg-blue-50">
      <motion.h1
        className="text-3xl font-bold text-center mb-6 text-blue-900"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        ИИ-нутрициолог
      </motion.h1>
      <motion.p
        className="text-center mb-10 text-gray-600 font-light text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        Выберите, с чего начнём
      </motion.p>
      <div className="space-y-5">
        <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
          <Link
            to="/quick-course"
            className="flex items-center justify-center w-full p-4 bg-white text-blue-900 rounded-xl shadow-md border border-gray-300 hover:border-blue-600"
          >
            <ImTarget className="mr-3 text-xl text-blue-600" />
            <span className="font-medium">Быстрый курс по цели</span>
          </Link>
        </motion.div>
        <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
          <Link
            to="/analysis-course"
            className="flex items-center justify-center w-full p-4 bg-white text-blue-900 rounded-xl shadow-md border border-gray-300 hover:border-blue-600"
          >
            <IoFlask className="mr-3 text-xl text-blue-600" />
            <span className="font-medium">Курс по анализам</span>
          </Link>
        </motion.div>
        <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
          <Link
            to="/food-analysis"
            className="flex items-center justify-center w-full p-4 bg-white text-blue-900 rounded-xl shadow-md border border-gray-300 hover:border-blue-600"
          >
            <IoRestaurant className="mr-3 text-xl text-blue-600" />
            <span className="font-medium">Анализ питания по фото</span>
          </Link>
        </motion.div>
        <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
          <Link
            to={courses === true ? "/my-course" : "/quick-course"}
            className="flex items-center justify-center w-full p-4 bg-white text-blue-900 rounded-xl shadow-md border border-gray-300 hover:border-blue-600"
          >
            <FaBook className="mr-3 text-xl text-blue-600" />
            <span className="font-medium">Мои курсы</span>
          </Link>
        </motion.div>
        <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center w-full p-4 bg-white text-blue-900 rounded-xl shadow-md border border-gray-300 hover:border-blue-600"
          >
            <IoInformationCircle className="mr-3 text-xl text-blue-600" />
            <span className="font-medium">О сервисе</span>
          </button>
        </motion.div>

        <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
          <Link
            to="/feedback"
            className="flex items-center justify-center w-full p-4 bg-white text-blue-900 rounded-xl shadow-md border border-gray-300 hover:border-blue-600"
          >
            <IoInformationCircle className="mr-3 text-xl text-blue-600" />
            <span className="font-medium">Обратная связь</span>
          </Link>
        </motion.div>
      </div>

      <AboutModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};
