import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import AuthForm from './AuthForm';

// Мокаем модуль firebase/auth
vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
}));
import { signInWithEmailAndPassword } from 'firebase/auth';
// Мок navigate
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

  it('переключает режимы с входа на регистрацию', async () => {
    const user = userEvent.setup();
    render(<AuthForm/>, { wrapper: BrowserRouter });
    expect(screen.queryByRole('heading', { name: /вход/i})).toBeInTheDocument();
    expect(screen.queryByLabelText(/подтверждение пароля/i)).not.toBeInTheDocument();
    await user.click(screen.getByText('Зарегистрироваться'));
    expect(screen.getByRole('heading', { name: /регистрация/i })).toBeInTheDocument(); 
    expect(screen.getByText(/подтверждение пароля/i)).toBeInTheDocument(); 
  });


  it('выполняет вход при корректных данных', async () => {
    // const user = userEvent.setup();
    // // Настраиваем мок signInWithEmailAndPassword на успешное выполнение
    // vi.mocked(signInWithEmailAndPassword).mockResolvedValueOnce({ user: {} } as any);

    // render(<AuthForm />, { wrapper: BrowserRouter });
    // screen.debug();

    // // Заполняем поля
    // await user.type(screen.getByText(/Email/i), 'test@example.com');
    // await user.type(screen.getByText(/Пароль/i), 'password123');
    // screen.debug();

    // // Отправляем форму
    // await user.click(screen.getByRole('button', { name: /войти/i }));
    
    // await waitFor(() => {
    //   expect(signInWithEmailAndPassword).toHaveBeenCalledTimes(1);
    // });
    // expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
    //   expect.anything(),        // объект auth (мы не проверяем точное значение)
    //   'test@example.com',
    //   'password123'
    // );

    // Проверяем, что после успешного входа произошёл переход на /dashboard
    //expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });
});

