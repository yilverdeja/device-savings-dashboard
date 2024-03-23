<script setup lang="ts">
import { DeviceSavingsResponse, DataItemType } from '../types.ts';
import { Flex, Button, DatePicker } from 'ant-design-vue';
import { ref } from 'vue';
import dayjs, { Dayjs } from 'dayjs';

import DataItem from './DataItem.vue';
import SavingsBarGraph from './SavingsBarGraph.vue';

const toDate = ref<Dayjs>(dayjs());
const fromDate = ref<Dayjs>(toDate.value.subtract(30, 'day'));

interface Props {
	loading: boolean;
	deviceSavings: DeviceSavingsResponse;
}

const props = defineProps<Props>();

const carbonItem: DataItemType = {
	title: 'Estimated Carbon Savings',
	information: 'Sum of selected date range',
	value: props.deviceSavings.totalCarbon,
	units: 'Tonnes',
};

const dieselItem: DataItemType = {
	title: 'Estimated Diesel Savings',
	information: 'Sum of selected date range',
	value: props.deviceSavings.totalDiesel,
	units: 'Litres',
};

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

const carbonData = ref([1200, 1320, 1010, 1340, 900, 2300, 2100]);
const dieselData = ref([2200, 1820, 1910, 2340, 2900, 3300, 3100]);
const timeData = ref([
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
]);
const timeScale = ref('Monthly');

const handleZoom = (event: any) => {
	// Handle the zoom event
	// Fetch new data based on the zoom level or perform other actions
	console.log('Zoom event triggered', event);
};

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
	<div v-if="loading">Loading...</div>
	<div v-else>
		<Flex gap="large" vertical>
			<Flex justify="start" align="center" gap="middle">
				<DatePicker
					style="flex-grow: 1"
					:value="fromDate"
					@change="updateFromDate"
				/>
				<div style="font-weight: bold; font-size: x-large">-</div>
				<DatePicker
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
				<SavingsBarGraph
					:carbonData="carbonData"
					:dieselData="dieselData"
					:timeData="timeData"
					:timeScale="timeScale"
					@zoom="handleZoom"
				/>
			</div>
		</Flex>
	</div>
</template>

<style scoped></style>
