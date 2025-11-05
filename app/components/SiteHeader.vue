<script setup lang="ts">
// defineProps<{
// 	tagline?: string;
// }>();
</script>

<template>
	<div>
		<NuxtLink
			to="/"
			data-hero-logo
			class="fixed left-8 top-8 z-10 group inline-flex items-center gap-3 text-on-dark"
		>
			<HeaderLogo />
		</NuxtLink>
	</div>
</template>

<style scoped>
.site-header--intro {
	opacity: 0;
}
</style>
