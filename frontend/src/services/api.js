import { API_URL } from '../config';

export const getDesignStyles = async () => {
  const response = await fetch(`${API_URL}/styles/`);
  return response.json();
};

export const generateDesign = async (data) => {
  const formData = new FormData();
  formData.append('floor_plan_image', data.floorPlanImage);
  formData.append('room_type', data.roomType);
  formData.append('area_sqft', data.areaSqft);
  formData.append('style', data.style);
  formData.append('color_scheme', data.colorScheme);
  formData.append('budget_level', data.budgetLevel);
  formData.append('lighting_preference', data.lightingPreference);
  if (data.additionalNotes) formData.append('additional_notes', data.additionalNotes);
  
  const response = await fetch(`${API_URL}/generate/`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to generate design');
  }

  return response.json();
};

export const getDesigns = async () => {
  const response = await fetch(`${API_URL}/designs/`);
  return response.json();
};
