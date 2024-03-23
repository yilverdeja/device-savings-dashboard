<script setup lang="ts">
import { Flex } from 'ant-design-vue';
import { InfoCircleOutlined } from '@ant-design/icons-vue';
import { DataItemType } from '../types';

interface Props {
	item: DataItemType;
	color: 'primary' | 'secondary';
}

const props = defineProps<Props>();

const textColorStyle = () => {
	if (props.color === 'primary') return 'text--primary';
	if (props.color === 'secondary') return 'text--secondary';
	return '';
};
</script>

<template>
	<!-- consider using dl definition items for better markup -->
	<Flex justify="center" align="center" gap="small" vertical>
		<p v-if="item.title" class="text title">{{ item.title }}</p>
		<Flex
			justify="space-evenly"
			align="center"
			gap="small"
			class="information"
		>
			<p class="text">
				{{ item.information }}
			</p>
			<InfoCircleOutlined class="" />
		</Flex>
		<p class="text value" :class="textColorStyle()">
			{{ item.value.toLocaleString() }}
		</p>
		<p class="text units" :class="textColorStyle()">{{ item.units }}</p>
	</Flex>
</template>

<style scoped>
.text {
	padding: 0;
	margin: 0;
}

.text--primary {
	color: teal;
}

.text--secondary {
	color: darkorchid;
}

.title {
	color: darkslategray;
}

.information {
	color: lightslategray;
}

.value {
	font-weight: bold;
	font-size: x-large;
}

.units {
	font-weight: bold;
}
</style>
