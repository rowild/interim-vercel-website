<script setup lang="ts">
import type { PropType } from 'vue';

type TestimonialEntry = {
	id: string;
	name: string;
	role: string;
	quote: string;
};

defineProps({
	content: {
		type: Object as PropType<{
			headline: string;
			quote?: string;
			entries: TestimonialEntry[];
		}>,
		default: undefined,
	},
});
</script>

<template>
	<section v-if="content?.entries?.length" class="bg-[var(--surface-body)] py-24">
		<div class="mx-auto max-w-wide px-6 sm:px-10">
			<div class="flex flex-col items-center text-center">
				<h2 class="font-display text-3xl font-light italic text-[var(--ink-strong)] sm:text-4xl">
					{{ content?.headline }}
				</h2>
				<p v-if="content?.quote" class="mt-4 max-w-3xl text-lg italic text-[var(--ink-muted)]">
					“{{ content.quote }}”
				</p>
			</div>

			<div class="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-3">
				<figure
					v-for="entry in content.entries"
					:key="entry.id"
					class="flex h-full flex-col justify-between gap-6 rounded-2xl border border-[var(--border-light)]/60 bg-[var(--surface-panel)] p-8 text-left shadow-[var(--shadow-app)]"
				>
					<blockquote class="text-base leading-relaxed text-[var(--ink-body)]">
						“{{ entry.quote }}”
					</blockquote>
					<figcaption class="space-y-1 text-sm">
						<p class="font-semibold text-[var(--ink-strong)]">{{ entry.name }}</p>
						<p class="text-[var(--ink-muted)]">{{ entry.role }}</p>
					</figcaption>
				</figure>
			</div>
		</div>
	</section>
</template>
