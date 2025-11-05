<script setup lang="ts">
import { computed } from 'vue';

const { content, section } = useSiteContent();
const route = useRoute();

const navigation = section('navigation');
const footer = section('footer');
const social = section('social');

const primaryNavigation = computed(() => navigation.value?.primary ?? []);
const footerContent = computed(() => footer.value);
const socialProfiles = computed(() => social.value);
const siteMeta = computed(() => content.value?.meta);
const isHomeRoute = computed(() => route.path === '/');

useHead({
	bodyAttrs: {
		class: 'antialiased font-sans bg-[var(--color-background)] text-[var(--color-ink)]',
	},
});

useSeoMeta({
	titleTemplate: (titleChunk) => {
		const base = siteMeta.value?.siteTitle ?? 'Siegfried Ortner';
		return titleChunk ? `${titleChunk} • ${base}` : base;
	},
	description: siteMeta.value?.siteDescription,
	ogSiteName: siteMeta.value?.siteTitle,
});
</script>

<template>
	<div class="relative min-h-screen overflow-hidden">
		<SiteHeader :class="['site-header', { 'site-header--intro': isHomeRoute }]" />
		<SiteSideNav :items="primaryNavigation" :class="{ 'site-side-nav--intro': isHomeRoute }" />

		<main class="relative">
			<NuxtPage />
		</main>

		<SiteFooter :footer="footerContent" :social="socialProfiles" />
	</div>
</template>
