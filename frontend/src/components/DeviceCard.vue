<script setup lang="ts">
import { AnchorLink, Card, Divider, Row, Col } from 'ant-design-vue';

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

defineProps<{
	device: DeviceResponse;
	loading: boolean;
	onSelect: (id: number) => void;
}>();
</script>

<template>
	<AnchorLink @click="() => onSelect(device.id)">
		<Card :title="device.name" :loading="loading" :hoverable="true">
			<div v-if="device.totalCarbon && device.totalDiesel">
				<Divider>Energy Savings</Divider>
				<Row :gutter="16">
					<Col class="gutter-row" :span="12">
						<p>Total Carbon</p>
						<p>{{ device.totalCarbon }}</p>
					</Col>
					<Col class="gutter-row" :span="12">
						<p>Total Diesel</p>
						<p>{{ device.totalDiesel }}</p>
					</Col>
				</Row>
			</div>
		</Card>
	</AnchorLink>
</template>

<style scoped></style>
