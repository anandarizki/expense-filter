import { CONFIG } from "./config";

export const isAmount = (label: string) =>
  label.toLowerCase().includes(CONFIG.amountColumn);

export const formatCurrency = (amount: number) =>
  amount.toLocaleString(CONFIG.locale, {
    style: "currency",
    currency: CONFIG.currency,
  });
