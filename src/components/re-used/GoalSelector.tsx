import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../helpers/context/AuthContext";
import $api from "../../api/http";

const goals = [
  "Повысить концентрацию",
  "Энергия / бодрость",
  "Улучшить сон",
  "Поддержка иммунитета",
  "Снижение веса",
  "Набор массы",
  "Улучшить память",
  "Повысить тестостерон",
  "Своя цель",
];

type GoalSelectorProps = {
  onSelect: (goals: string[]) => void;
  dietPreference: string;
  setDietPreference: React.Dispatch<React.SetStateAction<string>>;
};

export const GoalSelector = ({ dietPreference, onSelect, setDietPreference }: GoalSelectorProps) => {
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [customGoal, setCustomGoal] = useState<string>("");
  const { user, isLoading: authLoading } = useAuth();

  const trackAnalytics = async (goals: string[]) => {
    if (authLoading || !user?.telegramId) {
      console.warn('Cannot track analytics: user not authenticated');
      return;
    }

    try {
      await $api.post('/api/courses/analytics/goals', {
        telegramId: user.telegramId,
        goals,
      });
      console.log('Goal analytics tracked:', goals);
    } catch (error) {
      console.error('Error tracking goal analytics:', error);
    }
  };

  const handleSelect = (goal: string) => {
    let updatedGoals: string[];
    if (goal === "Своя цель") {
      updatedGoals = [goal];
      setCustomGoal("");
    } else {
      const isSelected = selectedGoals.includes(goal);
      if (isSelected) {
        updatedGoals = selectedGoals.filter((g) => g !== goal);
      } else if (selectedGoals.length < 2) {
        updatedGoals = [...selectedGoals, goal];
      } else {
        updatedGoals = selectedGoals;
      }
    }
    setSelectedGoals(updatedGoals);
    if (updatedGoals.length > 0 && updatedGoals[0] !== "Своя цель") {
      onSelect(updatedGoals);
      trackAnalytics(updatedGoals);
    }
  };

  const handleCustomGoalSubmit = () => {
    if (customGoal.trim()) {
      const updatedGoals = [customGoal];
      setSelectedGoals(updatedGoals);
      onSelect(updatedGoals);
      trackAnalytics(updatedGoals);
    }
  };

  const isGoalSelected = (goal: string) => selectedGoals.includes(goal);

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-blue-900 mb-3">
        Выберите до двух целей:
      </h2>

      <div className="grid grid-cols-2 gap-3">
        {goals.map((goal) => (
          <motion.button
            key={goal}
            className={`p-3 text-sm rounded-xl border ${
              isGoalSelected(goal)
                ? "bg-blue-600 text-white border-blue-600"
                : goal === "Своя цель"
                ? "bg-yellow-500 text-white border-yellow-500 hover:bg-yellow-600"
                : "bg-white text-blue-900 border-gray-300 hover:border-blue-600"
            } transition-all shadow-sm`}
            onClick={() => handleSelect(goal)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            {goal}
          </motion.button>
        ))}
      </div>
      {selectedGoals.includes("Своя цель") && (
        <div className="mt-4">
          <input
            type="text"
            value={customGoal}
            onChange={(e) => setCustomGoal(e.target.value)}
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