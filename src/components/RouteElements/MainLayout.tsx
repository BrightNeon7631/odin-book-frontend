import { Outlet } from 'react-router-dom';
import AuthContextProvider from '../../provider/authProvider';

export default function MainLayuot() {
  return (
    <AuthContextProvider>
      <Outlet />
    </AuthContextProvider>
  );
}
