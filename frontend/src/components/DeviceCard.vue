<script setup lang="ts">
import { AnchorLink, Card, Row, Col } from 'ant-design-vue';
import { DeviceResponse } from '../types';
import { computed } from 'vue';

const props = defineProps<{
	device: DeviceResponse;
	loading: boolean;
	onSelect: () => void;
}>();

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

const carbonItem = computed(() => {
	return calculateCarbonValue(props.device.totalCarbon || 0);
});
</script>

<template>
	<AnchorLink @click="onSelect">
		<Card :title="device.name" :loading="loading" :hoverable="true">
			<div v-if="device.totalCarbon && device.totalDiesel">
				<Row :gutter="16">
					<Col class="gutter-row" :span="12">
						<p style="font-weight: bold">Total Carbon</p>
						<p>{{ carbonItem.value }} {{ carbonItem.units }}</p>
					</Col>
					<Col class="gutter-row" :span="12">
						<p style="font-weight: bold">Total Diesel</p>
						<p>{{ roundToOneDecimal(device.totalDiesel) }} Litre</p>
					</Col>
				</Row>
			</div>
		</Card>
	</AnchorLink>
</template>

<style>
.ant-card .ant-card-head {
	color: darkcyan;
	background-color: lightcyan;
}
</style>
