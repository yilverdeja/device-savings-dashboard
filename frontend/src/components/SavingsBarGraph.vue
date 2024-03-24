<template>
	<v-chart
		ref="chartRef"
		:option="chartOptions"
		@finished="onChartFinished"
		@datazoom="onDataZoom"
		:autoresize="true"
	/>
</template>

<script setup lang="ts">
import {
	ref,
	watch,
	onMounted,
	defineProps,
	defineEmits,
	nextTick,
	onUnmounted,
} from 'vue';
import VChart from 'vue-echarts';
import { ECharts, use } from 'echarts/core';

// Import the necessary ECharts modules
import { CanvasRenderer } from 'echarts/renderers';
import { BarChart } from 'echarts/charts';
import {
	GridComponent,
	TooltipComponent,
	LegendComponent,
	DataZoomComponent,
} from 'echarts/components';

use([
	CanvasRenderer,
	BarChart,
	GridComponent,
	TooltipComponent,
	LegendComponent,
	DataZoomComponent,
]);

// Define props for the component
const props = defineProps<{
	carbonData: number[];
	dieselData: number[];
	timeData: string[];
	timeScale: string;
}>();

// Define emits
const emit = defineEmits(['zoom']);

// Setup the chart options
const chartOptions = ref({});

const createChartOptions = () => {
	chartOptions.value = {
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'shadow',
			},
		},
		legend: {
			data: ['Carbon Savings', 'Diesel Savings'],
			bottom: 0,
		},
		grid: {
			left: '3%',
			right: '4%',
			bottom: '6%',
			containLabel: true,
		},
		xAxis: {
			type: 'category',
			data: props.timeData,
		},
		yAxis: [
			{
				type: 'value',
				name: 'kgs',
				position: 'left',
			},
			{
				type: 'value',
				name: 'litres',
				position: 'right',
			},
		],
		series: [
			{
				name: 'Carbon Savings',
				type: 'bar',
				data: props.carbonData,
			},
			{
				name: 'Diesel Savings',
				type: 'bar',
				data: props.dieselData,
				yAxisIndex: 1,
			},
		],
		dataZoom: [
			{
				type: 'inside',
				start: 0,
				end: 100,
			},
			{
				start: 0,
				end: 10,
			},
		],
	};
};

// Event handler for when chart rendering is finished
const onChartFinished = () => {
	console.log('chart finished');
	// The chart rendering is finished, you can perform actions here if necessary
	// For example, fetching new data based on zoom level
};

const chartRef = ref<ECharts | null>(null);

onMounted(async () => {
	await nextTick(); // Ensure the DOM is updated
	createChartOptions();

	// Here we add a resize listener to handle window resize events
	const handleResize = () => {
		if (chartRef.value) {
			chartRef.value.resize();
		}
	};

	window.addEventListener('resize', handleResize);

	// Optional: immediately invoke the resize handler to ensure proper sizing
	handleResize();
});

onUnmounted(() => {
	// Remove the resize listener when the component is unmounted
	window.removeEventListener('resize', () => {
		if (chartRef.value) {
			chartRef.value.resize();
		}
	});
});

// Watch for changes in props and update the chart
watch(
	[() => props.carbonData, () => props.dieselData, () => props.timeScale],
	() => {
		createChartOptions();
	}
);

// Event handler for when the data zoom event is triggered
const onDataZoom = (event: any) => {
	// Emit the zoom event to the parent component
	emit('zoom', event);
};
</script>

<style scoped>
/* Add any styles for your component here */
</style>
