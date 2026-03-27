import { createContext, useContext, useState, useCallback } from 'react';

const STEPS = [
  { num: 1, label: 'Project Basics' },
  { num: 2, label: 'Requirements' },
  { num: 3, label: 'Project Details' },
  { num: 4, label: 'Payment' },
  { num: 5, label: 'Vendor Matching' },
  { num: 6, label: 'Agreement' },
];

const defaultForm = {
  // Step 1
  projectName: '',
  productDescription: '',
  primaryCategory: '',
  secondaryCategory: '',
  productCategory: '',
  scenarioTags: [],
  selectedPathways: [],
  // Step 2
  roles: {
    'Industrial Designer': 0,
    'Mechanical Designer': 0,
    'Electrical Engineer': 0,
    'Package Designer': 0,
  },
  preferredVendors: [],
  // Step 3
  materialMain: '',
  materialSecondary: '',
  requiresRemote: '',
  includesSpeaker: '',
  additionalNotes: '',
  // Step 4+ (payment simulated)
  paymentComplete: false,
  agreementSigned: false,
};

const CreateProjectContext = createContext(null);

export function CreateProjectProvider({ children }) {
  const [formData, setFormData] = useState(defaultForm);

  const update = useCallback((key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }, []);

  const updateRoles = useCallback((role, quantity) => {
    setFormData((prev) => ({
      ...prev,
      roles: { ...prev.roles, [role]: Math.max(0, quantity) },
    }));
  }, []);

  const addPreferredVendor = useCallback((name, email) => {
    setFormData((prev) => ({
      ...prev,
      preferredVendors: [...prev.preferredVendors, { name, email }],
    }));
  }, []);

  const removePreferredVendor = useCallback((index) => {
    setFormData((prev) => ({
      ...prev,
      preferredVendors: prev.preferredVendors.filter((_, i) => i !== index),
    }));
  }, []);

  const reset = useCallback(() => {
    setFormData(defaultForm);
  }, []);

  return (
    <CreateProjectContext.Provider
      value={{
        formData,
        setFormData,
        update,
        updateRoles,
        addPreferredVendor,
        removePreferredVendor,
        reset,
        steps: STEPS,
      }}
    >
      {children}
    </CreateProjectContext.Provider>
  );
}

export function useCreateProject() {
  const ctx = useContext(CreateProjectContext);
  if (!ctx) throw new Error('useCreateProject must be used within CreateProjectProvider');
  return ctx;
}
