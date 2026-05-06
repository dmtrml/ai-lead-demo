import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "AI-ассистент для обработки заявок — Демо",
  description:
    "Демонстрация AI-автоматизации бизнес-процессов: клиент оставляет заявку → AI анализирует → данные в таблицу → менеджер получает уведомление и черновик ответа.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${inter.className} h-full antialiased`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
