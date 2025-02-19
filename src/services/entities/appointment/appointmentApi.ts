import axios from 'axios';
import { 
  Appointment, 
  AppointmentCriteria, 
  AppointmentsApiResponse,
  AppointmentTypeHalResponse,
  AppointmentStatusHalResponse,
  AppointmentPriorityHalResponse,
  ServiceCategoryHalResponse,
  ServiceTypeHalResponse
} from '@/types/dataModels';
import { API_BASE_URL } from '@/config';

export const appointmentApi = {
  fetchAppointments: async (page: number = 0, size: number = 10) => {
    const response = await axios.get<AppointmentsApiResponse>(`${API_BASE_URL}/appointments`, {
      params: { page, size }
    });
    return response.data;
  },

  createAppointment: async (appointment: Appointment) => {
    const response = await axios.post<Appointment>(`${API_BASE_URL}/appointments`, appointment);
    return response.data;
  },

  updateAppointment: async (id: number, appointment: Partial<Appointment>) => {
    const response = await axios.patch<Appointment>(`${API_BASE_URL}/appointments/${id}`, appointment);
    return response.data;
  },

  deleteAppointment: async (id: number) => {
    await axios.delete(`${API_BASE_URL}/appointments/${id}`);
  },

  getAppointment: async (id: number) => {
    const response = await axios.get<Appointment>(`${API_BASE_URL}/appointments/${id}`);
    return response.data;
  },

  searchAppointments: async (criteria: AppointmentCriteria, page: number = 0, size: number = 10) => {
    const response = await axios.get<AppointmentsApiResponse>(`${API_BASE_URL}/appointments/search`, {
      params: {
        ...criteria,
        page,
        size
      }
    });
    return response.data;
  },

  fetchAppointmentTypes: async () => {
    const response = await axios.get<AppointmentTypeHalResponse>(`${API_BASE_URL}/appointmentTypes`, {
      params: { page: 0, size: 20 }
    });
    return response.data._embedded.appointmentTypes;
  },

  fetchAppointmentStatuses: async () => {
    const response = await axios.get<AppointmentStatusHalResponse>(`${API_BASE_URL}/appointmentStatuses`, {
      params: { page: 0, size: 20 }
    });
    return response.data._embedded.appointmentStatuses;
  },

  fetchAppointmentPriorities: async () => {
    const response = await axios.get<AppointmentPriorityHalResponse>(`${API_BASE_URL}/appointmentPriorities`, {
      params: { page: 0, size: 20 }
    });
    return response.data._embedded.appointmentPriorities;
  },

  fetchServiceCategories: async () => {
    const response = await axios.get<ServiceCategoryHalResponse>(`${API_BASE_URL}/serviceCategories`, {
      params: { page: 0, size: 20 }
    });
    return response.data._embedded.serviceCategories;
  },

  fetchServiceTypes: async () => {
    const response = await axios.get<ServiceTypeHalResponse>(`${API_BASE_URL}/serviceTypes`, {
      params: { page: 0, size: 20 }
    });
    return response.data._embedded.serviceTypes;
  }
};
