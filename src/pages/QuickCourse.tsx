import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { GoalSelector } from "../components/re-used/GoalSelector";
import { SupplementInput } from "../components/re-used/SupplementInput";
import { CourseTable } from "../components/re-used/CourseTable";
import $api from "../api/http";
import { useAuth } from "../helpers/context/AuthContext";
import { Slide, toast } from "react-toastify";
import { BackButton } from "../components/BackButton";
import { useNavigate } from "react-router-dom";

type Supplement = {
  name: string;
  dose?: string;
  time?: string;
  file?: File;
};

type Course = {
  id: string;
  goal: string;
  supplements: Supplement[];
  schedule: {
    morning: string[];
    afternoon: string[];
    evening: string[];
  };
  duration: number | null;
  suggestions: string;
  warnings: string;
  repeatAnalysis: string;
  questions: string[];
  disclaimer: string;
};

export const QuickCourse = () => {
  const [goals, setGoals] = useState<string[]>([]);
  const [isAddingSupplement, setIsAddingSupplement] = useState<boolean>(false);
  const [supplements, setSupplements] = useState<Supplement[]>([]);
  const [course, setCourse] = useState<Course | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { user, isLoading: authLoading } = useAuth();
  const [dietPreference, setDietPreference] = useState<string>("none");
  const navigate = useNavigate();
  useEffect(() => {
    const fetchCourses = async () => {
      console.log("fetchCourses called with:", { authLoading, user });
      if (authLoading || !user?.telegramId) {
        console.log("Skipping fetchCourses: authLoading or no user", {
          authLoading,
          user,
        });
        return;
      }

      try {
        const response = await $api.get(`/api/courses/${user.telegramId}`);
        console.log("Course data:", response.data);
        if (response.data.length > 0) {
          const latestCourse = response.data[0];
          setCourse({
            ...latestCourse,
            supplements: latestCourse.supplements || [],
            suggestions:
              latestCourse.suggestions ||
              "Следуйте расписанию для достижения цели.",
            warnings: latestCourse.warnings || "Проконсультируйтесь с врачом.",
            questions: latestCourse.questions || [],
            disclaimer:
              latestCourse.disclaimer ||
              "Персонализированные рекомендации ИИ-нутрициолога на основе открытых исследований и общих принципов. Не является медицинской услугой или диагнозом",
            repeatAnalysis: latestCourse.repeatAnalysis || "",
            duration: latestCourse.duration || 30,
          });
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
        setError("Не удалось загрузить курсы. Попробуйте позже.");
      }
    };

    fetchCourses();
  }, [user, authLoading]);

  const handleAddSupplement = async (
    supplement: Supplement,
    callback?: (recognizedSupplements: Supplement[]) => void
  ) => {
    if (authLoading || !user?.telegramId) {
      setError(
        "Пользователь не авторизован. Попробуйте перезагрузить приложение."
      );
      return;
    }

    try {
      setError(null);
      setIsAddingSupplement(true);
      let newSupplements: Supplement[] = [];

      if (supplement.file) {
        const formData = new FormData();
        formData.append("telegramId", user.telegramId);
        formData.append("photo", supplement.file);
        const response = await $api.post("/api/courses/supplements", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        newSupplements = response.data.supplements;
      } else {
        const response = await $api.post("/api/courses/supplements", {
          telegramId: user.telegramId,
          name: supplement.name,
        });
        newSupplements = Array.isArray(response.data.supplements)
          ? response.data.supplements
          : [response.data.supplements];
      }

      setSupplements((prev) => [...prev, ...newSupplements]);
      callback?.(newSupplements);
    } catch (error) {
      console.error("Error adding supplement:", error);
      setError(
        "Не удалось добавить добавку. Попробуйте снова или перезагрузите приложение."
      );
    } finally {
      setIsAddingSupplement(false);
    }
  };

  const handleRemoveSupplement = (supplementName: string) => {
    setSupplements(supplements.filter((s) => s.name !== supplementName));
  };

  const handleGenerateCourse = async () => {
    if (authLoading || !user?.telegramId) {
      setError(
        "Пользователь не авторизован. Попробуйте перезагрузить приложение."
      );
      return;
    }

    if (goals.length === 0) {
      setError("Выберите хотя бы одну цель.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await $api.post("/api/courses", {
        telegramId: user.telegramId,
        goal: goals.join(", "),
        dietPreference,
        checklist: JSON.stringify(supplements.map((s) => s.name)),
      });
      console.log("Generated course:", response.data);
      setCourse({
        ...response.data.course,
        supplements: response.data.course.supplements || [],
        suggestions:
          response.data.suggestions ||
          "Следуйте расписанию для достижения цели.",
        warnings: response.data.warnings || "Проконсультируйтесь с врачом.",
        questions: response.data.questions || [],
        disclaimer:
          response.data.disclaimer ||
          "Персонализированные рекомендации ИИ-нутрициолога на основе открытых исследований и общих принципов. Не является медицинской услугой или диагнозом",
        repeatAnalysis: response.data.repeatAnalysis || "",
        duration: response.data.course.duration || 30,
      });
      toast.success("Курс успешно создан!", {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        transition: Slide,
      });
    } catch (error) {
      console.error("Error generating course:", error);
      setError(
        "Не удалось сгенерировать курс. Попробуйте снова или перезагрузите приложение."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async () => {
    if (!course) {
      toast.error("Курс не выбран для удаления.", {
        position: "bottom-center",
        theme: "light",
        transition: Slide,
      });
      return;
    }

    try {
      setLoading(true);
      await $api.delete("/api/my-course/delete", {
        data: {
          telegramId: user!.telegramId,
          courseId: course.id,
        },
      });
      setCourse(null);
      setSupplements([]);
      setGoals([]);
      toast.success("Курс успешно удалён!", {
        position: "bottom-center",
        theme: "light",
        transition: Slide,
      });
    } catch (error) {
      console.error("Error deleting course:", error);
      toast.error("Не удалось удалить курс.", {
        position: "bottom-center",
        theme: "light",
        transition: Slide,
      });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return <div className="p-4 text-center text-blue-900">Загрузка...</div>;
  }

  if (!user) {
    return (
      <div className="p-4 text-center text-red-700">
        Ошибка авторизации. Попробуйте перезагрузить приложение или войти снова.
      </div>
    );
  }

  return (
    <div className="relative p-4 py-40 pt-35 max-w-md mx-auto bg-blue-50">
      <BackButton />
      <motion.h1
        className="text-2xl font-bold mb-6 text-blue-900 relative z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Создать быстрый курс
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
      <GoalSelector
        dietPreference={dietPreference}
        setDietPreference={setDietPreference}
        onSelect={(g: string[]) => setGoals(g)}
      />
      <SupplementInput
        supplements={supplements}
        onAdd={handleAddSupplement}
        onRemove={handleRemoveSupplement}
      />
      <motion.button
        onClick={handleGenerateCourse}
        className="bg-blue-600 text-white p-3 rounded-xl w-full relative z-10 font-medium shadow-md mt-4"
        disabled={goals.length === 0 || loading}
        whileHover={{ scale: 1.03, boxShadow: "0 8px 16px rgba(0,0,0,0.08)" }}
        whileTap={{ scale: 0.97 }}
      >
        {loading
          ? "Генерация..."
          : isAddingSupplement
          ? "Идет анализ добавок..."
          : "Сгенерировать курс"}
      </motion.button>
      {course && (
        <>
          <CourseTable course={course} />
          <motion.button
            onClick={() => navigate('/my-course')}
            className="bg-[#ffffff] text-black p-3 rounded-xl mt-4 w-full font-medium shadow-md"
            disabled={loading}
            whileHover={{
              scale: 1.03,
              boxShadow: "0 8px 16px rgba(0,0,0,0.08)",
            }}
            whileTap={{ scale: 0.97 }}
          >
            {loading ? "Переход" : "Перейти в мой курс"}
          </motion.button>
          <motion.button
            onClick={handleDeleteCourse}
            className="bg-red-600 text-white p-3 rounded-xl mt-4 w-full font-medium shadow-md"
            disabled={loading}
            whileHover={{
              scale: 1.03,
              boxShadow: "0 8px 16px rgba(0,0,0,0.08)",
            }}
            whileTap={{ scale: 0.97 }}
          >
            {loading ? "Удаление..." : "Удалить курс"}
          </motion.button>
        </>
      )}
    </div>
  );
};

export default QuickCourse;
