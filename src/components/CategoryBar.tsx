import React from 'react';
import { categoryLabels } from '../types';
import styles from '../css/CategoryBar.module.css';

interface CategoryBarProps {
  category: keyof typeof categoryLabels;
  planned: number;
  actual: number;
}

const CategoryBar: React.FC<CategoryBarProps> = ({ category, planned, actual }) => {
  const label = categoryLabels[category];
  // Если план = 0, а факт > 0, то показываем красный столбец на всю ширину (превышение)
  const hasPlan = planned > 0;
  const percentOfPlan = hasPlan ? Math.min(actual, planned) / planned : 0;
  const excessPercent = hasPlan && actual > planned ? (actual - planned) / planned : 0;
  const excessWidth = excessPercent * 100;
  const fillWidth = percentOfPlan * 100;

  return (
    <div className={styles.categoryRow}>
      <div className={styles.categoryLabel}>{label}</div>
      <div className={styles.barContainer}>
        {/* Серый фон — весь план (всегда отображается, даже если план 0 — нулевая ширина) */}
        <div className={styles.planBar} style={{ width: hasPlan ? '100%' : '0%' }}>
          {/* Основная часть (факт в пределах плана) */}
          {fillWidth > 0 && <div className={styles.actualBar} style={{ width: `${fillWidth}%` }} />}
          {/* Превышение (если есть) */}
          {excessWidth > 0 && (
            <div
              className={styles.excessBar}
              style={{ width: `${excessWidth}%`, left: `${fillWidth}%` }}
            />
          )}
        </div>
        {/* Если план = 0, но факт > 0, показываем отдельный красный бар на всю ширину */}
        {!hasPlan && actual > 0 && (
          <div className={styles.excessBarFull} style={{ width: '100%' }} />
        )}
      </div>
      <div className={styles.numbers}>
        {actual} ₽ / {planned} ₽
      </div>
    </div>
  );
};

export default CategoryBar;
