<script setup lang="ts">
import { calculateCarbonValue, roundToOneDecimal } from '../utils/helpers';
import { DataItemType, DeviceResponse } from '../types';
import { Modal, Divider } from 'ant-design-vue';
import { Ref, ref } from 'vue';
import DataView from './DataView.vue';

interface Props {
	device: DeviceResponse;
	closeModal: () => void;
}

const props = defineProps<Props>();

// reactive variables
const totalCarbon: Ref<number> = ref(props.device.totalCarbon as number);
const averageCarbon: Ref<number> = ref(props.device.averageCarbon as number);
const totalDiesel: Ref<number> = ref(props.device.totalDiesel as number);
const averageDiesel: Ref<number> = ref(props.device.averageDiesel as number);

const carbonInfo: Ref<string | undefined> = ref(undefined);
if (totalCarbon.value > 1000 || averageCarbon.value > 1000)
	carbonInfo.value = '1 Tonne = 1,000 kg';

const carbonDataItems: Ref<DataItemType[]> = ref([]);
const dieselDataItems: Ref<DataItemType[]> = ref([]);

// formatted data
const totalCarbonData = calculateCarbonValue(totalCarbon.value);
const averageCarbonData = calculateCarbonValue(averageCarbon.value);

// data items
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
		value: roundToOneDecimal(totalDiesel.value),
		units: 'Litres',
	},
	{
		information: 'Month',
		value: roundToOneDecimal(averageDiesel.value),
		units: 'Litres',
	},
];
</script>

<template>
	<Modal
		:footer="null"
		:open="device !== null"
		@cancel="() => closeModal()"
		title="Estimated Carbon Savings and Diesel Savings"
		width="100%"
		wrap-class-name="full-modal"
	>
		<p class="modal-info">
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

.modal-info {
	color: darkcyan;
	font-weight: bold;
}
</style>
