import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Header.css';

interface HeaderProps {
  userType?: 'user' | 'admin';
  userName?: string;
}

const Header = ({ userName = 'Usuário' }: HeaderProps) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <h1 className="logo" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>Kushon</h1>
        </div>
        
        <div className="header-right">
          <span className="welcome-text">Olá, {userName}</span>
          <button onClick={handleLogout} className="logout-btn">
            Sair
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;