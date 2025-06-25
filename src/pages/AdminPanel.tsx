import React, { useEffect, useState } from 'react'
import $api from '../api/http'

interface User {
  id: string
  telegramId: string
  name?: string
  isAdmin: boolean
  isPremium: boolean
  createdAt: string
  clickedGoals?: Record<string, number>
  clickedTabs?: Record<string, number>
}

type Stats = Record<string, number>

export const AdminPanel: React.FC = () => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [goalStats, setGoalStats] = useState<Stats>({})
  const [tabStats, setTabStats] = useState<Stats>({})
  const [activeTab, setActiveTab] = useState<'users' | 'analytics'>('users')

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await $api.get<User[]>('/api/admin/users')
        setUsers(response.data)
      } catch (err) {
        console.error('Ошибка при получении пользователей:', err)
        setError('Не удалось загрузить пользователей.')
      } finally {
        setLoading(false)
      }
    }

    const fetchStats = async () => {
      try {
        const [goals, tabs] = await Promise.all([
          $api.get<Stats>('/api/admin/count-goal'),
          $api.get<Stats>('/api/admin/count-main-menu'),
        ])
        setGoalStats(goals.data)
        setTabStats(tabs.data)
      } catch (err) {
        console.error('Ошибка при загрузке статистики:', err)
      }
    }

    fetchUsers()
    fetchStats()
  }, [])

  const renderClickData = (data?: Record<string, number>) => {
    if (!data || Object.keys(data).length === 0) return <span className="text-gray-400">—</span>
    return (
      <ul className="space-y-1">
        {Object.entries(data).map(([key, count]) => (
          <li key={key}>
            <span className="font-medium">{key}</span>: {count}
          </li>
        ))}
      </ul>
    )
  }

  const renderStatsTable = (title: string, data: Stats) => (
    <div className="mb-8">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 border">Название</th>
            <th className="p-2 border">Количество</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(data)
            .sort((a, b) => b[1] - a[1])
            .map(([key, count]) => (
              <tr key={key}>
                <td className="p-2 border">{key}</td>
                <td className="p-2 border">{count}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  )

  if (loading) return <p className="p-4">Загрузка...</p>
  if (error) return <p className="p-4 text-red-500">{error}</p>

  return (
    <div className="p-4 pt-40 overflow-x-auto">
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
          <table className="w-full border border-gray-300 text-sm">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2 border">ID</th>
                <th className="p-2 border">Telegram ID</th>
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
          {renderStatsTable('Клики по целям (все пользователи)', goalStats)}
          {renderStatsTable('Клики по вкладкам (все пользователи)', tabStats)}
        </>
      )}
    </div>
  )
}
