import React, { useState } from 'react';
import { auth } from '../firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  type AuthError,
} from 'firebase/auth';
import styles from '../css/AuthForm.module.css';
import { useNavigate } from 'react-router-dom';

const AuthForm: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Обработчики изменений полей
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPassword(e.target.value);
  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setConfirmPassword(e.target.value);

  // Переключение режима
  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError(null); // сбрасываем ошибку при переключении
    setPassword('');
    setConfirmPassword('');
  };

  // Валидация перед отправкой
  const validate = (): boolean => {
    if (!email.trim() || !password.trim()) {
      setError('Email и пароль обязательны');
      return false;
    }
    if (!isLogin) {
      if (password.length < 6) {
        setError('Пароль должен содержать не менее 6 символов');
        return false;
      }
      if (password !== confirmPassword) {
        setError('Пароли не совпадают');
        return false;
      }
    }
    return true;
  };

  // Обработка отправки формы
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setError(null);

    try {
      if (isLogin) {
        // Вход
        await signInWithEmailAndPassword(auth, email, password);
        navigate('/dashboard');
        console.log('Успешный вход');
      } else {
        // Регистрация
        await createUserWithEmailAndPassword(auth, email, password);
        navigate('/dashboard');
        console.log('Успешная регистрация');
      }
    } catch (err) {
      // Обработка ошибок Firebase
      const firebaseError = err as AuthError;
      let errorMessage = 'Произошла ошибка. Попробуйте снова.';
      switch (firebaseError.code) {
        case 'auth/user-not-found':
          errorMessage = 'Пользователь с таким email не найден.';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Неверный пароль.';
          break;
        case 'auth/email-already-in-use':
          errorMessage = 'Этот email уже зарегистрирован.';
          break;
        case 'auth/weak-password':
          errorMessage = 'Пароль слишком слабый (минимум 6 символов).';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Некорректный email.';
          break;
        default:
          errorMessage = firebaseError.message;
      }
      setError(errorMessage);
    }
  };

  return (
    <div className={styles.authContainer}>
      <h2 className={styles.title}>{isLogin ? 'Вход' : 'Регистрация'}</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label className={styles.label}>Email:</label>
          <input
            type="email"
            className={styles.input}
            value={email}
            onChange={handleEmailChange}
            required
            data-testid="email-input"
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Пароль:</label>
          <input
            type="password"
            className={styles.input}
            value={password}
            onChange={handlePasswordChange}
            required
            data-testid="password-input"
          />
        </div>
        {!isLogin && (
          <div className={styles.field}>
            <label className={styles.label}>Подтверждение пароля:</label>
            <input
              type="password"
              className={styles.input}
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              required
              data-testid="confirm-password-input"
            />
          </div>
        )}
        {error && <p className={styles.error}>{error}</p>}
        <button type="submit" className={styles.button}>
          {isLogin ? 'Войти' : 'Зарегистрироваться'}
        </button>
      </form>
      <p>
        {isLogin ? 'Нет аккаунта? ' : 'Уже есть аккаунт? '}
        <button
          onClick={toggleMode}
          style={{ background: 'none', border: 'none', color: 'blue', cursor: 'pointer' }}
        >
          {isLogin ? 'Зарегистрироваться' : 'Войти'}
        </button>
      </p>
    </div>
  );
};

export default AuthForm;
