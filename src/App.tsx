import { BrowserRouter, Route, Outlet, Routes, Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import WrongURL from './pages/wrongUrl.page';
import Index from './pages/landingPage.page';
import RegisterPage from './pages/register.page';
import LoginPage from './pages/login.page';
import LayoutMain from './layouts/layoutMain';
import VerifyPage from './pages/verify.page';
import Dashboard from './pages/dashboard.page';
import VerifyAuth from './components/verify/verifyAuth.component';
import LogoutPage from './pages/logout.page';
import ProfilePage from './pages/profile.page';
import AccountPage from './pages/account.page';


function App() {

  const AlreadyLogin = ({ ...props }) => {
    if (Cookies.get('token') !== undefined) {
      return <Navigate to="/dashboard" />;
    } else {
      return <Outlet />;
    }
  };

  const NotLoginYet = () => {
    if (Cookies.get('user_id') === undefined) {
      return <Navigate to="/login" />;
    }
    return <Outlet />;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route index path="/" element={<Index />} />

        <Route element={<NotLoginYet />}>
          <Route element={<LayoutMain />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/logout" element={<LogoutPage />} />
          </Route>
        </Route>

        <Route element={<AlreadyLogin />}>
          <Route element={<LayoutMain />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/verify/:email" element={<VerifyPage />} />
            <Route path="/verify/auth/:email/:token" element={<VerifyAuth />} />
          </Route>
        </Route>

        {/* handle wrong url */}
        <Route path="*" element={<WrongURL />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
