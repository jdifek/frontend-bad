import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../helpers/context/AuthContext';
import $api from '../api/http';
import { toast } from 'react-toastify';

interface QRCode {
  code: string;
  link: string;
  image: string;
}

const Admin: React.FC = () => {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [orderId, setOrderId] = useState('');
  const [qrCode, setQrCode] = useState<QRCode | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [bulkCount, setBulkCount] = useState('');
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user?.isAdmin) {
      toast.error('Доступ только для администраторов');
      navigate('/');
    }
    // Очистка URL при размонтировании компонента
    return () => {
      if (downloadUrl) {
        window.URL.revokeObjectURL(downloadUrl);
      }
    };
  }, [user, authLoading, navigate, downloadUrl]);

  const handleGenerateQR = async () => {
    if (!orderId) {
      toast.error('Введите ID заказа');
      return;
    }

    setIsLoading(true);
    try {
      const response = await $api.post('/api/auth/add-qr', { orderId });
      setQrCode(response.data.qrCode);
      toast.success('QR-код успешно создан');
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast.error('Ошибка при создании QR-кода');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateBulkQR = async () => {
    const count = parseInt(bulkCount);
    if (!count || count <= 0) {
      toast.error('Введите корректное количество QR-кодов');
      return;
    }

    if (!user?.telegramId) {
      toast.error('Telegram ID пользователя не найден');
      return;
    }

    setIsLoading(true);
    setDownloadUrl(null); // Сброс предыдущего URL
    try {
      const response = await $api.post(
        '/api/auth/bulk-qr',
        { count, telegramId: user.telegramId },
        { responseType: 'blob' }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      setDownloadUrl(url);
      toast.success(`${count} QR-кодов успешно созданы`);
    } catch (error) {
      console.error('Error generating bulk QR codes:', error);
      toast.error('Ошибка при создании QR-кодов');
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return <div className="min-h-screen bg-blue-50 flex items-center justify-center">Загрузка...</div>;
  }

  return (
    <div className="min-h-screen bg-blue-50 p-6 pt-40">
      <motion.h1
        className="text-3xl font-bold text-center mb-6 text-blue-900"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Панель администратора
      </motion.h1>
      <div className="max-w-md mx-auto">
        {/* Создание одного QR-кода */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-blue-900 mb-2">Создать один QR-код</h2>
          <div className="mb-4">
            <label htmlFor="orderId" className="block text-gray-700 font-medium mb-2">
              ID заказа
            </label>
            <input
              id="orderId"
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-600"
              placeholder="Введите ID заказа"
            />
          </div>
          <motion.button
            onClick={handleGenerateQR}
            disabled={isLoading}
            className="w-full p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-gray-400"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            {isLoading ? 'Создание...' : 'Создать QR-код'}
          </motion.button>
          {qrCode && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-blue-900 mb-2">Созданный QR-код</h2>
              <img src={qrCode.image} alt="QR Code" className="w-48 h-48 mx-auto mb-4" />
              <p className="text-gray-700 mb-2">Код: {qrCode.code}</p>
              <p className="text-gray-700 mb-2">Ссылка: <a href={qrCode.link} className="text-blue-600">{qrCode.link}</a></p>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(qrCode.link);
                  toast.success('Ссылка скопирована');
                }}
                className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
              >
                Копировать ссылку
              </button>
            </div>
          )}
        </div>

        {/* Создание нескольких QR-кодов */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-blue-900 mb-2">Создать несколько QR-кодов</h2>
          <div className="mb-4">
            <label htmlFor="bulkCount" className="block text-gray-700 font-medium mb-2">
              Количество QR-кодов
            </label>
            <input
              id="bulkCount"
              type="number"
              value={bulkCount}
              onChange={(e) => setBulkCount(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-600"
              placeholder="Введите количество (например, 200)"
            />
          </div>
          <motion.button
            onClick={handleGenerateBulkQR}
            disabled={isLoading}
            className="w-full p-3 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:bg-gray-400"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            {isLoading ? 'Создание...' : 'Создать QR-коды'}
          </motion.button>
          {/* {downloadUrl && (
            <div className="mt-4">
              <p className="text-gray-700 mb-2">QR-коды готовы для скачивания:</p>
              <a
                href={downloadUrl}
                download={`qr_codes_${new Date().toISOString()}.xlsx`}
                className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 inline-block"
              >
                Скачать Excel файл
              </a>
            </div>
          )} */}
        </div>

        <Link to="/" className="block mt-4 text-blue-600 hover:underline">
          Вернуться на главную
        </Link>
      </div>
    </div>
  );
};

export default Admin;