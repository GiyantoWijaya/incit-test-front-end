import { Outlet } from 'react-router-dom';
import NavbarMain from '../components/navbar/navbar.component';

const LayoutMain= () => {
  return (
    <>
      <NavbarMain />
      <Outlet />
    </>
  );
};

export default LayoutMain;