// utils/loadTinkoffScript.ts
export const loadTinkoffScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if ((window as any).TinkoffPay) return resolve();

    const existingScript = document.querySelector(
      'script[src="https://securepay.tinkoff.ru/html/payForm/js/tinkoff_v2.js"]'
    );
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve());
      existingScript.addEventListener("error", () =>
        reject(new Error("Ошибка загрузки скрипта TinkoffPay"))
      );
      return;
    }

    const script = document.createElement("script");
    script.src = "https://securepay.tinkoff.ru/html/payForm/js/tinkoff_v2.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error("Ошибка загрузки скрипта TinkoffPay"));
    document.body.appendChild(script);
  });
};
