/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useAuth } from "../helpers/context/AuthContext";
import $api from "../api/http";
import { Slide, toast } from "react-toastify";
import { FaCheck, FaTimes, FaCalendarAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

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
  duration: number | null;
  createdAt: Date;
  reminders: Reminder[];
  progress: Progress[];
  surveys: Survey[];
  disclaimer: string;
};

type Reminder = {
  id: string;
  type: string;
  time: string;
  message: string;
  status?: string;
  surveyResponse?: string;
};

type Progress = {
  id: string;
  supplement: string;
  date: string;
  status: string;
};

type Survey = {
  id: string;
  question: string;
  response: string;
  status: string;
  createdAt: Date;
};

export const MyCourse = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [updateDialog, setUpdateDialog] = useState<boolean>(false);
  const [newGoal, setNewGoal] = useState<string>("");
  const [newSupplements, setNewSupplements] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      if (authLoading || !user?.telegramId) return;

      try {
        const res = await $api.get(
          `/api/my-course/all-courses?telegramId=${user.telegramId}`
        );
        setCourses(res.data.courses);
        if (res.data.courses.length > 0) {
          setSelectedCourse(res.data.courses[0]);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
        setError("Не удалось загрузить курсы. Попробуйте позже.");
      }
    };

    fetchCourses();
  }, [user, authLoading]);

  useEffect(() => {
    if (!selectedCourse || !user?.telegramId) return;

    const interval = setInterval(async () => {
      try {
        const res = await $api.get(
          `/api/my-course?telegramId=${user.telegramId}&courseId=${selectedCourse.id}`
        );
        setSelectedCourse(res.data.course);
      } catch (error) {
        console.error("Error polling course:", error);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [selectedCourse, user]);

  const calculateProgress = (course: Course) => {
    const startDate = new Date(course.createdAt);
    const daysPassed = Math.floor(
      (Date.now() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    const totalDays = course.duration || 30;
    const progress = Math.min((daysPassed / totalDays) * 100, 100);

    const completed = course.progress.filter(
      (p) => p.status === "TAKEN"
    ).length;
    const totalProgress = course.progress.length;
    const completionRate =
      totalProgress > 0 ? (completed / totalProgress) * 100 : 0;

    return { daysPassed, totalDays, progress, completionRate };
  };

  const handleMarkProgress = async (
    courseId: string,
    supplement: string,
    date: string,
    status: "TAKEN" | "SKIPPED"
  ) => {
    try {
      await $api.post("/api/my-course/progress", {
        telegramId: user!.telegramId,
        courseId,
        supplement,
        date: new Date(date).toISOString(),
        status,
      });
      const res = await $api.get(
        `/api/my-course?telegramId=${user!.telegramId}&courseId=${courseId}`
      );
      if (!res.data.course) {
        throw new Error("Курс не найден в ответе сервера");
      }
      setSelectedCourse(res.data.course);
      setCourses(courses.map((c) => (c.id === courseId ? res.data.course : c)));
      toast.success(
        `Прогресс отмечен: ${status === "TAKEN" ? "Принято" : "Пропущено"}`,
        {
          position: "bottom-center",
          theme: "light",
          transition: Slide,
        }
      );
    } catch (error) {
      console.error("Error marking progress:", error);
      toast.error("Не удалось отметить прогресс.", {
        position: "bottom-center",
        theme: "light",
        transition: Slide,
      });
    }
  };

  const handleUpdateCourse = async () => {
    if (!newGoal || newSupplements.length === 0) {
      toast.error("Укажите цель и добавки.");
      return;
    }

    try {
      setLoading(true);
      const res = await $api.post("/api/my-course/update", {
        telegramId: user!.telegramId,
        goal: newGoal,
        supplements: newSupplements,
      });
      const newCourse = res.data.course;
      setCourses([newCourse, ...courses]);
      setSelectedCourse(newCourse);
      setUpdateDialog(false);
      setNewGoal("");
      setNewSupplements([]);
      toast.success("Курс обновлён!");
      navigate("/my-course");
    } catch (error) {
      console.error("Error updating course:", error);
      toast.error("Не удалось обновить курс.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async () => {
    if (!selectedCourse) {
      toast.error("Выберите курс для удаления.");
      return;
    }

    try {
      setLoading(true);
      await $api.delete("/api/my-course/delete", {
        data: {
          telegramId: user!.telegramId,
          courseId: selectedCourse.id,
        },
      });
      const updatedCourses = courses.filter((c) => c.id !== selectedCourse.id);
      setCourses(updatedCourses);
      setSelectedCourse(updatedCourses.length > 0 ? updatedCourses[0] : null);
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

  const getLocalDateString = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const getProgressForDate = (date: Date) => {
    if (!selectedCourse) return [];

    const dateString = getLocalDateString(date);
    return selectedCourse.progress.filter((p) => {
      const progressDate = p.date.split("T")[0];
      return progressDate === dateString;
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

  if (error) {
    return <div className="p-4 text-center text-red-700">{error}</div>;
  }

  if (courses.length === 0) {
    return (
      <div className="p-4 text-center text-blue-900">Курсы не найдены.</div>
    );
  }

  return (
    <div className="relative p-4 py-40 pt-35 max-w-md mx-auto bg-blue-50">

      <motion.h1
        className="text-2xl font-bold mb-6 text-blue-900"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Мой курс
      </motion.h1>

      {/* Выбор курса */}
      <motion.div
        className="bg-white p-4 rounded-xl shadow-sm mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h2 className="text-lg font-medium text-blue-900 mb-2">
          Выберите курс
        </h2>
        <select
          className="w-full p-3 border border-blue-200 rounded-lg"
          value={selectedCourse?.id || ""}
          onChange={(e) =>
            setSelectedCourse(
              courses.find((c) => c.id === e.target.value) || null
            )
          }
        >
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.goal} (создан:{" "}
              {new Date(course.createdAt).toLocaleDateString()})
            </option>
          ))}
        </select>
      </motion.div>

      {selectedCourse && selectedCourse.progress && (
        <>
          {/* Прогресс */}
          <motion.div
            className="bg-white p-4 rounded-xl shadow-sm mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h2 className="text-lg font-medium text-blue-900 mb-2">
              Прогресс курса
            </h2>
            {(() => {
              const { daysPassed, totalDays, progress, completionRate } =
                calculateProgress(selectedCourse);
              return (
                <>
                  <div className="mb-2">
                    <p className="text-sm text-blue-700">
                      Дни: {daysPassed} / {totalDays}
                    </p>
                    <div className="w-full bg-blue-100 rounded-full h-2.5">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-blue-700">
                      Выполнено: {completionRate.toFixed(1)}%
                    </p>
                    <div className="w-full bg-blue-100 rounded-full h-2.5">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{ width: `${completionRate}%` }}
                      ></div>
                    </div>
                  </div>
                </>
              );
            })()}
          </motion.div>

          {/* Календарь */}
          <motion.div
            className="bg-white p-4 rounded-xl shadow-sm mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-lg font-medium text-blue-900">
                История приёма
              </h2>
              <button
                onClick={() => setShowCalendar(!showCalendar)}
                className="text-blue-600 hover:text-blue-800"
                title={showCalendar ? "Скрыть календарь" : "Показать календарь"}
              >
                <FaCalendarAlt size={20} />
              </button>
            </div>
            <AnimatePresence>
              {showCalendar && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <Calendar
                    onChange={(value: any) => {
                      if (value instanceof Date) {
                        setSelectedDate(value);
                      } else if (
                        Array.isArray(value) &&
                        value.length > 0 &&
                        value[0] instanceof Date
                      ) {
                        setSelectedDate(value[0]); // Для диапазона берем первую дату
                      }
                    }}
                    value={selectedDate}
                    className="w-full mb-4 mx-auto rounded-lg border border-blue-200"
                    tileClassName={({ date }) => {
                      const progress = getProgressForDate(date);
                      if (progress.length > 0) {
                        const allTaken = progress.every(
                          (p) => p.status === "TAKEN"
                        );
                        const someSkipped = progress.some(
                          (p) => p.status === "SKIPPED"
                        );
                        return allTaken && !someSkipped
                          ? "bg-green-100"
                          : someSkipped
                          ? "bg-red-100"
                          : "bg-yellow-100";
                      }
                      return "";
                    }}
                  />
                  <div>
                    <h3 className="text-sm font-medium text-blue-900 mb-2">
                      Статус за {selectedDate.toLocaleDateString()}:
                    </h3>
                    {getProgressForDate(selectedDate).length > 0 ? (
                      <ul className="text-blue-700">
                        {getProgressForDate(selectedDate).map(
                          (progress, index) => (
                            <li key={index} className="py-1 flex items-center">
                              <span>{progress.supplement}:</span>
                              <span className="ml-2">
                                {progress.status === "TAKEN" ? (
                                  <FaCheck className="text-green-600" />
                                ) : (
                                  <FaTimes className="text-red-600" />
                                )}
                              </span>
                            </li>
                          )
                        )}
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

          {/* Таблица курса */}
          <motion.div
            className="bg-white p-4 rounded-xl shadow-sm mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h2 className="text-lg font-medium text-blue-900 mb-2">
              Расписание
            </h2>
            <table className="w-full text-left">
              <thead>
                <tr className="text-blue-700">
                  <th className="p-2">Время</th>
                  <th className="p-2">Добавки</th>
                    <th className="p-2">
                    Статус ({selectedDate.toLocaleDateString()})
                    </th>
                </tr>
              </thead>
              <tbody>
                {selectedCourse.schedule.morning.length > 0 && (
                  <tr>
                    <td className="p-2">Утро (08:00)</td>
                    <td className="p-2 gap-1 flex flex-col">
                        {selectedCourse.schedule.morning.map((supplement, index) => (
                        <span key={index} className=" ">
                          {supplement}
                        </span>
                        ))}
                    </td>
                    <td className="p-2">
                      {selectedCourse.schedule.morning.map((supplement) => {
                        const today = new Date().toISOString().split("T")[0];
                        const progress = selectedCourse.progress.find(
                          (p) =>
                            p.supplement === supplement &&
                            p.date.includes(today)
                        );
                        return (
                          <div key={supplement} className="flex gap-2 mb-3">
                            {progress?.status === "TAKEN" ? (
                              <FaCheck className="text-green-600" />
                            ) : progress?.status === "SKIPPED" ? (
                              <FaTimes className="text-red-600 " />
                            ) : (
                              <>
                                <button
                                  onClick={() =>
                                    handleMarkProgress(
                                      selectedCourse.id,
                                      supplement,
                                      today,
                                      "TAKEN"
                                    )
                                  }
                                  className="text-green-600"
                                >
                                  <FaCheck />
                                </button>
                                <button
                                  onClick={() =>
                                    handleMarkProgress(
                                      selectedCourse.id,
                                      supplement,
                                      today,
                                      "SKIPPED"
                                    )
                                  }
                                  className="text-red-600"
                                >
                                  <FaTimes />
                                </button>
                              </>
                            )}
                          </div>
                        );
                      })}
                    </td>
                  </tr>
                )}
                {selectedCourse.schedule.afternoon.length > 0 && (
                  <tr>
                    <td className="p-2">День (14:00)</td>
                    <td className="p-2">
                      {selectedCourse.schedule.afternoon.join(", ")}
                    </td>
                    <td className="p-2">
                      {selectedCourse.schedule.afternoon.map((supplement) => {
                        const today = new Date().toISOString().split("T")[0];
                        const progress = selectedCourse.progress.find(
                          (p) =>
                            p.supplement === supplement &&
                            p.date.includes(today)
                        );
                        return (
                          <div key={supplement} className="flex gap-2 mb-2">
                            {progress?.status === "TAKEN" ? (
                              <FaCheck className="text-green-600" />
                            ) : progress?.status === "SKIPPED" ? (
                              <FaTimes className="text-red-600" />
                            ) : (
                              <>
                                <button
                                  onClick={() =>
                                    handleMarkProgress(
                                      selectedCourse.id,
                                      supplement,
                                      today,
                                      "TAKEN"
                                    )
                                  }
                                  className="text-green-600"
                                >
                                  <FaCheck />
                                </button>
                                <button
                                  onClick={() =>
                                    handleMarkProgress(
                                      selectedCourse.id,
                                      supplement,
                                      today,
                                      "SKIPPED"
                                    )
                                  }
                                  className="text-red-600"
                                >
                                  <FaTimes />
                                </button>
                              </>
                            )}
                          </div>
                        );
                      })}
                    </td>
                  </tr>
                )}
                {selectedCourse.schedule.evening.length > 0 && (
                  <tr>
                    <td className="p-2">Вечер (20:00)</td>
                    <td className="p-2">
                      {selectedCourse.schedule.evening.join(", ")}
                    </td>
                    <td className="p-2">
                      {selectedCourse.schedule.evening.map((supplement) => {
                        const today = new Date().toISOString().split("T")[0];
                        const progress = selectedCourse.progress.find(
                          (p) =>
                            p.supplement === supplement &&
                            p.date.includes(today)
                        );
                        return (
                          <div key={supplement} className="flex gap-2 mb-2">
                            {progress?.status === "TAKEN" ? (
                              <FaCheck className="text-green-600" />
                            ) : progress?.status === "SKIPPED" ? (
                              <FaTimes className="text-red-600" />
                            ) : (
                              <>
                                <button
                                  onClick={() =>
                                    handleMarkProgress(
                                      selectedCourse.id,
                                      supplement,
                                      today,
                                      "TAKEN"
                                    )
                                  }
                                  className="text-green-600"
                                >
                                  <FaCheck />
                                </button>
                                <button
                                  onClick={() =>
                                    handleMarkProgress(
                                      selectedCourse.id,
                                      supplement,
                                      today,
                                      "SKIPPED"
                                    )
                                  }
                                  className="text-red-600"
                                >
                                  <FaTimes />
                                </button>
                              </>
                            )}
                          </div>
                        );
                      })}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </motion.div>

          {/* История настроения */}
          {selectedCourse &&
            selectedCourse.surveys &&
            selectedCourse.surveys.length > 0 && (
              <motion.div
                className="bg-white p-4 rounded-xl shadow-sm mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <h2 className="text-lg font-medium text-blue-900 mb-2">
                  Самочувствие
                </h2>
                <ul className="text-blue-700">
                  {selectedCourse.surveys
                    .filter((s) => s.status === "COMPLETED")
                    .map((survey) => (
                      <li key={survey.id} className="py-1">
                        {new Date(survey.createdAt).toLocaleDateString()}:{" "}
                        {survey.response}
                      </li>
                    ))}
                </ul>
              </motion.div>
            )}

          {/* Кнопка обновления */}
          <motion.button
            onClick={() => setUpdateDialog(true)}
            className="bg-blue-600 text-white p-3 rounded-xl w-full font-medium shadow-md"
            whileHover={{
              scale: 1.03,
              boxShadow: "0 8px 16px rgba(0,0,0,0.08)",
            }}
            whileTap={{ scale: 0.97 }}
          >
            Обновить курс
          </motion.button>

          {/* Кнопка удаления */}
          <motion.button
            onClick={handleDeleteCourse}
            className="bg-red-600 text-white p-3 rounded-xl mt-2 w-1/2 flex justify-center mx-auto font-medium shadow-md"
            whileHover={{
              scale: 1.03,
              boxShadow: "0 8px 16px rgba(0,0,0,0.08)",
            }}
            whileTap={{ scale: 0.97 }}
            disabled={loading}
          >
            {loading ? "Удаление..." : "Удалить курс"}
          </motion.button>

          {/* Диалог обновления */}
          {updateDialog && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="bg-white p-6 rounded-xl max-w-md w-full">
                <h2 className="text-lg font-medium text-blue-900 mb-4">
                  Обновить курс
                </h2>
                <input
                  type="text"
                  placeholder="Новая цель (например, Энергия)"
                  value={newGoal}
                  onChange={(e) => setNewGoal(e.target.value)}
                  className="w-full p-3 border border-blue-200 rounded-lg mb-4"
                />
                <input
                  type="text"
                  placeholder="Добавки (через запятую)"
                  onChange={(e) =>
                    setNewSupplements(
                      e.target.value.split(",").map((s) => s.trim())
                    )
                  }
                  className="w-full p-3 border border-blue-200 rounded-lg mb-4"
                />
                <div className="flex gap-4">
                  <button
                    onClick={handleUpdateCourse}
                    disabled={loading}
                    className="bg-blue-600 text-white p-3 rounded-lg flex-1"
                  >
                    {loading ? "Обновление..." : "Обновить"}
                  </button>
                  <button
                    onClick={() => setUpdateDialog(false)}
                    className="bg-gray-200 text-blue-900 p-3 rounded-lg flex-1"
                  >
                    Отмена
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Дисклеймер */}
          <motion.p
            className="text-sm text-blue-700 mt-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            ИИ-нутрициолог не заменяет консультацию врача. Это рекомендации
            общего характера, основанные на открытых данных.
          </motion.p>
        </>
      )}
    </div>
  );
};
