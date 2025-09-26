import { type ReactNode } from 'react';
import Header from './Header';
import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
  children: ReactNode;
  userType?: 'user' | 'admin';
}

const Layout = ({ children, userType = 'user' }: LayoutProps) => {
  const { user } = useAuth();

  return (
    <div>
      <Header userType={userType} userName={user?.name || 'Usuário'} />
      <main style={{ padding: '2rem', marginTop: '80px' }}>
        {children}
      </main>
    </div>
  );
};

export default Layout;