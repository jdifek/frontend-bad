import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../helpers/context/AuthContext';
import $api from '../api/http';
import { toast } from 'react-toastify';

interface User {
  id: string;
  telegramId: string;
  name?: string;
  username?: string;
  isAdmin: boolean;
  isPremium: boolean;
  createdAt: string;
  clickedGoals?: Record<string, number>;
  clickedTabs?: Record<string, number>;
}

interface Stats {
  [key: string]: {
    [date: string]: {
      [userId: string]: { name: string; count: number };
    };
  };
}

export const AdminPanel: React.FC = () => {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [goalStats, setGoalStats] = useState<Stats>({});
  const [tabStats, setTabStats] = useState<Stats>({});
  const [activeTab, setActiveTab] = useState<'users' | 'analytics'>('users');
  const [selectedDate, setSelectedDate] = useState<string>('');

  useEffect(() => {
    if (!authLoading && !user?.isAdmin) {
      toast.error('Доступ только для администраторов');
      navigate('/');
    }

    const fetchUsers = async () => {
      try {
        const response = await $api.get<User[]>('/api/admin/users');
        setUsers(response.data);
      } catch (err) {
        console.error('Ошибка при получении пользователей:', err);
        setError('Не удалось загрузить пользователей.');
      } finally {
        setLoading(false);
      }
    };

    const fetchStats = async () => {
      try {
        const params = selectedDate ? { date: selectedDate } : {};
        const [goals, tabs] = await Promise.all([
          $api.get<Stats>('/api/admin/count-goal', { params }),
          $api.get<Stats>('/api/admin/count-main-menu', { params }),
        ]);
        setGoalStats(goals.data);
        setTabStats(tabs.data);
      } catch (err) {
        console.error('Ошибка при загрузке статистики:', err);
        toast.error('Ошибка загрузки статистики');
      }
    };

    fetchUsers();
    fetchStats();
  }, [authLoading, user, navigate, selectedDate]);

  const handleExportUsers = async () => {
    if (!user?.telegramId) {
      toast.error('Telegram ID пользователя не найден');
      return;
    }

    try {
      const response = await $api.post('/api/admin/export-users', { telegramId: user.telegramId });
      toast.success(response.data.message);
    } catch (error) {
      console.error('Ошибка при экспорте пользователей:', error);
      toast.error('Ошибка при отправке таблицы в Telegram');
    }
  };

  const renderClickData = (data?: Record<string, number>) => {
    if (!data || Object.keys(data).length === 0) return <span className="text-gray-400">—</span>;
    return (
      <ul className="space-y-1">
        {Object.entries(data).map(([key, count]) => (
          <li key={key}>
            <span className="font-medium">{key}</span>: {count}
          </li>
        ))}
      </ul>
    );
  };

  const renderStatsTable = (title: string, data: Stats) => (
    <div className="mb-8">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      {Object.keys(data).length === 0 ? (
        <p className="text-gray-700">Нет данных</p>
      ) : (
        <div className="bg-white p-4 rounded-xl shadow">
          {Object.entries(data).map(([name, dates]) => (
            <div key={name} className="mb-4">
              <h4 className="text-lg font-medium text-blue-800">{name}</h4>
              {Object.entries(dates).map(([date, users]) => (
                <div key={date} className="ml-4">
                  <p className="text-gray-700"><strong>Дата:</strong> {date}</p>
                  <ul className="ml-6 list-disc">
                    {Object.entries(users).map(([userId, { name, count }]) => (
                      <li key={userId}>
                        {name} ({userId}): {count} кликов
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  if (authLoading || loading) return <p className="p-4">Загрузка...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-blue-50 p-6 pt-40 overflow-x-auto">
      <motion.h1
        className="text-3xl font-bold text-center mb-6 text-blue-900"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Панель администратора
      </motion.h1>
      <div className="max-w-4xl mx-auto">
        <div className="mb-4 space-x-2">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded ${activeTab === 'users' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Пользователи
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded ${activeTab === 'analytics' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Аналитика
          </button>
        </div>

        {activeTab === 'users' && (
          <>
            <h2 className="text-2xl font-semibold mb-4">Пользователи</h2>
            <button
              onClick={handleExportUsers}
              className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
            >
              Отправить таблицу в Telegram
            </button>
            <table className="w-full border border-gray-300 text-sm">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-2 border">ID</th>
                  <th className="p-2 border">Telegram ID</th>
                  <th className="p-2 border">Telegram username</th>
                  <th className="p-2 border">Имя</th>
                  <th className="p-2 border text-center">Премиум</th>
                  <th className="p-2 border text-center">Админ</th>
                  <th className="p-2 border">Создан</th>
                  <th className="p-2 border">Клики по целям</th>
                  <th className="p-2 border">Клики по вкладкам</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 align-top">
                    <td className="p-2 border">{user.id}</td>
                    <td className="p-2 border">{user.telegramId}</td>
                    <td className="p-2 border">{user.username}</td>
                    <td className="p-2 border">{user.name || '-'}</td>
                    <td className="p-2 border text-center">{user.isPremium ? '✅' : '❌'}</td>
                    <td className="p-2 border text-center">{user.isAdmin ? '✅' : '❌'}</td>
                    <td className="p-2 border">{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="p-2 border">{renderClickData(user.clickedGoals)}</td>
                    <td className="p-2 border">{renderClickData(user.clickedTabs)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {activeTab === 'analytics' && (
          <>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-blue-900 mb-2">Фильтр по дате</h2>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-600"
              />
            </div>
            {renderStatsTable('Клики по целям (все пользователи)', goalStats)}
            {renderStatsTable('Клики по вкладкам (все пользователи)', tabStats)}
          </>
        )}

        <Link to="/" className="block mt-4 text-blue-600 hover:underline">
          Вернуться на главную
        </Link>
      </div>
    </div>
  );
};