<script setup lang="ts">
import { DataItemType, DeviceSavingsResponse, SavingsChunk } from '../types';
import DataView from './DataView.vue';
import DetailedDataView from './DetailedDataView.vue';
import { Modal, Divider } from 'ant-design-vue';

const props = defineProps<{
	id: number | null;
	closeModal: () => void;
}>();

const carbonDataItems: DataItemType[] = [
	{
		information: 'Total',
		value: 64.1,
		units: 'Tonnes',
	},
	{
		information: 'Month',
		value: 5.1,
		units: 'Tonnes',
	},
];
const dieselDataItems: DataItemType[] = [
	{
		information: 'Total',
		value: 43840.3,
		units: 'Litres',
	},
	{
		information: 'Month',
		value: 3242.8,
		units: 'Litres',
	},
];

const deviceSavings: DeviceSavingsResponse = {
	device_id: props.id as number,
	totalCarbon: 64.1,
	totalDiesel: 43840.3,
	savingsChunks: [] as SavingsChunk[],
};
</script>

<template>
	<Modal
		title="Estimated Carbon Savings and Diesel Savings"
		:open="id !== null"
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
			information="1 Tonne = 1,000 kg"
			:data-items="carbonDataItems"
			color="primary"
		/>
		<Divider></Divider>
		<DataView
			title="Estimated Diesel Savings"
			:data-items="dieselDataItems"
			color="secondary"
		/>
		<Divider></Divider>
		<DetailedDataView :loading="false" :device-savings="deviceSavings" />
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
	/* height: calc(100vh); */
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
