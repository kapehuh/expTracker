// Категории расходов (5)
export type Category = 'food' | 'utilities' | 'entertainment' | 'services' | 'other';

export const categoryLabels: Record<Category, string> = {
  food: '🍎 Продукты',
  utilities: '🏠 Обязательные платежи',
  entertainment: '🎉 Развлечения',
  services: '💇 Услуги',
  other: '📦 Прочее',
};

// Расход
export interface Expense {
  id: string;            // ID документа
  userId: string;        // uid пользователя
  amount: number;        // сумма (положительное число)
  category: Category;    // категория
  description?: string;  // описание (необязательно)
  date: string;          // дата в формате YYYY-MM-DD
  createdAt: any;        // временная метка Firestore (serverTimestamp)
}

// Бюджет на месяц (документ в коллекции budgets)
export interface MonthlyBudget {
  id?: string;           // ID документа (`${userId}_${yearMonth}`)
  userId: string;
  yearMonth: string;     // например "2025-03"
  income: number;        // доход на месяц
  planned: Record<Category, number>; // запланированные расходы по категориям
}