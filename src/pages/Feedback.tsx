import { motion } from "framer-motion";
import { BiMailSend, BiPhone } from "react-icons/bi";

export const Feedback = () => {
  return (
    <motion.div
      className="max-w-md mx-auto p-4 pt-40 py-12 rounded-2xl shadow-xl bg-white border border-blue-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-blue-800">
          Связаться с нами
        </h2>
        <div className="flex items-center justify-center gap-2 text-sm text-gray-700">
          <BiPhone className="text-blue-600" />
          <span>
            <span className="font-medium">Телефон:</span> +8 (985) 124-33-99
          </span>
        </div>
        <div className="flex items-center justify-center gap-2 text-sm text-gray-700">
          <BiMailSend className="text-blue-600" />
          <span>
            <span className="font-medium">Email:</span>{" "}
            limitless.pharm@gmail.com
          </span>
        </div>
      </div>
    </motion.div>
  );
};
