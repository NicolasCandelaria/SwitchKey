import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import PlatformNav from './PlatformNav';
import './PlatformLayout.css';

export default function PlatformLayout() {
  return (
    <div className="platform-layout">
      <Sidebar />
      <div className="platform-main">
        <PlatformNav />
        <div className="platform-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
