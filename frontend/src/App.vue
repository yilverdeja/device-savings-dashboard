<script setup lang="ts">
import { DeviceResponse } from './types';
import { ref } from 'vue';
import { TypographyTitle, Divider, Row, Col, Flex } from 'ant-design-vue';
import DeviceCard from './components/DeviceCard.vue';
import DeviceModal from './components/DeviceModal.vue';
import useDevices from './hooks/useDevices';

// get devices data from api
const {
	data: devices,
	isLoading,
	isError,
	error,
} = useDevices({
	includeSavings: true,
});

const selectedDevice = ref<DeviceResponse | null>(null);

// select device event handlers
const selectDevice = (device: DeviceResponse) => {
	selectedDevice.value = device;
};

const removeSelectedDevice = () => {
	selectedDevice.value = null;
};
</script>

<template>
	<Flex vertical>
		<TypographyTitle>Energy Savings Dashboard</TypographyTitle>
		<Divider orientation="left">Devices</Divider>
		<DeviceModal
			v-if="selectedDevice"
			:device="selectedDevice"
			:closeModal="removeSelectedDevice"
		/>
		<div v-if="isLoading">Loading...</div>
		<div v-else-if="isError && error">Error: {{ error.message }}</div>
		<div v-else>
			<Row :gutter="[16, 16]">
				<Col v-for="device in devices" class="gutter-row" :span="8">
					<DeviceCard
						:device="device"
						:loading="false"
						:onSelect="() => selectDevice(device)"
					/>
				</Col>
			</Row>
		</div>
	</Flex>
</template>

<style scoped></style>
