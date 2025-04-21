import { useState } from "react";
import { motion } from "framer-motion";
import { AnalysisChecklist } from "../components/AnalysisChecklist";
import { GoalSelector } from "../components/re-used/GoalSelector";
import { CourseTable } from "../components/re-used/CourseTable";
import { IoCalendarOutline } from "react-icons/io5";
import { Slide, toast } from "react-toastify";

type Course = {
  goal: string;
  supplements: { name: string; dose: string }[];
  schedule: {
    morning: string[];
    afternoon: string[];
    evening: string[];
  };
  duration: number;
  suggestions: string;
};

export const AnalysisCourse = () => {
  const [goal, setGoal] = useState("");
  const [biomarkers, setBiomarkers] = useState<string[]>([]);
  const [course, setCourse] = useState<Course | null>(null);

  const handleGenerateCourse = () => {
    setCourse({
      goal,
      supplements: [{ name: "Витамин D", dose: "1000IU" }],
      schedule: {
        morning: ["Витамин D"],
        afternoon: [],
        evening: [],
      },
      duration: 60,
      suggestions: biomarkers.includes("Ферритин")
        ? "Уровень ферритина ниже нормы — добавьте железо с витамином С."
        : "Ваши анализы в норме, добавлен базовый курс.",
    });
  };

  const handleAddReminder = () => {
    toast.info("Напоминание о повторных анализах через 8 недель добавлено!", {
      position: "bottom-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Slide,
    });
  };

  return (
    <div className="p-4 py-40 max-w-md mx-auto">
      <motion.h1
        className="text-2xl font-bold mb-6 text-gray-700"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Курс по анализам
      </motion.h1>
      <AnalysisChecklist
        onSelect={(biomarker: string) =>
          setBiomarkers([...biomarkers, biomarker])
        }
      />
      <GoalSelector onSelect={setGoal} />
      <motion.button
        onClick={handleGenerateCourse}
        className="bg-pink-200 text-gray-700 p-3 rounded-lg w-full mb-6 font-medium shadow-md border border-white"
        disabled={!goal || biomarkers.length === 0}
        whileHover={{ scale: 1.03, boxShadow: "0 8px 16px rgba(0,0,0,0.08)" }}
        whileTap={{ scale: 0.97 }}
      >
        Сгенерировать курс
      </motion.button>
      {course && (
        <>
          <CourseTable course={course} />
          <motion.button
            onClick={handleAddReminder}
            className="bg-purple-200 text-gray-700 p-3 rounded-lg w-full font-medium shadow-md border border-white flex items-center justify-center"
            whileHover={{
              scale: 1.03,
              boxShadow: "0 8px 16px rgba(0,0,0,0.08)",
            }}
            whileTap={{ scale: 0.97 }}
          >
            <IoCalendarOutline size={20} className="mr-2" />
            Добавить напоминание на повторные анализы
          </motion.button>
        </>
      )}
    </div>
  );
};
