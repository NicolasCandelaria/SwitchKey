import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Layout from './components/Layout';
import PlatformLayout from './components/PlatformLayout';
import ProtectedRoute from './components/ProtectedRoute';
import { CreateProjectProvider } from './context/CreateProjectContext';
import { ProjectsProvider } from './context/ProjectsContext';
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
import Projects from './pages/Projects';
import Drafts from './pages/Drafts';
import Trash from './pages/Trash';
import Wallet from './pages/Wallet';
import ProfileLayout from './pages/Profile/ProfileLayout';
import ProfileBasic from './pages/Profile/ProfileBasic';
import ProfileCompany from './pages/Profile/ProfileCompany';
import ProfileTags from './pages/Profile/ProfileTags';
import ProfileSettings from './pages/Profile/ProfileSettings';
import ProjectWorkspace from './pages/ProjectWorkspace';
import CreateProjectShell from './components/CreateProjectShell';
import CreateProjectBasics from './pages/CreateProject/CreateProjectBasics';
import CreateProjectPathways from './pages/CreateProject/CreateProjectPathways';
import CreateProjectSpecConfirm from './pages/CreateProject/CreateProjectSpecConfirm';

export default function App() {
  return (
    <BrowserRouter>
      <ProjectsProvider>
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
          <Route path="projects" element={<Projects />} />
          <Route path="projects/drafts" element={<Drafts />} />
          <Route path="projects/trash" element={<Trash />} />
          <Route path="wallet" element={<Wallet />} />
          <Route path="profile" element={<ProfileLayout />}>
            <Route index element={<ProfileBasic />} />
            <Route path="company" element={<ProfileCompany />} />
            <Route path="tags" element={<ProfileTags />} />
            <Route path="settings" element={<ProfileSettings />} />
          </Route>
          <Route path="project/:slug" element={<ProjectWorkspace />} />
        </Route>
        <Route
          path="dashboard/create-project"
          element={
            <ProtectedRoute>
              <CreateProjectProvider>
                <CreateProjectShell />
              </CreateProjectProvider>
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="step/1" replace />} />
          <Route path="step/1" element={<CreateProjectBasics />} />
          <Route path="step/2" element={<CreateProjectPathways />} />
          <Route path="spec" element={<CreateProjectSpecConfirm />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </ProjectsProvider>
    </BrowserRouter>
  );
}
