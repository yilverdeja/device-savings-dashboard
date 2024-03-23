import { useQuery } from '@tanstack/vue-query';
import APIClient from '../services/api-client';
import { DeviceSavingsRequest, DeviceSavingsResponse } from '../types';

const apiClient = new APIClient<DeviceSavingsResponse>('/savings');

const useDeviceSavings = (id: number, params: DeviceSavingsRequest) =>
	useQuery({
		queryKey: ['savings', id],
		queryFn: () =>
			apiClient.get(id, {
				params: params,
			}),
	});

export default useDeviceSavings;
