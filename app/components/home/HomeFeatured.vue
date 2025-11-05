<script setup lang="ts">
import type { PropType } from 'vue';

type FeaturedItem = {
	id: string;
	title: string;
	category: string;
	summary: string;
	media: {
		image: string;
		alt: string;
	};
};

defineProps({
	content: {
		type: Object as PropType<{
			headline: string;
			items: FeaturedItem[];
		}>,
		default: undefined,
	},
});
</script>

<template>
	<section v-if="content?.items?.length" class="bg-[var(--surface-panel)] py-20 sm:py-28">
		<div class="mx-auto max-w-wide px-6 sm:px-10">
			<div class="flex flex-col gap-4 text-center sm:text-left">
				<h2 class="font-display text-3xl font-light italic text-[var(--ink-strong)] sm:text-4xl">
					{{ content?.headline }}
				</h2>
				<p class="text-sm uppercase tracking-[0.3em] text-[var(--ink-muted)]">Selected works</p>
			</div>

			<div class="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
				<article
					v-for="item in content.items"
					:key="item.id"
					class="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-[var(--surface-muted)] text-left shadow-[var(--shadow-app)] transition-transform duration-500 hover:-translate-y-1 hover:bg-[var(--surface-panel)]"
				>
					<div
						class="relative h-60 w-full overflow-hidden bg-black/40"
						:style="{
							backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.25), rgba(0,0,0,0.75)), url(${item.media.image})`,
							backgroundSize: 'cover',
							backgroundPosition: 'center',
						}"
						aria-hidden="true"
					/>
					<div class="flex flex-1 flex-col gap-4 p-6">
						<p class="text-xs uppercase tracking-[0.4em] text-[var(--ink-muted)]">
							{{ item.category }}
						</p>
						<h3 class="font-display text-2xl text-[var(--ink-strong)]">
							{{ item.title }}
						</h3>
						<p class="flex-1 text-sm leading-relaxed text-[var(--ink-muted)]">
							{{ item.summary }}
						</p>
						<NuxtLink
							:to="`/work/${item.id}`"
							class="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)] transition-colors duration-300 group-hover:text-[var(--color-accent-strong)]"
						>
							Explore
							<span aria-hidden="true" class="translate-y-[1px] transition-transform duration-300 group-hover:translate-x-1">
								→
							</span>
						</NuxtLink>
					</div>
				</article>
			</div>
		</div>
	</section>
</template>
