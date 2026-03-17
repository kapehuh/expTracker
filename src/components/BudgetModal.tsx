import React, { useState } from 'react';
import { type Category, categoryLabels } from '../types';

interface BudgetModalProps {
  initialIncome: number;
  initialPlanned: Record<Category, number>;
  onSave: (income: number, planned: Record<Category, number>) => void;
  onClose: () => void;
}

const BudgetModal: React.FC<BudgetModalProps> = ({ initialIncome, initialPlanned, onSave, onClose }) => {
  const [income, setIncome] = useState(initialIncome.toString());
  const [planned, setPlanned] = useState<Record<Category, string>>(() => {
    const obj: any = {};
    (Object.keys(initialPlanned) as Category[]).forEach(key => {
      obj[key] = initialPlanned[key].toString();
    });
    return obj;
  });

  const handleSave = () => {
    const numIncome = parseFloat(income);
    if (isNaN(numIncome) || numIncome < 0) {
      alert('Доход должен быть неотрицательным числом');
      return;
    }
    const numPlanned = {} as Record<Category, number>;
    for (const key of Object.keys(planned) as Category[]) {
      const val = parseFloat(planned[key]);
      if (isNaN(val) || val < 0) {
        alert(`План по категории ${categoryLabels[key]} должен быть числом >= 0`);
        return;
      }
      numPlanned[key] = val;
    }
    onSave(numIncome, numPlanned);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Редактирование бюджета на месяц</h2>
        <div>
          <label>Доход на месяц (₽):</label>
          <input
            type="number"
            step="100"
            min="0"
            value={income}
            onChange={(e) => setIncome(e.target.value)}
          />
        </div>
        <h3>Планы по категориям</h3>
        {(Object.entries(categoryLabels) as [Category, string][]).map(([cat, label]) => (
          <div key={cat}>
            <label>{label}:</label>
            <input
              type="number"
              step="100"
              min="0"
              value={planned[cat]}
              onChange={(e) => setPlanned({ ...planned, [cat]: e.target.value })}
            />
          </div>
        ))}
        <div className="modal-actions">
          <button onClick={handleSave}>Сохранить</button>
          <button onClick={onClose}>Отмена</button>
        </div>
      </div>
    </div>
  );
};

export default BudgetModal;