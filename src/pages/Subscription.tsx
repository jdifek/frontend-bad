// Subscription.jsx
import { useState } from "react";
const BASE_URL = import.meta.env.VITE_BASE_API_URL;

const Subscription = () => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    const tg = window.Telegram?.WebApp;
    const telegramId = tg?.initDataUnsafe?.user?.id || "TEST_USER";
  
    try {
      // 1. Создаем платеж
      const paymentResponse = await fetch(`${BASE_URL}/api/create-payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: 199,
          orderId: `sub_${Date.now()}`,
          description: "Премиум подписка",
          telegramId
        })
      });
  
      const { OrderId } = await paymentResponse.json();
  
      // 2. Открываем платежную страницу
  
      // 3. Проверяем статус каждые 5 секунд
      const checkInterval = setInterval(async () => {
        try {
          const confirmResponse = await fetch(`${BASE_URL}/api/confirm-payment`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ OrderId })
          });
  
          const { success } = await confirmResponse.json();
          
          if (success) {
            clearInterval(checkInterval);
            window.location.reload(); // Обновляем страницу
          }
        } catch (error) {
          console.error("Payment check error:", error);
        }
      }, 5000);
  
    } catch (error) {
      console.error("Payment error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 pt-40">
      <div className="max-w-md w-full bg-blue-50 p-6 rounded-2xl shadow-md text-center">
        <h1 className="text-3xl font-bold text-blue-900 mb-4">
          Подписка на ИИ-нутрициолога
        </h1>
        <p className="text-gray-700 mb-6">
          Получите полный доступ ко всем рекомендациям по питанию, анализу
          продуктов и персонализированным планам здоровья всего за{" "}
          <strong>199 ₽ в месяц</strong>.
        </p>
        <button
          className="w-full p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
          onClick={handlePayment}
          disabled={loading}
        >
          {loading ? "Ожидание..." : "Оформить подписку"}
        </button>
      </div>
    </div>
  );
};

export default Subscription;
