<script setup lang="ts">
import { Ref, ref, watch } from 'vue';
import useDeviceSavings from '../hooks/useDeviceSavings';
import { DataItemType, DeviceSavingsResponse, SavingsChunk } from '../types';
import DataView from './DataView.vue';
import DetailedDataView from './DetailedDataView.vue';
import { Modal, Divider } from 'ant-design-vue';

const props = defineProps<{
	id: number;
	closeModal: () => void;
}>();

const {
	data: deviceSavings,
	isLoading,
	isError,
	error,
} = useDeviceSavings(props.id, {});

const carbonDataItems: Ref<DataItemType[]> = ref([]);
const dieselDataItems: Ref<DataItemType[]> = ref([]);

watch(deviceSavings, (newDeviceSavings: DeviceSavingsResponse) => {
	if (newDeviceSavings) {
		carbonDataItems.value = [
			{
				information: 'Total',
				value: newDeviceSavings.totalCarbon,
				units: 'Tonnes',
			},
			{
				information: 'Month',
				value: newDeviceSavings.averageCarbon,
				units: 'Tonnes',
			},
		];

		dieselDataItems.value = [
			{
				information: 'Total',
				value: newDeviceSavings.totalDiesel,
				units: 'Litres',
			},
			{
				information: 'Month',
				value: newDeviceSavings.averageDiesel,
				units: 'Litres',
			},
		];
	}
});
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
			:loading="isLoading"
			color="primary"
		/>
		<Divider></Divider>
		<DataView
			title="Estimated Diesel Savings"
			:data-items="dieselDataItems"
			:loading="isLoading"
			color="secondary"
		/>
		<Divider></Divider>
		<DetailedDataView
			v-if="deviceSavings"
			:loading="isLoading"
			:device-savings="deviceSavings"
		/>
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
