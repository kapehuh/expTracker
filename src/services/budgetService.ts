import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { type MonthlyBudget } from '../types';

// Получить бюджет на месяц для конкретного пользователя
export const getBudget = async (userId: string, yearMonth: string): Promise<MonthlyBudget | null> => {
  const docRef = doc(db, 'budgets', `${userId}_${yearMonth}`);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as MonthlyBudget;
  }
  return null;
};

// Создать или обновить бюджет
export const setBudget = async (budget: MonthlyBudget): Promise<void> => {
  const docRef = doc(db, 'budgets', `${budget.userId}_${budget.yearMonth}`);
  await setDoc(docRef, budget, { merge: true });
};