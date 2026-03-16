import React from 'react';
import AuthForm from '../components/AuthForm';

const LoginPage: React.FC = () => {
  return (
    <div style={{ maxWidth: 400, margin: '0 auto', padding: 20 }}>
      <AuthForm />
    </div>
  );
};

export default LoginPage;