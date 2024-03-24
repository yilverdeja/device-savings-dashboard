<script setup lang="ts">
// import { DeviceSavingsResponse, DataItemType } from '../types.ts';
import { Flex, Button, DatePicker } from 'ant-design-vue';
import { ref } from 'vue';
import dayjs, { Dayjs } from 'dayjs';

// import DataItem from './DataItem.vue';
// import SavingsBarGraph from './SavingsBarGraph.vue';
import useDeviceSavings from '../hooks/useDeviceSavings';

interface Props {
	deviceId: number;
}

const props = defineProps<Props>();

const toDate = ref<Dayjs>(dayjs());
const fromDate = ref<Dayjs>(toDate.value.subtract(30, 'day'));

const {
	data: deviceSavings,
	isLoading,
	isError,
	error,
} = useDeviceSavings(props.deviceId, {
	to: new Date('2023-12-01'),
	from: new Date('2023-01-01'),
});

// const { device_id, totalCarbon, totalDiesel, savingsChunk } =
// deviceSavings.value;

const carbonItem: DataItemType = {
	title: 'Estimated Carbon Savings',
	information: 'Sum of selected date range',
	value: 10, //deviceSavings.value.totalCarbon,
	units: 'Tonnes',
};

const dieselItem: DataItemType = {
	title: 'Estimated Diesel Savings',
	information: 'Sum of selected date range',
	value: 15, //deviceSavings.value.totalDiesel,
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
