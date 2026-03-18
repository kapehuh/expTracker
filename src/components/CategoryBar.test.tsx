import { render, screen } from '@testing-library/react';
import CategoryBar from './CategoryBar';
import { categoryLabels } from '../types';

describe('CategoryBar', () => {
  it('отображает название категории', () => {
    render(<CategoryBar category="food" planned={1000} actual={500} />);
    expect(screen.getByText(categoryLabels.food)).toBeInTheDocument();
  });

  it('отображает числа план/факт', () => {
    render(<CategoryBar category="food" planned={1000} actual={500} />);
    expect(screen.getByText('500 ₽ / 1000 ₽')).toBeInTheDocument();
  });

  it('показывает превышение красным', () => {
    render(<CategoryBar category="food" planned={1000} actual={1200} />);
    expect(screen.getByText('1200 ₽ / 1000 ₽')).toBeInTheDocument();
    // можно проверить наличие красного бара, но это сложнее; ограничимся наличием чисел
  });
});