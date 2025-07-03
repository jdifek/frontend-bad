import { useState } from "react";
import { motion } from "framer-motion";
import { GoalSelector } from "../components/re-used/GoalSelector";
import { CourseTable } from "../components/re-used/CourseTable";
import { IoCalendarOutline, IoDocumentAttachOutline } from "react-icons/io5";
import { Slide, toast } from "react-toastify";
import $api from "../api/http";
import { useAuth } from "../helpers/context/AuthContext";
import {  BiTrash } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

// Type definitions remain unchanged
type Supplement = {
  name: string;
  dose?: string;
  time?: string;
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
  duration: number;
  suggestions: string;
  warnings: string;
  questions: string[];
  repeatAnalysis: string;
  disclaimer: string;
};

type AnalysisSummary = {
  biomarkers: {
    name: string;
    value: string;
    normalRange: string;
    status: string;
  }[];
  summary: string;
};

export const AnalysisCourse = () => {
  const [dietPreference, setDietPreference] = useState<string>("none");
  const [goals, setGoals] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [analysisSummary, setAnalysisSummary] =
    useState<AnalysisSummary | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  // Function to truncate file name
  const truncateFileName = (name: string, maxLength: number = 20) => {
    if (name.length <= maxLength) return name;
    const extension = name.split(".").pop();
    const nameWithoutExt = name.substring(0, name.lastIndexOf("."));
    return `${nameWithoutExt.substring(
      0,
      maxLength - 3 - (extension?.length || 0)
    )}...${extension}`;
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const uploadedFile = e.target.files[0];
      if (
        !["image/jpeg", "image/png", "application/pdf"].includes(
          uploadedFile.type
        )
      ) {
        setError("Пожалуйста, загрузите файл в формате JPG, PNG или PDF.");
        return;
      }
      setFile(uploadedFile);
      setError(null);

      try {
        setLoading(true);
        const formData = new FormData();
        formData.append("telegramId", user?.telegramId || "");
        formData.append("file", uploadedFile);

        const response = await $api.post("/api/analyses/summary", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        setAnalysisSummary(response.data.summary);
        toast.success("Анализы успешно расшифрованы!", {
          position: "bottom-center",
          autoClose: 5000,
          theme: "light",
          transition: Slide,
        });
      } catch (err) {
        console.error("Error processing analysis file:", err);
        setError("Не удалось обработать файл. Попробуйте снова.");
      } finally {
        setLoading(false);
      }
    }
  };

  // Other functions (handleGenerateCourse, handleAddReminder) remain unchanged
  const handleGenerateCourse = async () => {
    if (authLoading || !user?.telegramId) {
      setError("Пользователь не авторизован");
      return;
    }

    if (!goals.length || !file) {
      setError("Загрузите анализы и выберите цель.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append("telegramId", user.telegramId);
      formData.append("goal", JSON.stringify(goals));
      formData.append("dietPreference", dietPreference);
      formData.append("file", file);

      const response = await $api.post("/api/analyses", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setCourse({
        ...response.data.course,
        suggestions: response.data.suggestions,
        warnings: response.data.warnings,
        questions: response.data.questions,
        repeatAnalysis: response.data.repeatAnalysis,
        disclaimer: response.data.disclaimer,
      });

      toast.info("Напоминания отправлены в Telegram-бот!", {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        transition: Slide,
      });
    } catch (err) {
      console.error("Error generating analysis course:", err);
      setError("Не удалось сгенерировать курс. Попробуйте снова.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddReminder = async (type: "ANALYSIS" | "SURVEY") => {
    if (!course) {
      toast.error("Сначала сгенерируйте курс.", {
        position: "bottom-center",
        theme: "light",
        transition: Slide,
      });
      return;
    }

    try {
      const message =
        type === "ANALYSIS"
          ? course.repeatAnalysis || "Сдайте повторные анализы через 8 недель"
          : "Как ты себя сегодня чувствуешь? Это поможет уточнить твой курс.";

      await $api.post("/api/reminders", {
        telegramId: user?.telegramId,
        courseId: course.id,
        type,
        message,
      });

      toast.success(
        type === "ANALYSIS"
          ? "Напоминание о повторных анализах отправлено в Telegram!"
          : "Опрос отправлен в Telegram!",
        {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
          transition: Slide,
        }
      );
    } catch (err) {
      console.error("Error adding reminder:", err);
      toast.error("Не удалось отправить напоминание в Telegram.", {
        position: "bottom-center",
        theme: "light",
        transition: Slide,
      });
    }
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
        Курс по анализам
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
      {!file && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            Загрузите анализы:
          </h3>
          <label className="block">
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={handleFileUpload}
              className="hidden"
            />
            <motion.div
              className="p-4 bg-blue-50 rounded-xl border border-dashed border-blue-600 text-center cursor-pointer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <IoDocumentAttachOutline
                size={24}
                className="mx-auto mb-2 text-blue-600"
              />
              <p className="text-blue-900 text-sm">
                Нажмите, чтобы загрузить анализы (JPG, PNG, PDF)
              </p>
            </motion.div>
          </label>
        </div>
      )}
      {file && (
        <>
          <div className="mb-6">
            {loading ? (
              <p className="text-blue-900 text-sm">Загрузка анализов…</p>
            ) : (
              <p className="text-blue-900 text-sm break-all">
                Загружен файл: {truncateFileName(file.name)}
              </p>
            )}
            <motion.button
              onClick={() => {
                setFile(null);
                setAnalysisSummary(null);
                setGoals([]);
                setCourse(null);
              }}
              className="mt-2 text-blue-600 text-sm"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              Удалить файл
            </motion.button>
          </div>
          {analysisSummary && (
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-300 mb-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                Расшифровка анализов:
              </h3>
              <p className="text-gray-600 text-sm mb-2">
                {analysisSummary.summary}
              </p>
              {analysisSummary.biomarkers.length > 0 && (
                <ul className="text-gray-600 text-sm">
                  {analysisSummary.biomarkers.map((bm, idx) => (
                    <li key={idx} className="mb-1">
                      <strong>{bm.name}:</strong> {bm.value} ({bm.normalRange},{" "}
                      {bm.status})
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
          <GoalSelector
            dietPreference={dietPreference}
            setDietPreference={setDietPreference}
            onSelect={setGoals}
            selectedGoals={goals}
            setSelectedGoals={setGoals}
          />
          <motion.button
            onClick={handleGenerateCourse}
            className="bg-blue-600 text-white p-3 rounded-lg w-full mb-6 font-medium shadow-md border border-white"
            disabled={!goals.length || loading}
            whileHover={{
              scale: 1.03,
              boxShadow: "0 8px 16px rgba(0,0,0,0.08)",
            }}
            whileTap={{ scale: 0.97 }}
          >
            {loading ? "Генерация..." : "Сгенерировать курс"}
          </motion.button>
        </>
      )}
      {course && (
        <>
          <CourseTable course={course} />
          <motion.button
            onClick={() => handleAddReminder("ANALYSIS")}
            className="bg-purple-200 text-gray-700 p-3 rounded-lg w-full mb-4 font-medium shadow-md border border-white flex items-center justify-center"
            whileHover={{
              scale: 1.03,
              boxShadow: "0 8px 16px rgba(0,0,0,0.08)",
            }}
            whileTap={{ scale: 0.97 }}
          >
            <IoCalendarOutline size={20} className="mr-2" />
            Напомнить о повторных анализах
          </motion.button>
          <motion.button
            onClick={() => navigate("/my-course")}
            className="bg-blue-200 text-gray-700 p-3 rounded-lg w-full mb-3 font-medium shadow-md border border-white flex items-center justify-center"
            whileHover={{
              scale: 1.03,
              boxShadow: "0 8px 16px rgba(0,0,0,0.08)",
            }}
            whileTap={{ scale: 0.97 }}
          >
            <IoCalendarOutline size={20} className="mr-2" />
            Перейти в мой курс
          </motion.button>
          <motion.button
            onClick={() => navigate("/my-course")}
            className="bg-red-500 text-white p-3 rounded-lg w-full font-medium shadow-md border border-white flex items-center justify-center"
            whileHover={{
              scale: 1.03,
              boxShadow: "0 8px 16px rgba(0,0,0,0.08)",
            }}
            whileTap={{ scale: 0.97 }}
          >
            <BiTrash size={20} className="mr-2" />
            Удалить курс
          </motion.button>
        </>
      )}
    </div>
  );
};
