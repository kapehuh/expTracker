import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { getBudget, setBudget } from '../services/budgetService';
import { addExpense, getExpensesForMonth, getRecentExpenses, updateExpense, deleteExpense } from '../services/expenseService';
import { type Category, type Expense, type MonthlyBudget, categoryLabels } from '../types';
import ExpenseForm from '../components/ExpenseForm';
import BudgetModal from '../components/BudgetModal';
import styles from './Dashboard.module.css';

const Dashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [budget, setBudgetState] = useState<MonthlyBudget | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [recentExpenses, setRecentExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const currentYearMonth = new Date().toISOString().slice(0, 7); // "2025-03"

  useEffect(() => {
    if (!currentUser) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        // Загружаем бюджет на текущий месяц
        let budgetData = await getBudget(currentUser.uid, currentYearMonth);
        if (!budgetData) {
          // Создаём бюджет по умолчанию
          const defaultPlanned: Record<Category, number> = {
            food: 0,
            utilities: 0,
            entertainment: 0,
            services: 0,
            other: 0,
          };
          budgetData = {
            userId: currentUser.uid,
            yearMonth: currentYearMonth,
            income: 0,
            planned: defaultPlanned,
          };
          await setBudget(budgetData);
        }
        setBudgetState(budgetData);

        // Загружаем расходы за этот месяц
        const monthExpenses = await getExpensesForMonth(currentUser.uid, currentYearMonth);
        setExpenses(monthExpenses);

        // Загружаем последние 7 расходов (вне зависимости от месяца)
        const recent = await getRecentExpenses(currentUser.uid, 7);
        setRecentExpenses(recent);
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentUser, currentYearMonth]);

  // Функция для вычисления остатка
  const calculateRemaining = (): number => {
    if (!budget) return 0;
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    return budget.income - totalExpenses;
  };

  // Функция для получения суммы расходов по категории
  const getCategoryTotal = (category: Category): number => {
    return expenses
      .filter(e => e.category === category)
      .reduce((sum, e) => sum + e.amount, 0);
  };

  // Добавление расхода
  const handleAddExpense = async (data: { amount: number; category: Category; description: string; date: string }) => {
    if (!currentUser) return;
    try {
      await addExpense({
        userId: currentUser.uid,
        ...data,
      });
      // Обновляем списки
      const monthExpenses = await getExpensesForMonth(currentUser.uid, currentYearMonth);
      setExpenses(monthExpenses);
      const recent = await getRecentExpenses(currentUser.uid, 7);
      setRecentExpenses(recent);
    } catch (error) {
      console.error('Ошибка добавления расхода:', error);
    }
  };

  // Редактирование расхода
  const handleUpdateExpense = async (data: { amount: number; category: Category; description: string; date: string }) => {
    if (!currentUser) return;
    if (!editingExpense) return;
    try {
      await updateExpense(editingExpense.id, data);
      setEditingExpense(null);
      // Обновляем списки
      const monthExpenses = await getExpensesForMonth(currentUser.uid, currentYearMonth);
      setExpenses(monthExpenses);
      const recent = await getRecentExpenses(currentUser.uid, 7);
      setRecentExpenses(recent);
    } catch (error) {
      console.error('Ошибка обновления расхода:', error);
    }
  };

  // Удаление расхода
  const handleDeleteExpense = async (expenseId: string) => {
    if (!currentUser) return;
    if (!window.confirm('Удалить расход?')) return;
    try {
      await deleteExpense(expenseId);
      // Обновляем списки
      const monthExpenses = await getExpensesForMonth(currentUser.uid, currentYearMonth);
      setExpenses(monthExpenses);
      const recent = await getRecentExpenses(currentUser.uid, 7);
      setRecentExpenses(recent);
      if (editingExpense?.id === expenseId) setEditingExpense(null);
    } catch (error) {
      console.error('Ошибка удаления расхода:', error);
    }
  };

  // Сохранение бюджета
  const handleSaveBudget = async (income: number, planned: Record<Category, number>) => {
    if (!currentUser || !budget) return;
    try {
      const updatedBudget: MonthlyBudget = {
        ...budget,
        income,
        planned,
      };
      await setBudget(updatedBudget);
      setBudgetState(updatedBudget);
      setShowBudgetModal(false);
    } catch (error) {
      console.error('Ошибка сохранения бюджета:', error);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  if (loading) return <div>Загрузка...</div>;
  if (!currentUser) return <Navigate to="/login" replace />;

  const remaining = calculateRemaining();

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div>
          <h1>Добро пожаловать, {currentUser.email}</h1>
          <button onClick={handleLogout}>Выйти</button>
        </div>
        <nav>
          <button onClick={() => navigate('/reports')}>Отчёты</button>
        </nav>
      </header>

      <section className={styles.budgetSection}>
        <h2>Бюджет на {currentYearMonth.replace('-', '.')}</h2>
        <div className={styles.budgetInfo}>
          <p><strong>Доход:</strong> {budget?.income} ₽</p>
          <p><strong>Остаток:</strong> {remaining} ₽</p>
          <p><strong>Накопления (всего):</strong> 0 ₽ (пока не реализовано)</p>
          <button onClick={() => setShowBudgetModal(true)}>✎ Редактировать бюджет</button>
        </div>
        <div className={styles.categoryPlans}>
          {(Object.entries(categoryLabels) as [Category, string][]).map(([cat, label]) => (
            <div key={cat}>
              <span>{label}:</span>
              <span> план {budget?.planned[cat]} ₽</span>
              <span> | факт {getCategoryTotal(cat)} ₽</span>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.addExpenseSection}>
        <h3>Добавить расход</h3>
        <ExpenseForm onSubmit={handleAddExpense} />
      </section>

      <section className={styles.recentExpensesSection}>
        <h3>Последние расходы</h3>
        {recentExpenses.length === 0 ? (
          <p>Пока нет расходов</p>
        ) : (
          <table className={styles.expensesTable}>
            <thead>
              <tr><th>Дата</th><th>Категория</th><th>Сумма</th><th>Описание</th><th>Действия</th></tr>
            </thead>
            <tbody>
              {recentExpenses.map(exp => (
                <tr key={exp.id} onClick={() => setEditingExpense(exp)} style={{ cursor: 'pointer' }}>
                  <td>{exp.date}</td>
                  <td>{categoryLabels[exp.category]}</td>
                  <td>{exp.amount} ₽</td>
                  <td>{exp.description || '—'}</td>
                  <td>
                    <button onClick={(e) => { e.stopPropagation(); handleDeleteExpense(exp.id); }}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {showBudgetModal && budget && (
        <BudgetModal
          initialIncome={budget.income}
          initialPlanned={budget.planned}
          onSave={handleSaveBudget}
          onClose={() => setShowBudgetModal(false)}
        />
      )}

      {editingExpense && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>Редактировать расход</h3>
            <ExpenseForm
              initialData={{
                amount: editingExpense.amount,
                category: editingExpense.category,
                description: editingExpense.description || '',
                date: editingExpense.date,
              }}
              onSubmit={handleUpdateExpense}
              onCancel={() => setEditingExpense(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;