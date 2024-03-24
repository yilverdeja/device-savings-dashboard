<template>
	<v-chart ref="chartRef" :option="chartOptions" :autoresize="true" />
</template>

<script setup lang="ts">
import { ref, watch, onMounted, defineProps, onUnmounted } from 'vue';
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

// Setup the chart options
const chartRef = ref<ECharts | null>(null);
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
				name: 'tonnes',
				position: 'left',
				axisLabel: {
					formatter: '{value}',
				},
			},
			{
				type: 'value',
				name: 'litres',
				position: 'right',
				axisLabel: {
					formatter: '{value}k',
				},
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
				type: 'inside', // Enable zooming inside the chart using the mouse wheel
				start: 0,
				end: 100,
				zoomOnMouseWheel: true, // Enable zoom on mouse wheel
				minSpan: 0, // Limit the minimum range to 10%
				maxSpan: 100, // Limit the maximum range to 100%
			},
			{
				type: 'slider', // Additional slider dataZoom for user interface
				start: 0,
				end: 100,
			},
		],
	};
};

// Define the resize handler for the onMounted and onUnmounted lifecycle hooks
const handleResize = () => {
	if (chartRef.value) {
		chartRef.value.resize();
	}
};

onMounted(() => {
	createChartOptions();

	window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
	window.removeEventListener('resize', handleResize);
});

// Watch for changes in props and update the chart
watch(
	[() => props.carbonData, () => props.dieselData, () => props.timeScale],
	() => {
		createChartOptions();
	}
);
</script>

<style scoped></style>
