import { 
  collection, addDoc, updateDoc, deleteDoc, doc, 
  query, where, getDocs, orderBy, Timestamp, limit 
} from 'firebase/firestore';
import { db } from '../firebase';
import { type Expense } from '../types';

// Добавить расход
export const addExpense = async (expense: Omit<Expense, 'id' | 'createdAt'>) => {
  const colRef = collection(db, 'expenses');
  const docRef = await addDoc(colRef, {
    ...expense,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
};

// Получить расходы пользователя за месяц (по дате)
export const getExpensesForMonth = async (userId: string, yearMonth: string): Promise<Expense[]> => {
  const colRef = collection(db, 'expenses');
  // Преобразуем yearMonth в начальную и конечную даты
  const startDate = `${yearMonth}-01`;
  const endDate = `${yearMonth}-31`; // простой вариант, но лучше вычислить последний день
  const q = query(
    colRef,
    where('userId', '==', userId),
    where('date', '>=', startDate),
    where('date', '<=', endDate),
    orderBy('date', 'desc')
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Expense));
};

// Получить последние N расходов (без ограничения по месяцу)
export const getRecentExpenses = async (userId: string, limitCount: number = 7): Promise<Expense[]> => {
  const colRef = collection(db, 'expenses');
  const q = query(
    colRef,
    where('userId', '==', userId),
    orderBy('date', 'desc'),
    limit(limitCount)
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Expense));
};

// Обновить расход
export const updateExpense = async (expenseId: string, data: Partial<Expense>) => {
  const docRef = doc(db, 'expenses', expenseId);
  await updateDoc(docRef, data);
};

// Удалить расход
export const deleteExpense = async (expenseId: string) => {
  const docRef = doc(db, 'expenses', expenseId);
  await deleteDoc(docRef);
};