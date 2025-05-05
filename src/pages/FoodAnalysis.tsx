import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { IoCamera, IoPencil, IoAdd } from 'react-icons/io5';
import { FoodAnalysisResult } from '../components/FoodAnalysisResult';
import $api from '../api/http';
import { Slide, toast } from 'react-toastify';
import { useAuth } from '../helpers/context/AuthContext';

type Analysis = {
  dish: string;
  calories: number;
  nutrients: { protein: number; fats: number; carbs: number };
  suggestions: string;
  questions: string[];
  warnings: string;
};

type Meal = {
  id: number;
  dish: string;
  calories: number;
};

export const FoodAnalysis = () => {
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [photo, setPhoto] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [showManualInput, setShowManualInput] = useState<boolean>(false);
  const [manualInput, setManualInput] = useState({
    dish: '',
    grams: '',
    suggestions: '',
  });
  const [calorieGoal, setCalorieGoal] = useState(2212); // Default goal from photo
  const [caloriesBurned, setCaloriesBurned] = useState(0); // Default from photo
  const [meals, setMeals] = useState<{ [key: string]: Meal[] }>({
    Breakfast: [],
    Lunch: [],
    Snack: [],
    Dinner: [],
  });
  const { user, isLoading: authLoading } = useAuth();

  // Load initial data (e.g., from backend or local state)
  useEffect(() => {
    // Simulate fetching initial data (replace with actual API call)
    const initialMeals = {
      Breakfast: [],
      Lunch: [],
      Snack: [],
      Dinner: [],
    };
    setMeals(initialMeals);
  }, []);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhoto(file);
      setError(null);
    }
  };

  const handleAnalyze = async () => {
    if (authLoading || !user?.telegramId) {
      setError('Пользователь не авторизован.');
      return;
    }
    if (!photo) {
      setError('Пожалуйста, загрузите фото еды.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append('telegramId', user.telegramId);
      formData.append('photo', photo);

      const res = await $api.post('/api/food-analysis/photo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setAnalysis(res.data.foodAnalysis);
      addMeal('Breakfast', res.data.foodAnalysis);
      toast.success('Анализ еды завершён!', {
        position: 'bottom-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'light',
        transition: Slide,
      });
    } catch (error) {
      console.error('Error analyzing food:', error);
      setError('Не удалось проанализировать еды. Попробуйте ввести данные вручную.');
      setShowManualInput(true);
    } finally {
      setLoading(false);
    }
  };

  const handleManualInputSubmit = async () => {
    if (authLoading || !user?.telegramId) {
      setError('Пользователь не авторизован.');
      return;
    }
    if (!manualInput.dish || !manualInput.grams) {
      setError('Заполните название блюда и вес.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await $api.post('/api/food-analysis/manual', {
        telegramId: user.telegramId,
        dish: manualInput.dish,
        grams: parseFloat(manualInput.grams),
        suggestions: manualInput.suggestions || 'Нет дополнительных рекомендаций.',
      });

      setAnalysis(res.data.foodAnalysis);
      addMeal('Breakfast', res.data.foodAnalysis); // Default to Breakfast
      setShowManualInput(false);
      setManualInput({
        dish: '',
        grams: '',
        suggestions: '',
      });
      toast.success('Ручной ввод сохранён!', {
        position: 'bottom-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'light',
        transition: Slide,
      });
    } catch (error) {
      console.error('Error saving manual input:', error);
      setError('Не удалось сохранить ручной ввод. Попробуйте снова.');
    } finally {
      setLoading(false);
    }
  };

  const addMeal = (mealType: string, analysis: Analysis) => {
    setMeals((prev) => ({
      ...prev,
      [mealType]: [
        ...prev[mealType],
        { id: Date.now(), dish: analysis.dish, calories: analysis.calories },
      ],
    }));
  };

  const totalConsumed = Object.values(meals).reduce(
    (sum, mealsArray) => sum + mealsArray.reduce((acc, meal) => acc + meal.calories, 0),
    0
  );
  const remaining = calorieGoal + caloriesBurned - totalConsumed;

  if (authLoading) {
    return <div className='p-4 text-center text-blue-900'>Загрузка...</div>;
  }

  return (
    <div className='p-4 py-40 max-w-md mx-auto'>
      <motion.h1
        className='text-2xl font-bold mb-6 text-gray-700'
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Анализ питания
      </motion.h1>
      {error && (
        <motion.div
          className='bg-red-100 text-red-700 p-3 rounded-lg mb-4'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {error}
        </motion.div>
      )}

      {/* Calorie Progress Section */}
      <motion.div
        className='bg-white rounded-xl p-4 mb-6 shadow-sm border border-gray-300'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h2 className='text-lg font-semibold text-blue-900 mb-3'>Calorie Progress</h2>
        <div className='flex justify-between text-sm text-gray-700'>
          <span>Goal</span>
          <span>{calorieGoal}</span>
        </div>
        <div className='flex justify-between text-sm text-gray-700'>
          <span>Burned</span>
          <span>{caloriesBurned}</span>
        </div>
        <div className='flex justify-between text-sm text-gray-700'>
          <span>Consumed</span>
          <span>{totalConsumed}</span>
        </div>
        <div className='flex justify-between text-sm font-bold text-green-600 mt-2'>
          <span>Remaining</span>
          <span>{remaining}</span>
        </div>
        <div className='text-center text-xs text-gray-500 mt-2'>
          {calorieGoal} + {caloriesBurned} - {totalConsumed} = {remaining}
        </div>
      </motion.div>

      {/* Meal Sections */}
      {['Breakfast', 'Lunch', 'Snack', 'Dinner'].map((mealType) => (
        <motion.div
          key={mealType}
          className='bg-white rounded-xl p-4 mb-6 shadow-sm border border-gray-300'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className='flex justify-between items-center'>
            <h2 className='text-lg font-semibold text-blue-900'>
              {mealType} ({meals[mealType].reduce((sum, meal) => sum + meal.calories, 0)} calories)
            </h2>
            <motion.button
              onClick={() => analysis && addMeal(mealType, analysis)}
              className='text-blue-600 text-sm flex items-center'
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              disabled={!analysis}
            >
              <IoAdd size={16} className='mr-1' /> Add Meal
            </motion.button>
          </div>
          {meals[mealType].length > 0 ? (
            meals[mealType].map((meal) => (
              <div key={meal.id} className='flex justify-between items-center mt-2'>
                <span>{meal.dish}</span>
                <span>{meal.calories} calories</span>
              </div>
            ))
          ) : (
            <p className='text-gray-500 text-sm mt-2'>Nothing logged yet.</p>
          )}
        </motion.div>
      ))}

      {/* Photo Upload and Analyze */}
      <div className='mb-6'>
        <h2 className='text-lg font-semibold text-blue-900 mb-3'>Загрузите фото еды:</h2>
        <label className='block'>
          <input
            type='file'
            accept='image/*'
            onChange={handlePhotoUpload}
            className='hidden'
          />
          <motion.div
            className='p-4 bg-green-50 rounded-xl border border-dashed border-green-600 text-center cursor-pointer'
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <IoCamera size={24} className='mx-auto mb-2 text-green-600' />
            <p className='text-green-900 text-sm'>
              {photo ? photo.name : 'Нажмите, чтобы загрузить фото еды'}
            </p>
          </motion.div>
        </label>
        {photo && (
          <motion.button
            onClick={() => setPhoto(null)}
            className='mt-2 text-green-600 text-sm'
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            Удалить фото
          </motion.button>
        )}
      </div>
      <motion.button
        onClick={handleAnalyze}
        className='bg-green-200 text-gray-700 p-3 rounded-lg w-full mb-4 font-medium shadow-md border border-white'
        disabled={!photo || loading}
        whileHover={{ scale: 1.03, boxShadow: '0 8px 16px rgba(0,0,0,0.08)' }}
        whileTap={{ scale: 0.97 }}
      >
        {loading ? 'Анализ...' : 'Проанализировать'}
      </motion.button>
      <motion.button
        onClick={() => setShowManualInput(true)}
        className='bg-blue-200 text-gray-700 p-3 rounded-lg w-full mb-6 font-medium shadow-md border border-white flex items-center justify-center'
        whileHover={{ scale: 1.03, boxShadow: '0 8px 16px rgba(0,0,0,0.08)' }}
        whileTap={{ scale: 0.97 }}
      >
        <IoPencil size={20} className='mr-2' /> Ввести данные вручную
      </motion.button>

      {showManualInput && (
        <motion.div
          className='bg-white rounded-xl p-4 shadow-sm border border-gray-300 mb-6'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className='text-lg font-semibold text-blue-900 mb-3'>Ручной ввод</h3>
          <input
            type='text'
            placeholder='Название блюда'
            value={manualInput.dish}
            onChange={(e) => setManualInput({ ...manualInput, dish: e.target.value })}
            className='w-full p-2 mb-2 border rounded-lg'
          />
          <input
            type='number'
            placeholder='Вес (г)'
            value={manualInput.grams}
            onChange={(e) => setManualInput({ ...manualInput, grams: e.target.value })}
            className='w-full p-2 mb-2 border rounded-lg'
          />
          <div className='flex gap-2'>
            <motion.button
              onClick={handleManualInputSubmit}
              className='bg-green-200 text-gray-700 p-2 rounded-lg flex-1'
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Сохранить
            </motion.button>
            <motion.button
              onClick={() => setShowManualInput(false)}
              className='bg-red-200 text-gray-700 p-2 rounded-lg flex-1'
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Отмена
            </motion.button>
          </div>
        </motion.div>
      )}
      {analysis && <FoodAnalysisResult analysis={analysis} />}
    </div>
  );
};