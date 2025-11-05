<script setup lang="ts">
const { section } = useSiteContent();

const home = section('home');

const heroContent = computed(() => home.value?.hero);
const introContent = computed(() => home.value?.intro);
const featuredContent = computed(() => home.value?.featured);
const testimonialsContent = computed(() => home.value?.testimonials);
</script>

<template>
	<div class="flex min-h-screen flex-col">
		<HomeHero :content="heroContent" />
		<HomeIntro :content="introContent" />
		<HomeFeatured :content="featuredContent" />
		<HomeTestimonials :content="testimonialsContent" />
	</div>
</template>
