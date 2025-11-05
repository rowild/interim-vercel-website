<script setup lang="ts">
import type { PropType } from 'vue';

type FooterLink = {
	id: string;
	label: string;
	to: string;
};

type FooterContent = {
	tagline?: string;
	legal?: {
		copyright: string;
		imprint?: { label: string; to: string };
		privacy?: { label: string; to: string };
	};
	navigation?: FooterLink[];
	services?: string[];
};

type SocialProfile = {
	id: string;
	label: string;
	handle?: string;
	url: string;
};

const props = defineProps({
	footer: {
		type: Object as PropType<FooterContent | undefined>,
		default: undefined,
	},
	social: {
		type: Object as PropType<{ profiles: SocialProfile[] } | undefined>,
		default: undefined,
	},
});
</script>

<template>
	<footer class="bg-overlay text-on-dark">
		<div class="mx-auto max-w-wide px-6 py-16 sm:px-10 lg:px-16">
			<div class="grid grid-cols-1 gap-12 md:grid-cols-4">
				<div class="space-y-4">
					<ClientOnly>
						<!-- <SiteLogoAnimated class="h-12 w-auto" :interactive="false" title="Siegfried Ortner monogram" /> -->
						<template #fallback>
							<span class="block h-12 w-12 rounded-md border border-current"></span>
						</template>
					</ClientOnly>

					<p v-if="props.footer?.tagline" class="max-w-xs text-sm text-on-dark/70">
						{{ props.footer.tagline }}
					</p>
				</div>

				<div v-if="props.footer?.navigation?.length" class="space-y-3">
					<h3 class="text-xs font-semibold uppercase tracking-[0.2em] text-on-dark/70">Navigation</h3>
					<ul class="space-y-2 text-sm">
						<li v-for="link in props.footer.navigation" :key="link.id">
							<NuxtLink
								:to="link.to"
								class="transition-colors duration-200 hover:text-[var(--color-accent)]"
							>
								{{ link.label }}
							</NuxtLink>
						</li>
					</ul>
				</div>

				<div v-if="props.footer?.services?.length" class="space-y-3">
					<h3 class="text-xs font-semibold uppercase tracking-[0.2em] text-on-dark/70">Services</h3>
					<ul class="space-y-2 text-sm">
						<li v-for="service in props.footer.services" :key="service">
							{{ service }}
						</li>
					</ul>
				</div>

				<div v-if="props.social?.profiles?.length" class="space-y-3">
					<h3 class="text-xs font-semibold uppercase tracking-[0.2em] text-on-dark/70">Connect</h3>
					<ul class="space-y-2 text-sm">
						<li v-for="profile in props.social.profiles" :key="profile.id">
							<a
								class="transition-colors duration-200 hover:text-[var(--color-accent)]"
								:href="profile.url"
								target="_blank"
								rel="noopener noreferrer"
							>
								{{ profile.label }}
								<span v-if="profile.handle" class="ml-2 text-xs text-on-dark/50">{{ profile.handle }}</span>
							</a>
						</li>
					</ul>
				</div>
			</div>

			<div class="mt-12 border-t border-[var(--border-light)]/30 pt-6 text-xs text-on-dark/60">
				<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<span>
						{{ props.footer?.legal?.copyright }}
					</span>
					<div class="flex flex-wrap items-center gap-4 text-on-dark/70">
						<NuxtLink
							v-if="props.footer?.legal?.imprint"
							:to="props.footer.legal.imprint.to"
							class="transition-colors duration-200 hover:text-[var(--color-accent)]"
						>
							{{ props.footer.legal.imprint.label }}
						</NuxtLink>
						<NuxtLink
							v-if="props.footer?.legal?.privacy"
							:to="props.footer.legal.privacy.to"
							class="transition-colors duration-200 hover:text-[var(--color-accent)]"
						>
							{{ props.footer.legal.privacy.label }}
						</NuxtLink>
					</div>
				</div>
			</div>
		</div>
	</footer>
</template>
