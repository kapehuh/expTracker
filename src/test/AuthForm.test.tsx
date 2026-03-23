import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import { createUserWithEmailAndPassword } from 'firebase/auth';

// Мокаем модуль firebase/auth
vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
}));

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



  it('показывает ошибку при несовпадении паролей (регистрация)', async () => {
    const user = userEvent.setup();
    vi.mocked(createUserWithEmailAndPassword).mockRejectedValueOnce(new Error('should not be called'));
    render(<AuthForm />, { wrapper: BrowserRouter });

    // Переключаемся в режим регистрации
    await user.click(screen.getByText('Зарегистрироваться'));
    const emInput = await screen.findByTestId('email-input');
    const pswInput = await screen.findByTestId('password-input');
    const confirmPasswordInput = await screen.findByTestId('confirm-password-input');

    // Заполняем поля с разными паролями
    await user.type(emInput, 'test@example.com');
    await user.type(pswInput, 'password123');
    await user.type(confirmPasswordInput, 'password456');

    expect(pswInput).toHaveValue('password123');
    expect(confirmPasswordInput).toHaveValue('password456');

    // Отправляем форму
    await user.click(screen.getByRole('button', { name: 'Зарегистрироваться' }));
    //await user.click(screen.getByText('Зарегистрироваться'));

    // Проверяем, что появилось сообщение об ошибке и Firebase-функция не вызывалась
    expect(await screen.findByText('Пароли не совпадают')).toBeInTheDocument();
    //expect(await screen.findByLabelText('Пароли не совпадают')).toBeInTheDocument();
    expect(createUserWithEmailAndPassword).not.toHaveBeenCalled();
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

