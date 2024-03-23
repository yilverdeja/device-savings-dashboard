<script setup lang="ts">
import { TypographyTitle, Divider, Row, Col, Flex } from 'ant-design-vue';
import { ref, onMounted, watch } from 'vue';
import DeviceCard from './components/DeviceCard.vue';
import DeviceModal from './components/DeviceModal.vue';
// import { DeviceResponse } from './types';
import useDevices from './hooks/useDevices';
import { nextTick } from 'vue';

// ... after your data is fetched and updated
nextTick(() => {
	console.log('DOM updated');
	console.log(data.value);
	// You can check the element's height here to debug
});

const includeSavings = ref(true);
const { data, isLoading, error } = useDevices({
	includeSavings: includeSavings.value,
});

const devices = ref([]);
onMounted(() => {
	if (data.value) {
		devices.value = data.value.devices;
	}
});

watch(data, (newValue) => {
	if (newValue) {
		devices.value = newValue.devices;
	}
});

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
	<Flex vertical>
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
	</Flex>
</template>

<style scoped></style>
