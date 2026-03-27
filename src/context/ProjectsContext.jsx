import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { fetchProjects, createProject as apiCreateProject, deleteProject as apiDeleteProject } from '../lib/projectsApi';

const STORAGE_KEY = 'switchkey_projects';

function loadProjectsFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveProjectsToStorage(projects) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch (_) {}
}

function slugify(text) {
  return String(text)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

function buildProject(formData, options = {}) {
  const name = formData.projectName?.trim() || 'Project';
  const slug = slugify(name);
  const now = new Date().toISOString();
  const ownerInitials = options.ownerInitials != null ? options.ownerInitials : null;
  const participants = ownerInitials ? [ownerInitials] : [];
  return {
    id: `proj_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    slug,
    projectName: name,
    productDescription: formData.productDescription ?? '',
    primaryCategory: formData.primaryCategory ?? '',
    secondaryCategory: formData.secondaryCategory ?? '',
    productCategory: formData.productCategory ?? '',
    scenarioTags: Array.isArray(formData.scenarioTags) ? formData.scenarioTags : [],
    selectedPathways: Array.isArray(formData.selectedPathways) ? formData.selectedPathways : [],
    participants,
    createdAt: now,
    updatedAt: now,
    status: 'draft',
  };
}

const ProjectsContext = createContext(null);

export function ProjectsProvider({ children }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiAvailable, setApiAvailable] = useState(false);

  // Load projects on mount: try API first, fallback to localStorage
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const result = await fetchProjects();
      if (cancelled) return;
      if (result.ok) {
        setProjects(result.data);
        setApiAvailable(true);
      } else {
        setProjects(loadProjectsFromStorage());
        setApiAvailable(false);
      }
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, []);

  // Persist to localStorage when offline (so refresh keeps data)
  useEffect(() => {
    if (!apiAvailable) saveProjectsToStorage(projects);
  }, [apiAvailable, projects]);

  const addProject = useCallback(async (formData, options = {}) => {
    const project = buildProject(formData, options);
    const result = await apiCreateProject(formData, options);
    if (result.ok) {
      setProjects((prev) => [result.data, ...prev]);
      setApiAvailable(true);
      return result.data;
    }
    // Fallback: add locally and persist
    setProjects((prev) => [project, ...prev]);
    return project;
  }, []);

  const updateProjectStatus = useCallback((slug, status) => {
    const now = new Date().toISOString();
    setProjects((prev) =>
      prev.map((p) =>
        p.slug === slug
          ? { ...p, status, updatedAt: now }
          : p
      )
    );
  }, []);

  // Generic project updater for nested UI state (e.g. role spec alignments, requests).
  const updateProject = useCallback((slug, updater) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.slug !== slug) return p;
        return updater(p);
      })
    );
  }, []);

  const getProjectBySlug = useCallback((slug) => {
    return projects.find((p) => p.slug === slug) ?? null;
  }, [projects]);

  const deleteProject = useCallback(async (slug) => {
    const result = await apiDeleteProject(slug);
    if (result.ok) {
      setProjects((prev) => prev.filter((p) => p.slug !== slug));
      return;
    }
    // Fallback: remove from local state
    setProjects((prev) => prev.filter((p) => p.slug !== slug));
  }, []);

  return (
    <ProjectsContext.Provider
      value={{
        projects,
        loading,
        apiAvailable,
        addProject,
        getProjectBySlug,
        deleteProject,
        updateProjectStatus,
        updateProject,
      }}
    >
      {children}
    </ProjectsContext.Provider>
  );
}

export function useProjects() {
  const ctx = useContext(ProjectsContext);
  if (!ctx) throw new Error('useProjects must be used within ProjectsProvider');
  return ctx;
}
