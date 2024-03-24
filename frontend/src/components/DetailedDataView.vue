<script setup lang="ts">
import { Flex, Button, DatePicker } from 'ant-design-vue';
import { computed, ref, watchEffect, Ref } from 'vue';
import dayjs, { Dayjs } from 'dayjs';
// import SavingsBarGraph from './SavingsBarGraph.vue';
import useDeviceSavings from '../hooks/useDeviceSavings';
import { DataItemType } from '../types';

interface Props {
	deviceId: number;
}

const props = defineProps<Props>();

const toDate = ref<Dayjs>(dayjs());
const fromDate = ref<Dayjs>(toDate.value.subtract(30, 'day'));

// Hardcoded values for testing
toDate.value = dayjs(new Date('2023-12-01'));
fromDate.value = dayjs(new Date('2023-11-29'));

const {
	data: deviceSavings,
	isLoading,
	isError,
	error,
} = useDeviceSavings(props.deviceId, {
	to: toDate.value.toDate(),
	from: fromDate.value.toDate(),
});

const roundToOneDecimal = (value: number): number => {
	return Math.round(value * 10) / 10;
};

const calculateCarbonValue = (
	value: number
): { value: number; units: string } => {
	if (value > 1000) {
		return { value: roundToOneDecimal(value / 1000), units: 'Tonnes' };
	} else {
		return { value: roundToOneDecimal(value), units: 'Kgs' };
	}
};

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

// const carbonData = ref<number[]>([
// 	/* ... */
// ]);
// const dieselData = ref<number[]>([
// 	/* ... */
// ]);
// const timeData = ref<string[]>([
// 	/* ... */
// ]);
// const timeScale = ref<string>('month-year');

// const carbonData = ref([1200, 1320, 1010, 1340, 900, 2300, 2100]);
// const dieselData = ref([2200, 1820, 1910, 2340, 2900, 3300, 3100]);
// const timeData = ref([
// 	'January',
// 	'February',
// 	'March',
// 	'April',
// 	'May',
// 	'June',
// 	'July',
// ]);
// const timeScale = ref('Monthly');

// const handleZoom = (event: any) => {
// 	// Handle the zoom event
// 	// Fetch new data based on the zoom level or perform other actions
// 	console.log('Zoom event triggered', event);
// };

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
</script>

<template>
	<div v-if="isLoading">Loading...</div>
	<div v-else-if="isError">Error: {{ error }}</div>
	<div v-else>
		<!-- {{ deviceSavings }} -->
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
			<Flex justify="start" align="center" gap="middle">
				<Button @click="updateRangeToLast30Days">Last 30 Days</Button>
				<Button @click="updateRangeToLast60Days">Last 60 Days</Button>
				<Button @click="updateRangeToLastYear">Last year</Button>
			</Flex>
			<Flex justify="space-evenly" align="center" gap="large">
				<DataItem :item="carbonItem" color="primary" />
				<DataItem :item="dieselItem" color="secondary" />
			</Flex>
			<div style="width: 600px; height: 400px">
				{{ deviceSavings }}
				<!-- <SavingsBarGraph
					:carbonData="carbonData"
					:dieselData="dieselData"
					:timeData="timeData"
					:timeScale="timeScale"
					@zoom="handleZoom"
				/> -->
			</div>
		</Flex>
	</div>
</template>

<style scoped></style>
