import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AuthForm from './AuthForm';

// Мокаем модуль firebase/auth
vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
}));

import { signInWithEmailAndPassword } from 'firebase/auth';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});


describe('AuthForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('переключает режимы', () => {
    render(<AuthForm />, { wrapper: BrowserRouter });
    expect(screen.getByText('Вход')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Зарегистрироваться'));
    expect(screen.getByText('Регистрация')).toBeInTheDocument();
  });
});