import React from 'react';
import AuthForm from '../components/AuthForm';
import styles from './LoginPage.module.css';

const LoginPage: React.FC = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Добро пожаловать!</h1>
      <AuthForm />
    </div>
  );
};

export default LoginPage;