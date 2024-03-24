<script setup lang="ts">
import { Ref, ref } from 'vue';
import { DataItemType, DeviceResponse } from '../types';
import DataView from './DataView.vue';
import { Modal, Divider } from 'ant-design-vue';

const props = defineProps<{
	device: DeviceResponse;
	closeModal: () => void;
}>();

let totalCarbon = props.device.totalCarbon as number;
let averageCarbon = props.device.averageCarbon as number;
let totalDiesel = props.device.totalDiesel as number;
let averageDiesel = props.device.averageDiesel as number;

const carbonInfo: Ref<string | undefined> = ref(undefined);
if (totalCarbon > 1000 || averageCarbon > 1000)
	carbonInfo.value = '1 Tonne = 1,000 kg';

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

const carbonDataItems: Ref<DataItemType[]> = ref([]);
const dieselDataItems: Ref<DataItemType[]> = ref([]);

const totalCarbonData = calculateCarbonValue(totalCarbon);
const averageCarbonData = calculateCarbonValue(averageCarbon);

carbonDataItems.value = [
	{
		information: 'Total',
		value: totalCarbonData.value,
		units: totalCarbonData.units,
	},
	{
		information: 'Month',
		value: averageCarbonData.value,
		units: averageCarbonData.units,
	},
];

dieselDataItems.value = [
	{
		information: 'Total',
		value: roundToOneDecimal(totalDiesel),
		units: 'Litres',
	},
	{
		information: 'Month',
		value: roundToOneDecimal(averageDiesel),
		units: 'Litres',
	},
];
</script>

<template>
	<Modal
		title="Estimated Carbon Savings and Diesel Savings"
		:open="device !== null"
		@cancel="() => closeModal()"
		width="100%"
		wrap-class-name="full-modal"
		:footer="null"
	>
		<p style="color: darkcyan; font-weight: bold">
			Download general guidelines on the estimated carbon & diesel saving
			calculations
		</p>
		<Divider></Divider>
		<DataView
			title="Estimated Carbon Savings"
			:information="carbonInfo"
			:data-items="carbonDataItems"
			:loading="false"
			color="primary"
		/>
		<Divider></Divider>
		<DataView
			title="Estimated Diesel Savings"
			:data-items="dieselDataItems"
			:loading="false"
			color="secondary"
		/>
		<Divider></Divider>
		<DetailedDataView :device-id="device.id" />
	</Modal>
</template>

<style>
.full-modal .ant-modal {
	max-width: 100%;
	top: 0;
	padding-bottom: 0;
	margin: 0;
}
.full-modal .ant-modal-content {
	display: flex;
	flex-direction: column;
	margin: 10px;
	padding: 0;
}
.full-modal .ant-modal-header {
	padding: 30px;
	background-color: lightcyan;
}

.full-modal .ant-modal-title {
	font-size: 24px;
	color: darkcyan;
}

.full-modal .ant-modal-close {
	top: 36px;
	inset-inline-end: 30px;
}

.full-modal .ant-modal-body {
	padding: 30px;
	flex: 1;
}
</style>
