import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../helpers/context/AuthContext";
import $api from "../../api/http";
import { toast, Slide } from "react-toastify";

const defaultGoals = [
  "Повысить концентрацию",
  "Энергия / бодрость",
  "Улучшить сон",
  "Поддержка иммунитета",
  "Снижение веса",
  "Набор массы",
  "Улучшить память",
  "Повысить тестостерон",
];

type GoalSelectorProps = {
  onSelect: (goals: string[]) => void;
  dietPreference: string;
  selectedGoals: string[];
  setSelectedGoals: React.Dispatch<React.SetStateAction<string[]>>;
  setDietPreference: React.Dispatch<React.SetStateAction<string>>;
};

export const GoalSelector = ({
  setSelectedGoals,
  dietPreference,
  selectedGoals,
  onSelect,
  setDietPreference,
}: GoalSelectorProps) => {
  const [customGoal, setCustomGoal] = useState<string>("");
  const [customGoals, setCustomGoals] = useState<string[]>([]);
  const { user, isLoading: authLoading } = useAuth();
  const [isCustomGoalActive, setIsCustomGoalActive] = useState<boolean>(false);

  const getDateString = (date: Date) => {
    const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return offsetDate.toISOString().split("T")[0];
  };
  
  const trackAnalytics = async (goals: string[]) => {
    if (authLoading || !user?.telegramId) {
      console.warn("Невозможно записать аналитику: пользователь не авторизован");
      return;
    }
  
    try {
      const date = getDateString(new Date()); // Отправляем дату в формате YYYY-MM-DD
      await $api.post("/api/courses/analytics/goals", {
        telegramId: user.telegramId,
        goals,
        date,
      });
      console.log("Аналитика целей записана:", { goals, date });
    } catch (error) {
      console.error("Ошибка записи аналитики целей:", error);
    }
  };

  const handleSelect = (goal: string) => {
    let updatedGoals = [...selectedGoals];

    if (goal === "Своя цель") {
      // Переключаем поле ввода
      if (isCustomGoalActive) {
        setIsCustomGoalActive(false);
        setCustomGoal("");
      } else {
        setIsCustomGoalActive(true);
      }
    } else {
      // Обработка стандартных и пользовательских целей
      if (updatedGoals.includes(goal)) {
        // Удаляем цель, если она уже выбрана
        updatedGoals = updatedGoals.filter((g) => g !== goal);
        if (customGoals.includes(goal)) {
          // Удаляем из пользовательских целей
          setCustomGoals(customGoals.filter((g) => g !== goal));
        }
      } else if (updatedGoals.length < 2) {
        // Добавляем цель, если выбрано меньше двух
        updatedGoals.push(goal);
      } else {
        toast.error("Можно выбрать не более двух целей!", {
          position: "bottom-center",
          autoClose: 3000,
          theme: "light",
          transition: Slide,
        });
      }
    }

    setSelectedGoals(updatedGoals);
    onSelect(updatedGoals);
    if (updatedGoals.length > 0) {
      trackAnalytics(updatedGoals);
    }
  };

  const handleCustomGoalSubmit = () => {
    if (customGoal.trim()) {
      const newCustomGoal = customGoal.trim();
      if (allGoals.includes(newCustomGoal)) {
        toast.error("Эта цель уже существует!", {
          position: "bottom-center",
          autoClose: 3000,
          theme: "light",
          transition: Slide,
        });
        return;
      }

      const updatedGoals = [...selectedGoals];
      if (updatedGoals.length < 2) {
        updatedGoals.push(newCustomGoal);
        setCustomGoals([...customGoals, newCustomGoal]);
      } else {
        toast.error("Можно выбрать не более двух целей!", {
          position: "bottom-center",
          autoClose: 3000,
          theme: "light",
          transition: Slide,
        });
        return;
      }

      setSelectedGoals(updatedGoals);
      setCustomGoal("");
      setIsCustomGoalActive(true); // Оставляем поле открытым
      onSelect(updatedGoals);
      trackAnalytics(updatedGoals);
      toast.success("Цель успешно добавлена!", {
        position: "bottom-center",
        autoClose: 3000,
        theme: "light",
        transition: Slide,
      });
    }
  };

  const isGoalSelected = (goal: string) => selectedGoals.includes(goal);

  // Комбинируем стандартные и пользовательские цели
  const allGoals = [...defaultGoals, ...customGoals, "Своя цель"];

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-blue-900 mb-3">
        Выберите до двух целей:
      </h2>

      <div className="grid grid-cols-2 gap-3">
        {allGoals.map((goal) => (
          <motion.button
            key={goal}
            className={`p-3 text-sm rounded-xl border ${
              isGoalSelected(goal)
                ? "bg-blue-600 text-white border-blue-600"
                : goal === "Своя цель" && isCustomGoalActive
                ? "bg-yellow-500 text-white border-yellow-500 hover:bg-yellow-600"
                : customGoals.includes(goal)
                ? "bg-green-500 text-white border-green-500 hover:bg-green-600"
                : goal === "Своя цель"
                ? "bg-yellow-300 text-blue-900 border-gray-300 hover:bg-yellow-400"
                : "bg-white text-blue-900 border-gray-300 hover:border-blue-600"
            } transition-all shadow-sm`}
            onClick={() => handleSelect(goal)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {goal}
          </motion.button>
        ))}
      </div>

      {isCustomGoalActive && (
        <div className="mt-4">
          <input
            type="text"
            value={customGoal}
            onChange={(e) => setCustomGoal(e.target.value.slice(0, 50))}
            className="w-full p-3 rounded-xl border border-gray-300 focus:border-blue-600 focus:outline-none bg-white text-blue-900"
            placeholder="Введите вашу цель"
          />
          <motion.button
            onClick={handleCustomGoalSubmit}
            className="mt-2 bg-blue-600 text-white p-3 rounded-xl w-full font-medium shadow-sm"
            disabled={!customGoal.trim()}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Подтвердить
          </motion.button>
        </div>
      )}

      <div className="mb-6 mt-3">
        <h2 className="text-lg font-semibold text-blue-900 mb-1">
          Диетические предпочтения:
        </h2>
        <select
          className="w-full p-3 rounded-xl border border-gray-300 focus:border-blue-600 focus:outline-none bg-white text-blue-900"
          value={dietPreference}
          onChange={(e) => setDietPreference(e.target.value)}
        >
          <option value="none">Без ограничений</option>
          <option value="vegetarian">Вегетарианец</option>
          <option value="vegan">Веган</option>
        </select>
      </div>
    </div>
  );
};
