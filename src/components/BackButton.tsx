import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { IoArrowBack } from "react-icons/io5";

export const BackButton = () => {
  const navigate = useNavigate();

  return (
    <motion.button
      onClick={() => navigate("/")}
      className=" p-2 text-blue-900 rounded-full pl-0 hover:bg-blue-100 transition-colors flex items-center"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <IoArrowBack size={24} />
      <span className="ml-2 text-sm font-medium">Назад</span>
    </motion.button>
  );
};
