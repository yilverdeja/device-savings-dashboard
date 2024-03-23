<script setup lang="ts">
import { DeviceSavingsResponse, DataItemType } from '../types.ts';
import { Flex, Button, DatePicker } from 'ant-design-vue';
import { ref } from 'vue';

import DataItem from './DataItem.vue';
import SavingsBarGraph from './SavingsBarGraph.vue';

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
</script>

<template>
	<Flex gap="large" vertical>
		<Flex justify="start" align="center" gap="middle">
			<DatePicker />
			<div>-</div>
			<DatePicker />
		</Flex>
		<Flex justify="start" align="center" gap="middle">
			<Button>Last 30 Days</Button>
			<Button>Last 60 Days</Button>
			<Button>Last year</Button>
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
</template>

<style scoped></style>
