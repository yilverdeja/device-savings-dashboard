import { useQuery } from '@tanstack/vue-query';
import APIClient from '../services/api-client';
import { DeviceResponse, DevicesRequest } from '../types';

const apiClient = new APIClient<DeviceResponse>('/devices');

const useDevices = (params: DevicesRequest) =>
	useQuery({
		queryKey: ['devices', params],
		queryFn: () => apiClient.getAll({ params }),
	});

export default useDevices;
