import { api } from '@/services/entities/api';
import { Ethnicity, Race, Gender } from '@/types/dataModels';

// Fetching ethnicities
export const fetchEthnicities = async (): Promise<Ethnicity[]> => {
  const response = await api.get<{ _embedded: { ethnicities: Ethnicity[] } }>('/ethnicities');
  return response.data._embedded.ethnicities ?? [];
};

// Fetching races
export const fetchRaces = async (): Promise<Race[]> => {
  const response = await api.get<{ _embedded: { races: Race[] } }>('/races');
  return response.data._embedded.races ?? [];
};

// Fetching genders
export const fetchGenders = async (): Promise<Gender[]> => {
  const response = await api.get<{ _embedded: { genders: Gender[] } }>('/genders');
  return response.data._embedded.genders ?? [];
};
