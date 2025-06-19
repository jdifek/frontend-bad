import { useState, useEffect } from "react";
import $api from "../api/http";
import { useNavigate } from "react-router-dom";

const Subscription = () => {
  const [loading, setLoading] = useState(false);
  const [paymentId, setPaymentId] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  const navigate = useNavigate();

  // Проверяем статус подписки при загрузке
  useEffect(() => {
    const checkPremiumStatus = async () => {
      try {
        const response = await $api.get("/api/check-premium");
        setIsPremium(response.data.isPremium);
      } catch (error) {
        console.error("Ошибка проверки статуса подписки:", error);
      }
    };

    checkPremiumStatus();
  }, []);

  // Проверяем статус платежа
  useEffect(() => {
    if (!paymentId) return;

    const checkPaymentStatus = async () => {
      try {
        const response = await $api.post("/api/check-payment-status", {
          PaymentId: +paymentId,
        });

        setPaymentStatus(response.data.status);

        if (response.data.status === "CONFIRMED") {
          await activatePremium();
        }
      } catch (error) {
        console.error("Ошибка проверки статуса платежа:", error);
      }
    };

    checkPaymentStatus();
    const interval = setInterval(checkPaymentStatus, 5000);
    return () => clearInterval(interval);
  }, [paymentId]);

  const activatePremium = async () => {
    try {
      await $api.post("/api/activate-premium");
      setIsPremium(true);
      navigate("/"); // редирект после активации
    } catch (error) {
      console.error("Ошибка активации премиума:", error);
    }
  };

  const handlePayment = async () => {
    setLoading(true);

    try {
      const response = await $api.post("/api/create-payment", {
        amount: 199,
        orderId: "order_" + Date.now(),
        description: "Премиум подписка",
        customerEmail: "user@example.com",
        customerPhone: "+79999999999",
      });

      if (response.data.PaymentURL) {
        setPaymentId(response.data.PaymentId);
        window.location.href = response.data.PaymentURL;
      }
    } catch (error) {
      console.error("Ошибка создания платежа:", error);
      alert("Произошла ошибка при создании платежа");
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

        {isPremium || paymentStatus === "CONFIRMED" ? (
          <div className="p-4 bg-green-100 text-green-800 rounded-lg mb-4">
            ✅ Подписка активна!
          </div>
        ) : paymentId ? (
          <div className="p-4 bg-yellow-100 text-yellow-800 rounded-lg mb-4">
            ⌛ Ожидаем подтверждения платежа...
          </div>
        ) : null}

        <button
          onClick={handlePayment}
          disabled={loading || isPremium}
          className={`w-full p-3 rounded-xl ${
            isPremium
              ? "bg-green-600 text-white cursor-default"
              : "bg-blue-600 text-white hover:bg-blue-700"
          } ${loading ? "opacity-50" : ""}`}
        >
          {loading
            ? "Обработка..."
            : isPremium
            ? "Подписка активна"
            : "Оформить подписку за 199 ₽"}
        </button>
      </div>
    </div>
  );
};

export default Subscription;
