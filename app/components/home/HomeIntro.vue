<script setup lang="ts">
defineProps<{
	content?: {
		headline: string;
		body: string;
	};
}>();
</script>

<template>
	<section class="bg-[var(--surface-body)] py-16 sm:py-24">
		<div class="mx-auto flex max-w-content flex-col items-center gap-6 px-6 text-center">
			<h2 class="font-display text-3xl font-light italic text-[var(--ink-strong)] sm:text-4xl">
				{{ content?.headline }}
			</h2>
			<p class="max-w-2xl text-base leading-relaxed text-[var(--ink-muted)] sm:text-lg">
				{{ content?.body }}
			</p>
		</div>
	</section>
</template>
