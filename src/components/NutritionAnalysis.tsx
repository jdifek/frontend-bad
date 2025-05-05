import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../helpers/context/AuthContext';
import $api from '../api/http';
import { Slide, toast } from 'react-toastify';
import { IoAddCircleOutline, IoTrashOutline, IoHelpCircleOutline } from 'react-icons/io5';

type FoodEntry = {
  dish: string;
  calories: number;
  nutrients: {
    protein: number;
    fats: number;
    carbs: number;
  };
  suggestions: string;
  warnings: string;
  questions: string[];
};

type Meal = {
  name: string;
  entries: FoodEntry[];
};

export const NutritionAnalysis = () => {
  const [calorieLimit, setCalorieLimit] = useState<number>(2000); // По умолчанию 2000 ккал
  const [caloriesBurned, setCaloriesBurned] = useState<number>(0); // Потраченные калории
  const [meals, setMeals] = useState<Meal[]>([
    { name: 'Завтрак', entries: [] },
    { name: 'Обед', entries: [] },
    { name: 'Перекус', entries: [] },
    { name: 'Ужин', entries: [] },
  ]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { user, isLoading: authLoading } = useAuth();

  const totalConsumedCalories = meals.reduce(
    (total, meal) =>
      total + meal.entries.reduce((sum, entry) => sum + entry.calories, 0),
    0
  );

  const remainingCalories =
    calorieLimit + caloriesBurned - totalConsumedCalories;

  const handleAddFood = async (
    mealName: string,
    file?: File,
    dish?: string,
    grams?: number
  ) => {
    if (authLoading || !user?.telegramId) {
      setError('Пользователь не авторизован');
      return;
    }

    if (!file && (!dish || !grams)) {
      setError('Укажите блюдо и вес или загрузите фото.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      let foodData: FoodEntry;
      if (file) {
        const formData = new FormData();
        formData.append('telegramId', user.telegramId);
        formData.append('photo', file);
        const response = await $api.post('/api/food/photo', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        foodData = response.data.foodAnalysis;
      } else {
        const response = await $api.post('/api/food/manual', {
          telegramId: user.telegramId,
          dish,
          grams,
        });
        foodData = response.data.foodAnalysis;
      }

      setMeals((prev) =>
        prev.map((meal) =>
          meal.name === mealName
            ? { ...meal, entries: [...meal.entries, foodData] }
            : meal
        )
      );

      toast.success('Блюдо добавлено!', {
        position: 'bottom-center',
        theme: 'light',
        transition: Slide,
      });
    } catch (err) {
      console.error('Error analyzing food:', err);
      setError('Не удалось проанализировать блюдо. Попробуйте снова.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFood = (mealName: string, index: number) => {
    setMeals((prev) =>
      prev.map((meal) =>
        meal.name === mealName
          ? {
              ...meal,
              entries: meal.entries.filter((_, i) => i !== index),
            }
          : meal
      )
    );
    toast.success('Блюдо удалено!', {
      position: 'bottom-center',
      theme: 'light',
      transition: Slide,
    });
  };

  if (authLoading) {
    return <div className="p-4 text-center text-blue-900">Загрузка...</div>;
  }

  if (!user) {
    return (
      <div className="p-4 text-center text-red-700">Ошибка авторизации.</div>
    );
  }

  return (
    <div className="p-4 py-40 max-w-md mx-auto bg-blue-50">
      <motion.h1
        className="text-2xl font-bold mb-6 text-blue-900"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Анализ питания
      </motion.h1>

      {error && (
        <motion.div
          className="bg-red-100 text-red-700 p-3 rounded-lg mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {error}
        </motion.div>
      )}

      {/* Уравнение калорий */}
      <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
        <div className="flex flex-col space-y-2 mb-4">
          <div className="flex items-center justify-between">
            <label className="text-sm text-blue-700">Лимит калорий:</label>
            <input
              type="number"
              value={calorieLimit}
              onChange={(e) => setCalorieLimit(Number(e.target.value))}
              className="w-24 p-2 rounded-lg border border-gray-300 focus:border-blue-600 focus:outline-none bg-white text-blue-900"
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm text-blue-700">Потраченные калории:</label>
            <input
              type="number"
              value={caloriesBurned}
              onChange={(e) => setCaloriesBurned(Number(e.target.value))}
              className="w-24 p-2 rounded-lg border border-gray-300 focus:border-blue-600 focus:outline-none bg-white text-blue-900"
            />
          </div>
        </div>
        <p className="text-blue-900 font-medium">
          {calorieLimit} + {caloriesBurned} - {totalConsumedCalories} ={' '}
          <span
            className={
              remainingCalories < 0 ? 'text-red-600' : 'text-green-600'
            }
          >
            {remainingCalories}
          </span>{' '}
          ккал осталось
        </p>
      </div>

      {/* Разделы для приемов пищи */}
      {meals.map((meal) => (
        <div key={meal.name} className="mb-6">
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-blue-900">
                {meal.name}
              </h2>
              <motion.button
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = 'image/*';
                  input.onchange = (e: any) =>
                    handleAddFood(meal.name, e.target.files[0]);
                  input.click();
                }}
                className="text-blue-600"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <IoAddCircleOutline size={24} />
              </motion.button>
            </div>

            {/* Форма для ручного ввода */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Введите блюдо (например, Омлет)"
                id={`dish-${meal.name}`}
                className="w-full p-3 rounded-xl border border-gray-300 focus:border-blue-600 focus:outline-none bg-white text-blue-900 mb-2"
              />
              <input
                type="number"
                placeholder="Вес (г)"
                id={`grams-${meal.name}`}
                className="w-full p-3 rounded-xl border border-gray-300 focus:border-blue-600 focus:outline-none bg-white text-blue-900 mb-2"
              />
              <motion.button
                onClick={() => {
                  const dish = (
                    document.getElementById(`dish-${meal.name}`) as HTMLInputElement
                  ).value;
                  const grams = Number(
                    (document.getElementById(`grams-${meal.name}`) as HTMLInputElement)
                      .value
                  );
                  handleAddFood(meal.name, undefined, dish, grams);
                }}
                className="bg-blue-600 text-white p-3 rounded-xl w-full font-medium shadow-sm"
                disabled={loading}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                {loading ? 'Анализ...' : 'Добавить'}
              </motion.button>
            </div>

            {/* Список блюд */}
            {meal.entries.length > 0 ? (
              <ul className="text-blue-700 text-sm">
                {meal.entries.map((entry, index) => (
                  <li key={index} className="py-2 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{entry.dish}</p>
                        <p>
                          {entry.calories} ккал | Б: {entry.nutrients.protein}г, Ж:{' '}
                          {entry.nutrients.fats}г, У: {entry.nutrients.carbs}г
                        </p>
                        {entry.suggestions && (
                          <p className="text-gray-600 italic">
                            Рекомендация: {entry.suggestions}
                          </p>
                        )}
                        {entry.warnings && (
                          <p className="text-red-600 italic">
                            Предупреждение: {entry.warnings}
                          </p>
                        )}
                        {entry.questions.length > 0 && (
                          <div className="mt-1 flex items-center text-blue-600">
                            <IoHelpCircleOutline size={16} className="mr-1" />
                            <span className="text-xs">
                              Вопросы: {entry.questions.join(', ')}
                            </span>
                          </div>
                        )}
                      </div>
                      <motion.button
                        onClick={() => handleRemoveFood(meal.name, index)}
                        className="text-red-600"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <IoTrashOutline size={20} />
                      </motion.button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600 italic text-sm">Нет добавленных блюд</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};