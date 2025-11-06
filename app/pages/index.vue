<script setup lang="ts">
const { section } = useSiteContent();

const home = section('home');

const heroContent = computed(() => home.value?.hero);
</script>

<template>
	<div class="flex min-h-screen flex-col overflow-hidden">
		<HomeHero :content="heroContent" />
	</div>
</template>
