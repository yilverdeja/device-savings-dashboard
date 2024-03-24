import { useQuery } from '@tanstack/vue-query';
import APIClient from '../services/api-client';
import { DeviceSavingsRequest, DeviceSavingsResponse } from '../types';

// TODO: parameters are not updating as expected, and refetching the data

const apiClient = new APIClient<DeviceSavingsResponse>('/savings');

const useDeviceSavings = (id: number, params: DeviceSavingsRequest) =>
	useQuery({
		queryKey: ['savings', id, params],
		queryFn: () => {
			return apiClient.get(id, {
				params: params,
			});
		},
	});
export default useDeviceSavings;
