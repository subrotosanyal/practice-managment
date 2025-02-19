import { api } from '@/services/entities/api';
import { Practitioner, PractitionersApiResponse } from '@/types/dataModels';
import axios from 'axios';
import { API_BASE_URL } from '@/config';

export const practitionerApi = {
  getPractitioners: async (params: { page: number; size: number }): Promise<PractitionersApiResponse> => {
    const response = await api.get<PractitionersApiResponse>(`/practitioners?page=${params.page}&size=${params.size}`);
    return response.data;
  },

  searchPractitioners: async (params: { name: string }, { page, size }: { page: number; size: number }): Promise<PractitionersApiResponse> => {
    const response = await api.get<PractitionersApiResponse>(`/practitioners/search?name=${params.name}&page=${page}&size=${size}`);
    return response.data;
  },

  getPractitioner: async (id: number): Promise<Practitioner> => {
    const response = await api.get<Practitioner>(`/practitioners/${id}`);
    return response.data;
  },

  createPractitioner: async (practitioner: Omit<Practitioner, 'practitionerId'>): Promise<Practitioner> => {
    const response = await api.post<Practitioner>('/practitioners', practitioner);
    return response.data;
  },

  updatePractitioner: async (id: number, practitioner: Partial<Practitioner>): Promise<Practitioner> => {
    const response = await api.put<Practitioner>(`/practitioners/${id}`, practitioner);
    return response.data;
  },

  deletePractitioner: async (id: number): Promise<void> => {
    await api.delete(`/practitioners/${id}`);
  },

  fetchPractitioners: async (page: number = 0, size: number = 10) => {
    const response = await axios.get<PractitionersApiResponse>(`${API_BASE_URL}/practitioners`, {
      params: { page, size }
    });
    return response.data;
  },
};
