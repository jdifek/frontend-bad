import { useState } from 'react';
import { motion } from 'framer-motion';
import { GoalSelector } from '../components/re-used/GoalSelector';
import { SupplementInput } from '../components/re-used/SupplementInput';
import { CourseTable } from '../components/re-used/CourseTable';

type Supplement = {
  name: string;
  dose?: string;
};

type Course = {
  goal: string;
  supplements: Supplement[];
  schedule: {
    morning: string[];
    afternoon: string[];
    evening: string[];
  };
  duration: number;
  suggestions: string;
};

export const QuickCourse = () => {
  const [goal, setGoal] = useState<string>('');
  const [supplements, setSupplements] = useState<Supplement[]>([]);
  const [course, setCourse] = useState<Course | null>(null);

  const handleAddSupplement = (supplement: Supplement) => {
    setSupplements([...supplements, supplement]);
  };

  const handleRemoveSupplement = (supplementName: string) => {
    setSupplements(supplements.filter(s => s.name !== supplementName));
  };

  const generateScheduleAndSuggestions = (goal: string, supplements: Supplement[]): Course => {
    const schedule: {
      morning: string[];
      afternoon: string[];
      evening: string[];
    } = {
      morning: [],
      afternoon: [],
      evening: [],
    };
  
    supplements.forEach(supp => {
      const name = supp.name.toLowerCase();
      if (name.includes('витамин d') || name.includes('омега-3')) {
        schedule.morning.push(supp.name);
      } else if (name.includes('магний') || name.includes('мелатонин')) {
        schedule.evening.push(supp.name);
      } else {
        schedule.afternoon.push(supp.name);
      }
    });
  
    let suggestions = '';
    if (goal === 'Улучшить сон' && !supplements.some(s => s.name.toLowerCase().includes('мелатонин'))) {
      suggestions = 'Для улучшения сна попробуйте добавить мелатонин в низкой дозе.';
    } else if (goal === 'Энергия / бодрость' && !supplements.some(s => s.name.toLowerCase().includes('витамин b'))) {
      suggestions = 'Для повышения энергии попробуйте добавить витамины группы B.';
    } else if (goal === 'Снижение веса' && !supplements.some(s => s.name.toLowerCase().includes('l-карнитин'))) {
      suggestions = 'Для снижения веса попробуйте добавить L-карнитин.';
    } else {
      suggestions = 'Ваш курс выглядит сбалансированным. Следуйте расписанию для достижения цели.';
    }
  
    return {
      goal,
      supplements: supplements.map(s => ({ name: s.name, dose: s.dose || '200mg' })),
      schedule,
      duration: 30,
      suggestions,
    };
  };

  const handleGenerateCourse = () => {
    if (goal && supplements.length > 0) {
      const generatedCourse = generateScheduleAndSuggestions(goal, supplements);
      setCourse(generatedCourse);
    }
  };

  return (
    <div className='relative p-4 py-40 max-w-md mx-auto bg-blue-50'>
      <motion.h1
        className='text-2xl font-bold mb-6 text-blue-900 relative z-10'
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Создать быстрый курс
      </motion.h1>
      <GoalSelector onSelect={(g: string) => setGoal(g)} />
      <SupplementInput
        onAdd={handleAddSupplement}
        onRemove={handleRemoveSupplement}
      />
      <motion.button
        onClick={handleGenerateCourse}
        className='bg-blue-600 text-white p-3 rounded-xl w-full relative z-10 font-medium shadow-md mt-4'
        disabled={!goal || supplements.length === 0}
        whileHover={{ scale: 1.03, boxShadow: '0 8px 16px rgba(0,0,0,0.08)' }}
        whileTap={{ scale: 0.97 }}
      >
        Сгенерировать курс
      </motion.button>
      {course && <CourseTable course={course} />}
    </div>
  );
};