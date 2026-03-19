import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { getBudget } from '../services/budgetService';
import { getExpensesForMonth } from '../services/expenseService';
import { type MonthlyBudget, type Expense, type Category, categoryLabels } from '../types';
import CategoryBar from '../components/CategoryBar';
import styles from './Reports.module.css';

const Reports: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [budget, setBudget] = useState<MonthlyBudget | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentYearMonth = new Date().toISOString().slice(0, 7); // "2025-03"

  useEffect(() => {
    if (!currentUser) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const budgetData = await getBudget(currentUser.uid, currentYearMonth);
        const expensesData = await getExpensesForMonth(currentUser.uid, currentYearMonth);
        setBudget(budgetData);
        setExpenses(expensesData);
      } catch (err) {
        console.error('Ошибка загрузки отчёта:', err);
        setError('Не удалось загрузить данные. Попробуйте позже.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser, currentYearMonth]);

  if (!currentUser) {
    return <div>Необходимо авторизоваться</div>;
  }

  if (loading) return <div className={styles.loading}>Загрузка отчёта...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  // Если бюджета нет, создаём "пустой" объект с планами 0
  const planned = budget?.planned || {
    food: 0,
    utilities: 0,
    entertainment: 0,
    services: 0,
    other: 0,
  };

  // Суммы по категориям из расходов
  const actualByCategory: Record<Category, number> = {
    food: 0,
    utilities: 0,
    entertainment: 0,
    services: 0,
    other: 0,
  };
  expenses.forEach((exp) => {
    actualByCategory[exp.category] += exp.amount;
  });

  const categories = Object.keys(categoryLabels) as Category[];

  return (
    <div className={styles.reportsContainer}>
      <header className={styles.header}>
        <h1>Отчёт за {currentYearMonth.replace('-', '.')}</h1>
        <button onClick={() => navigate('/dashboard')} className={styles.backButton}>
          ← Назад к кошельку
        </button>
      </header>

      <div className={styles.summary}>
        <p>Всего расходов: {expenses.reduce((sum, e) => sum + e.amount, 0)} ₽</p>
        <p>Запланировано: {Object.values(planned).reduce((a, b) => a + b, 0)} ₽</p>
      </div>

      <div className={styles.chartSection}>
        {categories.map((cat) => (
          <CategoryBar
            key={cat}
            category={cat}
            planned={planned[cat]}
            actual={actualByCategory[cat]}
          />
        ))}
      </div>
    </div>
  );
};

export default Reports;
