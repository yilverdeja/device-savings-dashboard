<script setup lang="ts">
import { TypographyTitle, Divider, Row, Col, Flex } from 'ant-design-vue';
import { ref, computed } from 'vue';
import DeviceCard from './components/DeviceCard.vue';
import DeviceModal from './components/DeviceModal.vue';
import useDevices from './hooks/useDevices';

const includeSavings = ref(true);
const {
	data: devices,
	isLoading,
	isError,
	error,
} = useDevices({
	includeSavings: includeSavings.value,
});

const selectedDevice = ref<number | null>(null);

const openDeviceInformation = (deviceId: number) => {
	selectedDevice.value = deviceId;
};

const removeSelectedDevice = () => {
	selectedDevice.value = null;
};

const isModalOpen = computed(() => typeof selectedDevice.value === 'number');
</script>

<template>
	<Flex vertical>
		<TypographyTitle>Energy Savings Dashboard</TypographyTitle>
		<Divider orientation="left">Devices</Divider>
		<DeviceModal
			v-if="isModalOpen"
			:id="selectedDevice"
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
						:onSelect="openDeviceInformation"
					/>
				</Col>
			</Row>
		</div>
	</Flex>
</template>

<style scoped></style>
