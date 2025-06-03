const Subscription = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-blue-50 p-6 rounded-2xl shadow-md text-center">
        <h1 className="text-3xl font-bold text-blue-900 mb-4">Подписка на ИИ-нутрициолога</h1>
        <p className="text-gray-700 mb-6">
          Получите полный доступ ко всем рекомендациям по питанию, анализу продуктов и персонализированным планам здоровья от нашего ИИ-нутрициолога всего за <strong>199 ₽ в месяц</strong>.
        </p>
        <button
          className="w-full p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
          onClick={() => alert("Здесь будет логика оплаты")}
        >
          Оформить подписку
        </button>
      </div>
    </div>
  );
};

export default Subscription;
