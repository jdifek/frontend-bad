/* eslint-disable @typescript-eslint/no-explicit-any */
// tinkoff.d.ts
interface Window {
  TinkoffPay: {
    createPayment: (params: any) => void;
  };
}
