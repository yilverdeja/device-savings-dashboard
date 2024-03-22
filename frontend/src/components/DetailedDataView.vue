<script setup lang="ts">
import { Flex, Button, DatePicker } from 'ant-design-vue';

import DataItem from './DataItem.vue';

import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { PieChart } from 'echarts/charts';
import {
	TitleComponent,
	TooltipComponent,
	LegendComponent,
} from 'echarts/components';
import VChart from 'vue-echarts';

import { ref } from 'vue';

use([
	CanvasRenderer,
	PieChart,
	TitleComponent,
	TooltipComponent,
	LegendComponent,
]);

type SavingsChunk = {
	from: Date;
	to: Date;
	totalCarbon: number;
	totalDiesel: number;
};

interface DeviceSavingsResponse {
	device_id: number;
	totalCarbon: number;
	totalDiesel: number;
	savingsChunks: SavingsChunk[];
}

interface DataItem {
	title?: string;
	information?: string;
	value: number;
	units: string;
}

interface Props {
	loading: boolean;
	deviceSavings: DeviceSavingsResponse;
}

const props = defineProps<Props>();

const carbonItem: DataItem = {
	title: 'Estimated Carbon Savings',
	information: 'Sum of selected date range',
	value: props.deviceSavings.totalCarbon,
	units: 'Tonnes',
};

const dieselItem: DataItem = {
	title: 'Estimated Diesel Savings',
	information: 'Sum of selected date range',
	value: props.deviceSavings.totalDiesel,
	units: 'Litres',
};

const option = ref({
	title: {
		text: 'Traffic Sources',
		left: 'center',
	},
	tooltip: {
		trigger: 'item',
		formatter: '{a} <br/>{b} : {c} ({d}%)',
	},
	legend: {
		orient: 'vertical',
		left: 'left',
		data: ['Direct', 'Email', 'Ad Networks', 'Video Ads', 'Search Engines'],
	},
	series: [
		{
			name: 'Traffic Sources',
			type: 'pie',
			radius: '55%',
			center: ['50%', '60%'],
			data: [
				{ value: 335, name: 'Direct' },
				{ value: 310, name: 'Email' },
				{ value: 234, name: 'Ad Networks' },
				{ value: 135, name: 'Video Ads' },
				{ value: 1548, name: 'Search Engines' },
			],
			emphasis: {
				itemStyle: {
					shadowBlur: 10,
					shadowOffsetX: 0,
					shadowColor: 'rgba(0, 0, 0, 0.5)',
				},
			},
		},
	],
});
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
		<v-chart class="chart" :option="option" autoresize />
	</Flex>
</template>

<style scoped>
.chart {
	height: 100vh;
}
</style>
