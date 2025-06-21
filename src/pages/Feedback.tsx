import { motion } from "framer-motion";
import { BiMailSend, BiPhone } from "react-icons/bi";
import { FaTelegramPlane } from "react-icons/fa";

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
            <span className="font-medium">Телефон:</span> +7 (985) 125-33-99
          </span>
        </div>
        <div className="flex items-center justify-center gap-2 text-sm text-gray-700">
          <BiMailSend className="text-blue-600" />
          <span>
            <span className="font-medium">Email:</span>{" "}
            limitless.pharm@gmail.com
          </span>
        </div>

        <a
          href="https://t.me/limitlesspharm"
          className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <FaTelegramPlane size={18} />
          Написать в чат
        </a>
      </div>
    </motion.div>
  );
};
