<script setup lang="ts">
import { Flex } from 'ant-design-vue';
import { InfoCircleOutlined } from '@ant-design/icons-vue';
import { DataItemType } from '../types';
import { computed } from 'vue';

interface Props {
	item: DataItemType;
	color: 'primary' | 'secondary';
}

const props = defineProps<Props>();

const textColorClass = computed(() => {
	return {
		'text--primary': props.color === 'primary',
		'text--secondary': props.color === 'secondary',
	};
});
</script>

<template>
	<Flex justify="center" align="center" gap="small" vertical>
		<dl class="data-item">
			<dt v-if="item.title" class="text title">{{ item.title }}</dt>
			<dd class="information">
				<Flex justify="space-evenly" align="center" gap="small">
					<span>{{ item.information }}</span>
					<InfoCircleOutlined />
				</Flex>
			</dd>
			<dd class="value-units" :class="textColorClass">
				<div class="text value">
					<span v-if="item.value">{{
						item.value.toLocaleString()
					}}</span>
					<span v-else>...</span>
				</div>
				<div class="text units">{{ item.units }}</div>
			</dd>
		</dl>
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

.data-item {
	display: block;
}

.value-units {
	display: flex;
	flex-direction: column;
	align-items: center;
}
</style>
