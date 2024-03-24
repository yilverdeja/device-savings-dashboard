<script setup lang="ts">
import {
	Flex,
	Button,
	DatePicker,
	RadioGroup,
	RadioButton,
} from 'ant-design-vue';
import {
	DataItemType,
	SavingsChunk,
	DeviceSavingsRequest,
	DeviceSavingsResolution,
} from '../types';
import { calculateCarbonValue, roundToOneDecimal } from '../utils/helpers';
import { computed, ref, Ref, watch } from 'vue';
import { DeviceSavingsResponse } from '../types';
import { useQuery } from '@tanstack/vue-query';
import APIClient from '../services/api-client';
import dayjs, { Dayjs } from 'dayjs';
import SavingsBarGraph from './SavingsBarGraph.vue';

const apiClient = new APIClient<DeviceSavingsResponse>('/savings');

interface Props {
	deviceId: number;
}

const props = defineProps<Props>();

const toDate = ref<Dayjs>(dayjs());
const fromDate = ref<Dayjs>(toDate.value.subtract(30, 'day'));
const resolution = ref<DeviceSavingsResolution>('month');

// TODO: Remove... Hardcoded values for testing
toDate.value = dayjs(new Date('2023-12-31'));
fromDate.value = dayjs(new Date('2023-01-01'));

// Create a reactive params object using computed
const params: Ref<DeviceSavingsRequest> = computed(() => ({
	to: toDate.value.toDate(),
	from: fromDate.value.toDate(),
	resolution: resolution.value,
}));

// import useDeviceSavings from '../hooks/useDeviceSavings';
// TODO: Not working...
// const {
// 	data: deviceSavings,
// 	isLoading,
// 	isError,
// 	error,
// 	refetch,
// } = useDeviceSavings(props.deviceId, params.value);

// Fetch Data from Device Savings
const {
	data: deviceSavings,
	isLoading,
	isError,
	refetch,
} = useQuery({
	queryKey: [
		'savings',
		props.deviceId,
		toDate.value.toDate(),
		fromDate.value.toDate(),
		resolution.value,
	],
	queryFn: () => {
		return apiClient.get(props.deviceId, {
			params: {
				to: toDate.value.toDate(),
				from: fromDate.value.toDate(),
				resolution: resolution.value,
			},
		});
	},
	staleTime: 1000 * 60 * 60 * 24, // 24 hours
});

watch(
	params,
	() => {
		refetch();
	},
	{
		deep: true, // ensures the watcher will trigger even for nested property changes
	}
);

// Computed property for carbon savings, updates when deviceSavings changes
const carbonItem = computed(() => {
	if (isLoading.value || !deviceSavings.value) {
		return {
			title: 'Estimated Carbon Savings',
			information: 'Sum of selected date range',
			value: null,
			units: '',
		} as DataItemType;
	}
	const { units: carbonUnit, value: carbonValue } = calculateCarbonValue(
		roundToOneDecimal(deviceSavings.value.totalCarbon)
	);
	return {
		title: 'Estimated Carbon Savings',
		information: 'Sum of selected date range',
		value: carbonValue,
		units: carbonUnit,
	} as DataItemType;
});

// Computed property for diesel savings, updates when deviceSavings changes
const dieselItem = computed(() => {
	if (isLoading.value || !deviceSavings.value) {
		return {
			title: 'Estimated Diesel Savings',
			information: 'Sum of selected date range',
			value: null,
			units: '',
		} as DataItemType;
	}
	return {
		title: 'Estimated Diesel Savings',
		information: 'Sum of selected date range',
		value: roundToOneDecimal(deviceSavings.value.totalDiesel),
		units: 'Litres',
	} as DataItemType;
});

const carbonData = ref<number[]>([]);
const dieselData = ref<number[]>([]);
const timeData = ref<string[]>([]);
const timeScale = ref<string>('month');

// Watch the deviceSavings for changes and update the arrays accordingly
watch(
	deviceSavings,
	(newValue) => {
		if (newValue) {
			processSavingsChunks(newValue.savingsChunks);
		}
	},
	{ immediate: true }
);

const processSavingsChunks = (savingsChunks: SavingsChunk[]) => {
	const newCarbonData: number[] = [];
	const newDieselData: number[] = [];
	const newTimeData: string[] = [];

	for (const chunk of savingsChunks) {
		const { value } = calculateCarbonValue(
			roundToOneDecimal(chunk.totalCarbon)
		);
		newCarbonData.push(value);
		newDieselData.push(roundToOneDecimal(chunk.totalDiesel / 1000));
		// Assuming 'from' is the start date of the month
		if (resolution.value === 'month') {
			newTimeData.push(dayjs(chunk.from).format('MMMM'));
		} else {
			newTimeData.push(dayjs(chunk.from).format('MMM D'));
		}
	}

	// Update the reactive references with the new data
	carbonData.value = newCarbonData;
	dieselData.value = newDieselData;
	timeData.value = newTimeData;
};

// utilities
const updateRangeToLast30Days = () => {
	toDate.value = dayjs();
	fromDate.value = toDate.value.subtract(30, 'day');
};

const updateRangeToLast60Days = () => {
	toDate.value = dayjs();
	fromDate.value = toDate.value.subtract(60, 'day');
};

const updateRangeToLastYear = () => {
	toDate.value = dayjs();
	fromDate.value = toDate.value.subtract(1, 'year');
};

const updateFromDate = (newDate: string | Dayjs) => {
	fromDate.value = newDate as Dayjs;
};

const updateToDate = (newDate: string | Dayjs) => {
	toDate.value = newDate as Dayjs;
};

const updateResolution = (newResolution: DeviceSavingsResolution) => {
	resolution.value = newResolution;
};
</script>

<template>
	<Flex gap="large" vertical>
		<Flex justify="start" align="center" gap="middle">
			<DatePicker
				show-time
				style="flex-grow: 1"
				:value="fromDate"
				@change="updateFromDate"
			/>
			<div style="font-weight: bold; font-size: x-large">-</div>
			<DatePicker
				show-time
				style="flex-grow: 1"
				:value="toDate"
				@change="updateToDate"
			/>
		</Flex>
		<Flex justify="space-between" align="center" gap="middle">
			<Flex justify="start" align="center" gap="middle">
				<Button @click="updateRangeToLast30Days">Last 30 Days</Button>
				<Button @click="updateRangeToLast60Days">Last 60 Days</Button>
				<Button @click="updateRangeToLastYear">Last year</Button>
			</Flex>
			<Flex justify="start" align="center" gap="middle">
				<RadioGroup :value="resolution">
					<RadioButton
						@click="updateResolution('month')"
						value="month"
						>Month</RadioButton
					>
					<RadioButton @click="updateResolution('week')" value="week"
						>Week</RadioButton
					>
					<RadioButton @click="updateResolution('day')" value="day"
						>Day</RadioButton
					>
				</RadioGroup>
			</Flex>
		</Flex>
		<div v-if="isLoading">Loading...</div>
		<div v-else-if="isError">Unable to retrieve the data in that range</div>
		<div v-else>
			<Flex justify="space-evenly" align="center" gap="large">
				<DataItem :item="carbonItem" color="primary" />
				<DataItem :item="dieselItem" color="secondary" />
			</Flex>
			<Flex justify="center" align="center">
				<div style="width: 600px; height: 400px">
					<SavingsBarGraph
						:carbonData="carbonData"
						:dieselData="dieselData"
						:timeData="timeData"
						:timeScale="timeScale"
					/>
				</div>
			</Flex>
		</div>
	</Flex>
</template>

<style scoped></style>
