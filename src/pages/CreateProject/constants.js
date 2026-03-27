export const PRIMARY_CATEGORIES = [
  'Consumer Electronics',
  'Home Appliances',
  'Wearables',
  'Outdoor Equipment',
  'Toys',
];

export const SECONDARY_BY_PRIMARY = {
  'Consumer Electronics': ['LED Lighting', 'Bluetooth Audio', 'Smart Home'],
  'Home Appliances': ['Kitchen Tools', 'Smart Home'],
  'Wearables': ['Bluetooth Audio', 'Smart Home'],
  'Outdoor Equipment': ['LED Lighting'],
  'Toys': ['LED Lighting', 'Bluetooth Audio'],
};

export const PRODUCT_CATEGORIES = [
  'Waterproof Karaoke Microphone',
  'Bluetooth Speaker',
  'Smart Home Hub',
  'Wireless Earbuds',
  'Portable Power Bank',
  'LED Desk Lamp',
  'Fitness Tracker',
  'Action Camera',
  'Other',
];

export const ROLES = [
  'Industrial Designer',
  'Mechanical Designer',
  'Electrical Engineer',
  'Package Designer',
];

export const MATERIAL_OPTIONS = ['Plastic', 'Aluminum', 'Steel', 'Other'];

export const SCENARIO_TAGS = [
  'New product launch',
  'Redesign / refresh',
  'Prototype / MVP',
  'Compliance / certification',
  'Cost reduction',
  'Scale to production',
  'Partnership / white-label',
  'Quick turnaround',
];

/** Pathway progress items. Categories/scenarios determine which are suggested. */
export const PATHWAY_ITEMS = [
  { id: 'concept-research', label: 'Concept & market research', categories: ['*'] },
  { id: 'industrial-design', label: 'Industrial design', categories: ['Consumer Electronics', 'Wearables', 'Toys', 'Outdoor Equipment', 'Home Appliances'] },
  { id: 'mechanical', label: 'Mechanical engineering', categories: ['Consumer Electronics', 'Wearables', 'Outdoor Equipment', 'Home Appliances', 'Toys'] },
  { id: 'electrical-firmware', label: 'Electrical / firmware', categories: ['Consumer Electronics', 'Wearables', 'Home Appliances', 'Toys'] },
  { id: 'prototype-build', label: 'Prototype build', categories: ['*'] },
  { id: 'testing-cert', label: 'Testing & certification', categories: ['*'] },
  { id: 'packaging', label: 'Packaging design', categories: ['Consumer Electronics', 'Toys', 'Wearables', 'Home Appliances'] },
  { id: 'sourcing-mfg', label: 'Sourcing & manufacturing prep', categories: ['*'] },
  { id: 'audio-tuning', label: 'Audio tuning & acoustics', categories: ['Consumer Electronics', 'Wearables', 'Toys'] },
  { id: 'waterproof-ip', label: 'Waterproof / IP rating', categories: ['Outdoor Equipment', 'Consumer Electronics'] },
];

/**
 * Returns pathway progress items suggested by the system based on basic project info.
 */
export function getSuggestedPathways(formData) {
  const primary = formData.primaryCategory || '';
  const productCat = (formData.productCategory || '').toLowerCase();

  return PATHWAY_ITEMS.filter((p) => {
    const matchCategory = p.categories.includes('*') || p.categories.includes(primary);
    const matchProduct = (productCat.includes('waterproof') && p.id === 'waterproof-ip') ||
      ((productCat.includes('microphone') || productCat.includes('speaker') || productCat.includes('karaoke')) && p.id === 'audio-tuning');
    return matchCategory || matchProduct;
  });
}
