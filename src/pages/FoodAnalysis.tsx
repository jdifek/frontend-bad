import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoCamera, IoPencil, IoAdd } from "react-icons/io5";
import { FaCalendarAlt } from "react-icons/fa";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { FoodAnalysisResult } from "../components/FoodAnalysisResult";
import $api from "../api/http";
import { Slide, toast } from "react-toastify";
import { useAuth } from "../helpers/context/AuthContext";

type Analysis = {
  dish: string;
  calories: number;
  nutrients: { protein: number; fats: number; carbs: number };
  suggestions: string;
  questions: string[];
  warnings: string;
};

interface Meal {
  id: number;
  dish: string;
  calories: number;
  type: string;
  date: string;
}

interface Meals {
  Breakfast: Meal[];
  Lunch: Meal[];
  Snack: Meal[];
  Dinner: Meal[];
}

export const FoodAnalysis = () => {
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [photo, setPhoto] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedMealType, setSelectedMealType] = useState<keyof Meals | null>(
    null
  );
  const [showManualInput, setShowManualInput] = useState<boolean>(false);
  const [manualInput, setManualInput] = useState({
    dish: "",
    grams: "",
    suggestions: "",
  });
  const { user, isLoading: authLoading } = useAuth();

  const [calorieGoal, setCalorieGoal] = useState<number>(user?.goal || 0);
  const [meals, setMeals] = useState<Meals>({
    Breakfast: [],
    Lunch: [],
    Snack: [],
    Dinner: [],
  });
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Форматирование даты в YYYY-MM-DD
  const getDateString = (date: Date) => {
    const offsetDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    );
    return offsetDate.toISOString().split("T")[0];
  };

  // Загружаем начальные данные (цель калорий и еду) через API
  useEffect(() => {
    const fetchInitialData = async () => {
      if (authLoading || !user?.telegramId) return;

      try {
        // Загружаем цель калорий
        const userResponse = await $api.get("/api/auth/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        console.log("User response from /api/auth/me:", userResponse.data);
        if (userResponse.data.user.goal) {
          setCalorieGoal(userResponse.data.user.goal);
        }

        // Загружаем еду
        interface ApiMeal {
          id: number;
          dish: string;
          calories: number;
          type?: string;
          date: string;
        }

        const mealsResponse = await $api.get(
          `/api/meals/user/${user.telegramId}/meals`
        );
        const initialMeals: Meals = {
          Breakfast: [],
          Lunch: [],
          Snack: [],
          Dinner: [],
        };
        mealsResponse.data.meals.forEach((meal: ApiMeal) => {
          const mealType = (meal.type || "Breakfast") as keyof Meals;
          initialMeals[mealType].push({
            id: meal.id,
            dish: meal.dish,
            calories: meal.calories,
            type: mealType,
            date: meal.date,
          });
        });
        setMeals(initialMeals);
      } catch (error) {
        console.error("Error fetching initial data:", error);
        setError("Не удалось загрузить данные.");
      }
    };

    fetchInitialData();
  }, [authLoading, user]);

  // Обновляем цель калорий через API
  const updateCalorieGoal = async (newGoal: number) => {
    if (authLoading || !user?.telegramId) {
      setError("Пользователь не авторизован.");
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setError("Токен авторизации отсутствует.");
        return;
      }

      console.log(
        "Updating calorie goal to:",
        newGoal,
        "for user:",
        user.telegramId
      );

      const response = await $api.put(
        `/api/meals/user/${user.telegramId}`,
        { goal: newGoal }, // Убедимся, что данные отправляются в правильном формате
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("API response:", response.data);
      setCalorieGoal(newGoal);
      toast.success("Цель калорий обновлена!", {
        position: "bottom-center",
        theme: "light",
        transition: Slide,
      });
    } catch (error: any) {
      console.error(
        "Error updating calorie goal:",
        error.response?.data || error.message
      );
      setError(
        `Не удалось обновить цель калорий: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhoto(file);
      setError(null);
    }
  };

  const handleAnalyze = async () => {
    if (authLoading || !user?.telegramId) {
      setError("Пользователь не авторизован.");
      return;
    }
    if (!photo) {
      setError("Пожалуйста, загрузите фото еды.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append("telegramId", user.telegramId);
      formData.append("photo", photo);

      const res = await $api.post("/api/food-analysis/photo", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const newAnalysis = res.data.foodAnalysis;
      setAnalysis(newAnalysis);
      if (
        selectedMealType &&
        (["Breakfast", "Lunch", "Snack", "Dinner"] as const).includes(
          selectedMealType
        )
      ) {
        await addMeal(selectedMealType, newAnalysis);
      }
      setShowModal(false);
      setPhoto(null);
      toast.success("Анализ еды завершён!", {
        position: "bottom-center",
        autoClose: 5000,
        theme: "light",
        transition: Slide,
      });
    } catch (error) {
      console.error("Error analyzing food:", error);
      setError(
        "Не удалось проанализировать еду. Попробуйте ввести данные вручную."
      );
      setShowManualInput(true);
    } finally {
      setLoading(false);
    }
  };

  const handleManualInputSubmit = async () => {
    if (authLoading || !user?.telegramId) {
      setError("Пользователь не авторизован.");
      return;
    }
    if (!manualInput.dish || !manualInput.grams) {
      setError("Заполните название блюда и вес.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await $api.post("/api/food-analysis/manual", {
        telegramId: user.telegramId,
        dish: manualInput.dish,
        grams: parseFloat(manualInput.grams),
        suggestions:
          manualInput.suggestions || "Нет дополнительных рекомендаций.",
      });

      const newAnalysis = res.data.foodAnalysis;
      setAnalysis(newAnalysis);
      if (
        selectedMealType &&
        (["Breakfast", "Lunch", "Snack", "Dinner"] as const).includes(
          selectedMealType
        )
      ) {
        await addMeal(selectedMealType, newAnalysis);
      }
      setShowModal(false);
      setShowManualInput(false);
      setManualInput({
        dish: "",
        grams: "",
        suggestions: "",
      });
      toast.success("Ручной ввод сохранён!", {
        position: "bottom-center",
        autoClose: 5000,
        theme: "light",
        transition: Slide,
      });
    } catch (error) {
      console.error("Error saving manual input:", error);
      setError("Не удалось сохранить ручной ввод. Попробуйте снова.");
    } finally {
      setLoading(false);
    }
  };

  const addMeal = async (mealType: keyof Meals, analysis: Analysis) => {
    if (!user?.telegramId) return;

    try {
      const mealDate = new Date().toISOString();

      setMeals((prev) => ({
        ...prev,
        [mealType]: [
          ...prev[mealType],
          {
            id: Date.now(),
            dish: analysis.dish,
            calories: analysis.calories,
            type: mealType,
            date: mealDate,
          },
        ],
      }));
    } catch (error) {
      console.error("Error adding meal:", error);
      setError("Не удалось добавить еду.");
    }
  };

  const totalConsumed = Object.values(meals).reduce(
    (sum, mealsArray) =>
      sum +
      mealsArray
        .filter((meal: Meal) => {
          const mealDate = meal.date.split("T")[0];
          const selectedDateString = getDateString(selectedDate);
          return mealDate === selectedDateString;
        })
        .reduce((acc: number, meal: Meal) => acc + meal.calories, 0),
    0
  );
  const remaining = calorieGoal - totalConsumed;
  // Функция для получения приёмов пищи за конкретную дату
  const getMealsForDate = (date: Date) => {
    const dateString = getDateString(date);
    const mealsForDate: Meal[] = [];
    (Object.keys(meals) as (keyof Meals)[]).forEach((mealType) => {
      meals[mealType].forEach((meal) => {
        const mealDate = meal.date.split("T")[0];
        if (mealDate === dateString) {
          mealsForDate.push(meal);
        }
      });
    });
    return mealsForDate;
  };

  if (authLoading) {
    return <div className="p-4 text-center text-blue-900">Загрузка...</div>;
  }

  return (
    <div className="p-4 py-40 pt-35 max-w-md mx-auto">
      <motion.h1
        className="text-2xl font-bold mb-6 text-gray-700"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Анализ питания
      </motion.h1>
      {/* Календарь */}
      <motion.div
        className="bg-white p-4 rounded-xl shadow-sm mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex mx-auto items-center justify-center mb-2">
          <button
            onClick={() => setShowCalendar(!showCalendar)}
            className="text-blue-600 hover:text-blue-800 transition-colors"
            title={showCalendar ? "Скрыть календарь" : "Показать календарь"}
          >
            <FaCalendarAlt size={20} />
          </button>
        </div>
        <AnimatePresence>
          {showCalendar && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="overflow-hidden"
            >
              <div className="flex items-center justify-center mb-4 bg-gray-100 p-2 rounded-lg">
                <button
                  onClick={() =>
                    setSelectedDate(
                      (prev) => new Date(prev.setDate(prev.getDate() - 1))
                    )
                  }
                  className="text-blue-600 hover:text-blue-800 p-1 transition-colors"
                >
                  ←
                </button>
                <span className="mx-4 text-lg font-semibold text-gray-800 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  {selectedDate.toLocaleDateString("ru-RU", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  }) ===
                  new Date().toLocaleDateString("ru-RU", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })
                    ? "Сегодня"
                    : selectedDate.toLocaleDateString("ru-RU", {
                        day: "numeric",
                        month: "long",
                      })}
                </span>
                <button
                  onClick={() =>
                    setSelectedDate(
                      (prev) => new Date(prev.setDate(prev.getDate() + 1))
                    )
                  }
                  className="text-blue-600 hover:text-blue-800 p-1 transition-colors"
                >
                  →
                </button>
              </div>
              <Calendar
                onChange={(value) => {
                  if (value instanceof Date) {
                    setSelectedDate(value);
                  } else if (
                    Array.isArray(value) &&
                    value.length > 0 &&
                    value[0] instanceof Date
                  ) {
                    setSelectedDate(value[0]); // Для диапазона берём первую дату
                  }
                }}
                value={selectedDate}
                className="w-full mb-4 mx-auto rounded-lg border border-blue-200"
                tileClassName={({ date }) => {
                  const mealsForDate = getMealsForDate(date);
                  const isToday =
                    date.toDateString() === new Date().toDateString();
                  return [
                    mealsForDate.length > 0 && "bg-green-100",
                    isToday && "bg-blue-100 text-blue-900 font-semibold",
                  ]
                    .filter(Boolean)
                    .join(" ");
                }}
                prev2Label={null}
                next2Label={null}
                prevLabel={<span className="hidden">Пред</span>}
                nextLabel={<span className="hidden">След</span>}
              />
              <div>
                <h3 className="text-sm font-medium text-blue-900 mb-2">
                  Приёмы пищи за{" "}
                  {selectedDate.toLocaleDateString("ru-RU", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                  :
                </h3>
                {getMealsForDate(selectedDate).length > 0 ? (
                  <ul className="text-blue-700">
                    {getMealsForDate(selectedDate).map((meal, index) => (
                      <li key={index} className="py-1 flex justify-between">
                        <span>
                          {meal.type || "Без типа"}: {meal.dish}
                        </span>
                        <span>{meal.calories} ккал</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-blue-700">
                    Нет данных за этот день.
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      {error && (
        <motion.div
          className="bg-red-100 text-red-700 p-3 rounded-lg mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {error}
        </motion.div>
      )}

      {/* Calorie Progress Section */}
      <motion.div
        className="bg-white rounded-xl p-4 mb-6 shadow-sm border border-gray-300"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold text-gray-800">
            Прогресс калорий
          </h2>
        </div>
        <div className="flex justify-between items-center text-lg font-bold text-gray-800">
          <input
            type="number"
            value={calorieGoal}
            onChange={(e) => setCalorieGoal(parseInt(e.target.value) || 0)}
            onBlur={(e) => updateCalorieGoal(parseInt(e.target.value) || 0)}
            className="w-20 p-1 border rounded-lg text-right"
          />
          <span className="text-gray-500">-</span>
          <span>{totalConsumed}</span>
          <span className="text-gray-500">=</span>
          <span className={remaining >= 0 ? "text-orange-600" : "text-red-600"}>
            {remaining}
          </span>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>Цель</span>
          <span>Потреблено</span>
          <span>Осталось</span>
        </div>
      </motion.div>

      {/* Meal Sections */}
      {(["Breakfast", "Lunch", "Snack", "Dinner"] as const).map((mealType) => {
        // Filter meals for the selected date
        const mealsForSelectedDate = meals[mealType].filter((meal) => {
          const mealDate = meal.date.split("T")[0];
          const selectedDateString = getDateString(selectedDate);
          return mealDate === selectedDateString;
        });

        // Calculate total calories for the filtered meals
        const totalCalories = mealsForSelectedDate.reduce(
          (sum, meal) => sum + meal.calories,
          0
        );

        return (
          <motion.div
            key={mealType}
            className="bg-white rounded-xl p-4 mb-6 shadow-sm border border-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-blue-900">
                {mealType} ({totalCalories} calories)
              </h2>
              <motion.button
                onClick={() => {
                  setSelectedMealType(mealType);
                  setShowModal(true);
                }}
                className="text-blue-600 text-sm flex items-center"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <IoAdd size={16} className="mr-1" /> Add Meal
              </motion.button>
            </div>
            {mealsForSelectedDate.length > 0 ? (
              mealsForSelectedDate.map((meal) => (
                <div
                  key={meal.id}
                  className="flex justify-between items-center mt-2"
                >
                  <span>{meal.dish}</span>
                  <span>{meal.calories} calories</span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm mt-2">Nothing logged yet.</p>
            )}
          </motion.div>
        );
      })}

      {/* Modal for Analysis Type Selection */}
      {showModal && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="bg-white p-6 rounded-xl max-w-md w-full">
            <h2 className="text-lg font-medium text-blue-900 mb-4">
              Добавить еду
            </h2>
            <motion.button
              onClick={() => setShowManualInput(true)}
              className="bg-blue-200 text-gray-700 p-3 rounded-lg w-full mb-4 font-medium flex items-center justify-center"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <IoPencil size={20} className="mr-2" /> Ввести данные вручную
            </motion.button>
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-blue-900 mb-3">
                Загрузите фото еды:
              </h2>
              <label className="block">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                <motion.div
                  className="p-4 bg-green-50 rounded-xl border border-dashed border-green-600 text-center cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <IoCamera size={24} className="mx-auto mb-2 text-green-600" />
                  <p className="text-green-900 text-sm">
                    {photo ? photo.name : "Нажмите, чтобы загрузить фото еды"}
                  </p>
                </motion.div>
              </label>
              {photo && (
                <motion.button
                  onClick={() => setPhoto(null)}
                  className="mt-2 text-green-600 text-sm"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  Удалить фото
                </motion.button>
              )}
            </div>
            <motion.button
              onClick={handleAnalyze}
              className="bg-green-200 text-gray-700 p-3 rounded-lg w-full mb-4 font-medium"
              disabled={!photo || loading}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {loading ? "Анализ..." : "Проанализировать"}
            </motion.button>
            <motion.button
              onClick={() => {
                setShowModal(false);
                setPhoto(null);
                setShowManualInput(false);
              }}
              className="bg-gray-200 text-blue-900 p-3 rounded-lg w-full"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Отмена
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Manual Input Form */}
      {showManualInput && showModal && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-300">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">
              Ручной ввод
            </h3>
            <input
              type="text"
              placeholder="Название блюда"
              value={manualInput.dish}
              onChange={(e) =>
                setManualInput({ ...manualInput, dish: e.target.value })
              }
              className="w-full p-2 mb-2 border rounded-lg"
            />
            <input
              type="number"
              placeholder="Вес (г)"
              value={manualInput.grams}
              onChange={(e) =>
                setManualInput({ ...manualInput, grams: e.target.value })
              }
              className="w-full p-2 mb-2 border rounded-lg"
            />
            <div className="flex gap-2">
              <motion.button
                onClick={handleManualInputSubmit}
                className="bg-green-200 text-gray-700 p-2 rounded-lg flex-1"
                disabled={loading} // Disable button when loading
                whileHover={{ scale: loading ? 1 : 1.03 }} // Prevent hover animation when disabled
                whileTap={{ scale: loading ? 1 : 0.97 }} // Prevent tap animation when disabled
              >
                {loading ? "Анализ..." : "Сохранить"}{" "}
                {/* Change text based on loading state */}
              </motion.button>
              <motion.button
                onClick={() => {
                  setShowManualInput(false);
                  setShowModal(true);
                }}
                className="bg-red-200 text-gray-700 p-2 rounded-lg flex-1"
                disabled={loading} // Optionally disable Cancel button during loading
                whileHover={{ scale: loading ? 1 : 1.03 }}
                whileTap={{ scale: loading ? 1 : 0.97 }}
              >
                Отмена
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}

      {analysis && <FoodAnalysisResult analysis={analysis} />}
    </div>
  );
};
