// Subscription.jsx
import { useState } from "react";
const BASE_URL = import.meta.env.VITE_BASE_API_URL;

const Subscription = () => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);

    const response = await fetch(`${BASE_URL}/api/create-payment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: 199, // ₽
        orderId: "order_" + Date.now(),
        description: "TestPayment",
        customerEmail: "user@example.com",
        customerPhone: "+79999999999",
      }),
    });

    const data = await response.json();
    setLoading(false);

    if (data.PaymentURL) {
      window.location.href = data.PaymentURL;
    } else {
      // alert("Ошибка при создании платежа");
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
