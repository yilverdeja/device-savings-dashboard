<script setup lang="ts">
import { Flex } from 'ant-design-vue';

interface DataItem {
	title?: string;
	information?: string;
	value: number;
	units: string;
}

interface Props {
	title: string;
	information?: string;
	dataItems: DataItem[];
}

defineProps<Props>();
</script>

<template>
	<div>
		<h3>{{ title }}</h3>
		<p v-if="information">{{ information }}</p>
		<Flex justify="space-evenly" align="center" gap="large">
			<div v-for="(item, index) in dataItems" :key="index">
				{{ item.information }}
			</div>
		</Flex>
	</div>
</template>

<style scoped></style>
