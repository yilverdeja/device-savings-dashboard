<script setup lang="ts">
import { Flex } from 'ant-design-vue';
import DataItem from './DataItem.vue';
import { DataItemType } from '../types';

interface Props {
	title: string;
	information?: string;
	dataItems: DataItemType[];
	loading: boolean;
	color: 'primary' | 'secondary';
}

defineProps<Props>();
</script>

<template>
	<div>
		<h3>{{ title }}</h3>
		<p v-if="information">{{ information }}</p>
		<div v-if="loading">Loading...</div>
		<div v-else>
			<Flex justify="space-evenly" align="center" gap="large">
				<DataItem
					v-for="(item, index) in dataItems"
					:key="index"
					:item="item"
					:color="color"
				/>
			</Flex>
		</div>
	</div>
</template>

<style scoped></style>
