<script setup lang="ts">
import { TypographyTitle, Divider, Row, Col } from 'ant-design-vue';
import { ref } from 'vue';
import DeviceCard from './components/DeviceCard.vue';
import DeviceModal from './components/DeviceModal.vue';

interface Device {
	id: number;
	name: string;
	timezone: string;
}

type DeviceSavingsInfo = {
	totalCarbon: number;
	totalDiesel: number;
	averageCarbon: number;
	averageDiesel: number;
};

type DeviceResponse = Device & Partial<DeviceSavingsInfo>;

const devices = ref<DeviceResponse[]>([
	{
		id: 1,
		name: 'robert',
		timezone: 'america',
		totalCarbon: 2,
		totalDiesel: 3,
	},
	{
		id: 2,
		name: 'julian',
		timezone: 'hongkong',
		totalCarbon: 4,
		totalDiesel: 5,
	},
	{
		id: 3,
		name: 'carol',
		timezone: 'dubai',
		totalCarbon: 6,
		totalDiesel: 7,
	},
]);

const selectedDevice = ref<number | null>(null);

const openDeviceInformation = (deviceId: number) => {
	selectedDevice.value = deviceId;
	console.log(`Open device ${deviceId} information`);
};

const removeSelectedDevice = () => {
	selectedDevice.value = null;
};
</script>

<template>
	<TypographyTitle>Energy Savings Dashboard</TypographyTitle>
	<Divider orientation="left">Devices</Divider>
	<DeviceModal :id="selectedDevice" :closeModal="removeSelectedDevice" />
	<Row :gutter="[16, 16]">
		<Col v-for="device in devices" class="gutter-row" :span="8">
			<DeviceCard
				:device="device"
				:loading="false"
				:onSelect="openDeviceInformation"
			/>
		</Col>
	</Row>
</template>

<style scoped></style>
