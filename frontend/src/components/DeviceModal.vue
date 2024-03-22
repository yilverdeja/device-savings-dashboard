<script setup lang="ts">
import { Modal } from 'ant-design-vue';

defineProps<{
	id: number | null;
	closeModal: () => void;
}>();
</script>

<template>
	<Modal
		:open="id !== null"
		@cancel="() => closeModal()"
		width="100%"
		wrap-class-name="full-modal"
	>
		<div>{{ id }}</div>
	</Modal>
</template>

<style scoped>
.full-modal .ant-modal {
	max-width: 100%;
	top: 0;
	padding-bottom: 0;
	margin: 0;
}
.full-modal .ant-modal-content {
	display: flex;
	flex-direction: column;
	height: calc(100vh);
}
.full-modal .ant-modal-body {
	flex: 1;
}
</style>
