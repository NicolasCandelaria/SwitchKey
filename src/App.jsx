import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Layout from './components/Layout';
import PlatformLayout from './components/PlatformLayout';
import ProtectedRoute from './components/ProtectedRoute';
import { CreateProjectProvider } from './context/CreateProjectContext';
import Home from './pages/Home';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import SignUpVerifyEmail from './pages/SignUpVerifyEmail';
import SignUpPassword from './pages/SignUpPassword';
import SignUpSuccess from './pages/SignUpSuccess';
import Terms from './pages/Terms';
import Dashboard from './pages/Dashboard';
import ProjectWorkspace from './pages/ProjectWorkspace';
import CreateProjectLayout from './pages/CreateProject/CreateProjectLayout';
import CreateProjectSuccess from './pages/CreateProject/CreateProjectSuccess';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="contact" element={<Contact />} />
          <Route path="sign-in" element={<SignIn />} />
          <Route path="sign-up" element={<SignUp />} />
          <Route path="sign-up/verify-email" element={<SignUpVerifyEmail />} />
          <Route path="sign-up/password" element={<SignUpPassword />} />
          <Route path="sign-up/terms" element={<Terms />} />
          <Route path="sign-up/success" element={<SignUpSuccess />} />
          <Route path="privacy" element={<Privacy />} />
        </Route>
        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <PlatformLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="project/:slug" element={<ProjectWorkspace />} />
          <Route path="create-project" element={<CreateProjectProvider><Outlet /></CreateProjectProvider>}>
            <Route index element={<Navigate to="step/1" replace />} />
            <Route path="step/:step" element={<CreateProjectLayout />} />
            <Route path="success" element={<CreateProjectSuccess />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
