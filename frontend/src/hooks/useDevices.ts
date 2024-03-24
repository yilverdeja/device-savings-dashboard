import { useQuery } from '@tanstack/vue-query';
import APIClient from '../services/api-client';
import { DeviceResponse, DevicesRequest } from '../types';

const apiClient = new APIClient<DeviceResponse>('/devices');

const useDevices = (params: DevicesRequest) =>
	useQuery({
		queryKey: ['devices', params],
		queryFn: () => apiClient.getAll({ params }),
		staleTime: 1000 * 60 * 60 * 24, // 24 hours
	});

export default useDevices;
