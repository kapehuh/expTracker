import React, { useState } from 'react';
import { type Category, categoryLabels } from '../types';

interface ExpenseFormProps {
  initialData?: {
    amount: number;
    category: Category;
    description: string;
    date: string;
  };
  onSubmit: (data: {
    amount: number;
    category: Category;
    description: string;
    date: string;
  }) => void;
  onCancel?: () => void;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [amount, setAmount] = useState(initialData?.amount.toString() || '');
  const [category, setCategory] = useState<Category>(initialData?.category || 'food');
  const [description, setDescription] = useState(initialData?.description || '');
  const [date, setDate] = useState(initialData?.date || new Date().toISOString().slice(0, 10));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      alert('Сумма должна быть положительным числом');
      return;
    }
    onSubmit({
      amount: numAmount,
      category,
      description,
      date,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="expense-form">
      <div>
        <label>Сумма (₽):</label>
        <input
          type="number"
          step="0.01"
          min="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Категория:</label>
        <select value={category} onChange={(e) => setCategory(e.target.value as Category)}>
          {(Object.entries(categoryLabels) as [Category, string][]).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Описание (необязательно):</label>
        <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div>
        <label>Дата:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          max={new Date().toISOString().slice(0, 10)} // не даём выбирать будущие даты
        />
      </div>
      <div className="form-actions">
        <button type="submit">Сохранить</button>
        {onCancel && (
          <button type="button" onClick={onCancel}>
            Отмена
          </button>
        )}
      </div>
    </form>
  );
};

export default ExpenseForm;
