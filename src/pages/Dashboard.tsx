import React from 'react';
import { useAuth } from '../context/AuthContext';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Ошибка выхода:', error);
    }
  };

  return (
    <div>
      <h1>Добро пожаловать, {currentUser?.email}!</h1>
      <p>Это ваш личный кабинет (пока пустой).</p>
      <button onClick={handleLogout}>Выйти</button>
    </div>
  );
};

export default Dashboard;