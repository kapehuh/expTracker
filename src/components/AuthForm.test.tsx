import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AuthForm from './AuthForm';

// Мокаем модуль firebase/auth
vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
}));

import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

describe('AuthForm', () => {
  const mockNavigate = vi.fn();
  vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
      ...actual,
      useNavigate: () => mockNavigate,
    };
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('переключает режимы', () => {
    render(<AuthForm />, { wrapper: BrowserRouter });
    expect(screen.getByText('Вход')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Зарегистрироваться'));
    expect(screen.getByText('Регистрация')).toBeInTheDocument();
  });

  it('показывает ошибку при пустых полях', async () => {
    render(<AuthForm />, { wrapper: BrowserRouter });
    fireEvent.click(screen.getByRole('button', { name: /войти/i }));
    expect(await screen.findByText('Email и пароль обязательны')).toBeInTheDocument();
  });

  it('вызывает signIn при успешном входе', async () => {
    (signInWithEmailAndPassword as jest.Mock).mockResolvedValueOnce({});
    render(<AuthForm />, { wrapper: BrowserRouter });

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByLabelText(/пароль/i), { target: { value: '123456' } });
    fireEvent.click(screen.getByRole('button', { name: /войти/i }));

    await waitFor(() => {
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(expect.anything(), 'test@test.com', '123456');
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });
});