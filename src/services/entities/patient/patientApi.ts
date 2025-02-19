import { api } from '@/services/entities/api';
import { Patient, Pageable, PatientsApiResponse } from '@/types/dataModels';
import axios from 'axios';
import { API_BASE_URL } from '@/config';

export const patientApi = {

  getPatients: async (params: { page: number; size: number }): Promise<PatientsApiResponse> => {
    const response = await api.get<PatientsApiResponse>(`/patients?page=${params.page}&size=${params.size}`);
    return response.data;
  },

  getPatient: async (id: number) => {
    const response = await api.get(`/patients/${id}`);
    return response.data;
  },

  createPatient: async (patient: Patient) => {
    const response = await api.post('/patients', patient);
    return response.data;
  },

  updatePatient: async (id: number, patient: Partial<Patient>) => {
    const response = await api.patch(`/patients/${id}`, patient);
    return response.data;
  },

  deletePatient: async (id: number) => {
    await api.delete(`/patients/${id}`);
  },

  searchPatients: async (params: any, pageable: Pageable) => {
    const response = await api.get('/patients/search', {
      params: { ...params, ...pageable },
    });
    return response.data;
  },

  fetchPatients: async (page: number = 0, size: number = 10) => {
    const response = await axios.get<PatientsApiResponse>(`${API_BASE_URL}/patients`, {
      params: { page, size }
    });
    return response.data;
  },
};