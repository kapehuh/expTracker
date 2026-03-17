import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import Reports from './pages/Reports';
import { PrivateRoute } from './components/PrivateRoute';

function App() {
  const { currentUser } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        {/* Если пользователь уже залогинен, с главной (/login) отправляем на /dashboard */}
        <Route path="/login" element={
          currentUser ? <Navigate to="/dashboard" replace /> : <LoginPage />
        } />
        {/* Защищённый маршрут */}
        <Route path="/dashboard" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />
        {/* Редирект с корня на логин (или дашборд, если уже залогинен) */}
        <Route path="/" element={<Navigate to={currentUser ? "/dashboard" : "/login"} replace />} />
        <Route path="/reports" element={
        <PrivateRoute>
          <Reports />
        </PrivateRoute>
      } />
      </Routes>
    </BrowserRouter>
  );
}

export default App
