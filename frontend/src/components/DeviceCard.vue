<script setup lang="ts">
import {
	AnchorLink,
	Card,
	Row,
	Col,
	TypographyText,
	Flex,
} from 'ant-design-vue';
import { DeviceResponse } from '../types';
import { computed } from 'vue';
import { calculateCarbonValue, roundToOneDecimal } from '../utils/helpers';
import { EnvironmentOutlined } from '@ant-design/icons-vue';

interface Props {
	device: DeviceResponse;
	loading: boolean;
	onSelect: () => void;
}

const props = defineProps<Props>();

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
						<TypographyText strong>Total Carbon</TypographyText>
						<p>{{ carbonItem.value }} {{ carbonItem.units }}</p>
					</Col>
					<Col class="gutter-row" :span="12">
						<TypographyText strong>Total Diesel</TypographyText>
						<p>
							{{ roundToOneDecimal(device.totalDiesel) }} Litres
						</p>
					</Col>
				</Row>
			</div>
			<Flex justify="start" align="center" gap="small">
				<EnvironmentOutlined style="color: darkcyan" />
				<TypographyText style="color: darkcyan">{{
					device.timezone
				}}</TypographyText>
			</Flex>
		</Card>
	</AnchorLink>
</template>

<style>
.ant-card .ant-card-head {
	color: darkcyan;
	background-color: lightcyan;
}
</style>
