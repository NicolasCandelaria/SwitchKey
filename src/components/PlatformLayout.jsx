import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import './PlatformLayout.css';

export default function PlatformLayout() {
  return (
    <div className="platform-layout">
      <Sidebar />
      <div className="platform-main">
        <Outlet />
      </div>
    </div>
  );
}
