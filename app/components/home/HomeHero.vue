<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { CalendarDays, HelpCircle, Mail, ChevronDown } from 'lucide-vue-next';
import SplitText from 'gsap/SplitText';
import { useNuxtApp } from '#app';
import BaseButton from '~/components/base/BaseButton.vue';
import { objectPositionFor } from '~/utils/objectPosition';
import { waitForDelay } from '~/utils/delay';
import type { HeroContent, HeroElements, HeroSetup, HeroSlide } from '~/types';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/dialog';

const props = defineProps<{ content?: HeroContent }>();

const slides = computed<HeroSlide[]>(() => props.content?.slides ?? []);
const firstSlide = computed(() => slides.value[0] ?? null);

const slidesContainer = ref<HTMLElement | null>(null);
const siteHeaderRef = ref<HTMLElement | null>(null);

const isHeroReady = ref(false);
const isPreparingHero = ref(false);
const introPlayed = ref(false);
const hasMounted = ref(false);
const infoCollapsed = ref(true);

// Store timelines per slide (each slide has its own set of timelines)
interface SlideTimelines {
	altIndicator: gsap.core.Timeline | null;
	altText: gsap.core.Timeline | null;
	tagline: gsap.core.Timeline | null;
	title: gsap.core.Timeline | null;
	subtitle: gsap.core.Timeline | null;
	cta: gsap.core.Timeline | null;
	figure: gsap.core.Timeline | null;
}

const slideTimelines = new Map<number, SlideTimelines>();

const contactEmail = 'german.toro-perez@zhdk.ch';
const contactEmailHref = 'mailto:german.toro-perez@zhdk.ch';
const contactPhone = '+41 43 446 55 01';
const contactPhoneHref = 'tel:+41434465501';
const contactWebsite = 'https://www.toro-perez.com';

// Hero Preloader: show / hide
const showHeroPreloader = () => {
	if (!import.meta.client) return;
	console.log('INVOKE showHeroPreloader');
	const body = document.body;
	body.classList.remove('hero-loader-hidden', 'loaded');
	body.classList.add('preload');
};

const hideHeroPreloader = async () => {
	if (!import.meta.client) return;
	console.log('INVOKE hideHeroPreloader');
	const body = document.body;
	body.classList.add('loaded');
	await waitForDelay(1400);
	body.classList.remove('preload', 'loaded');
	body.classList.add('hero-loader-hidden');
};

/**
 * Create timelines for a specific slide
 * This wraps all text content with SplitText and creates reusable timelines
 */
const createTimelinesForSlide = (slideIndex: number) => {
	if (!import.meta.client || !gsap) return;
	console.log('INVOKE createTimeliesForSlide, slideIndex = ', slideIndex);

	// CRITICAL: Don't recreate timelines if they already exist!
	// Recreating timelines resets elements to opacity: 0
	if (slideTimelines.has(slideIndex)) {
		console.log(`⏭️  Skipping timeline creation for slide ${slideIndex} - already exists`);
		return;
	}

	const slideContainerEl = slidesContainer.value;
	if (!slideContainerEl) return;

	const slideContainer = slideContainerEl.querySelector<HTMLElement>(`[data-slide-index="${slideIndex}"]`);
	if (!slideContainer) {
		console.warn(`Slide container not found for index ${slideIndex}`);
		return;
	}

	console.log(`🎬 Creating timelines for slide ${slideIndex}`);

	// Query all elements within this slide
	const figure = slideContainer.querySelector<HTMLElement>('figure');
	const altIndicatorDiv = slideContainer.querySelector<HTMLElement>('.absolute.bottom-8.right-\\[clamp\\(1\\.5rem\\,4vw\\,3rem\\)\\]');
	const altTextSpan = altIndicatorDiv?.querySelector<HTMLElement>('span');
	const contentWrapper = slideContainer.querySelector<HTMLElement>('.relative.z-10');
	const taglineP = contentWrapper?.querySelector<HTMLElement>('p.text-xs');
	const titleH1 = contentWrapper?.querySelector<HTMLElement>('h1');
	const subtitleP = contentWrapper?.querySelector<HTMLElement>('p.max-w-xl');
	const ctaButtons = contentWrapper?.querySelectorAll<HTMLElement>('a[href]');

	// CRITICAL: Explicitly set ALL child elements to opacity: 0 BEFORE creating timelines
	// This ensures no GSAP side effects from timeline creation can make elements visible
	// GSAP inline styles persist through Vue re-renders, unlike template styles
	if (figure) gsap.set(figure, { opacity: 0 });
	if (altIndicatorDiv) gsap.set(altIndicatorDiv, { opacity: 0 });
	if (altTextSpan) gsap.set(altTextSpan, { opacity: 0 });
	// Note: contentWrapper opacity is NOT controlled - it stays visible so children can be seen
	if (taglineP) gsap.set(taglineP, { opacity: 0 });
	if (titleH1) gsap.set(titleH1, { opacity: 0 });
	if (subtitleP) gsap.set(subtitleP, { opacity: 0 });
	if (ctaButtons && ctaButtons.length > 0) {
		gsap.set(Array.from(ctaButtons), { opacity: 0 });
	}

	// Create timelines object
	const timelines: SlideTimelines = {
		altIndicator: null,
		altText: null,
		tagline: null,
		title: null,
		subtitle: null,
		cta: null,
		figure: null,
	};

	// Alt indicator timeline
	if (altIndicatorDiv) {
		const tl = gsap.timeline({ paused: true });
		tl.fromTo(altIndicatorDiv, { opacity: 0, y: -16 }, { opacity: 1, y: 0, duration: 0.6 });
		timelines.altIndicator = tl;
	}

	// Alt text timeline (with SplitText)
	if (altTextSpan && altTextSpan.textContent && altTextSpan.textContent.trim()) {
		const split = new SplitText(altTextSpan, { type: 'lines,chars', linesClass: 'split-line' });
		if (split.chars && split.chars.length > 0) {
			gsap.set(split.lines, { display: 'inline-block' });
			gsap.set(split.chars, { opacity: 0, filter: 'blur(6px)' });

			const tl = gsap.timeline({ paused: true });
			tl.to(altTextSpan, { opacity: 1, duration: 0.01 }, 0);
			tl.fromTo(
				split.chars,
				{ opacity: 0, filter: 'blur(6px)' },
				{ opacity: 1, filter: 'blur(0px)', duration: 0.45, stagger: 0.03 },
				'<'
			);
			timelines.altText = tl;
		}
	}

	// Tagline timeline (with SplitText)
	if (taglineP && taglineP.textContent && taglineP.textContent.trim()) {
		const split = new SplitText(taglineP, { type: 'lines,chars', linesClass: 'split-line' });
		if (split.chars && split.chars.length > 0) {
			gsap.set(split.lines, { display: 'inline-block' });
			gsap.set(split.chars, { opacity: 0, filter: 'blur(6px)' });

			const tl = gsap.timeline({ paused: true });
			tl.to(taglineP, { opacity: 1, duration: 0.01 }, 0);
			tl.fromTo(
				split.chars,
				{ opacity: 0, filter: 'blur(6px)' },
				{ opacity: 1, filter: 'blur(0px)', duration: 0.45, stagger: 0.025 },
				0
			);
			timelines.tagline = tl;
		}
	}

	// Title timeline (with SplitText)
	if (titleH1 && titleH1.textContent && titleH1.textContent.trim()) {
		const split = new SplitText(titleH1, { type: 'lines,chars', linesClass: 'split-line' });
		if (split.chars && split.chars.length > 0) {
			gsap.set(split.lines, { display: 'inline-block' });
			gsap.set(split.chars, { opacity: 0, filter: 'blur(6px)' });

			const tl = gsap.timeline({ paused: true });
			tl.to(titleH1, { opacity: 1, duration: 0.01 }, 0);
			tl.fromTo(
				split.chars,
				{ opacity: 0, filter: 'blur(6px)' },
				{ opacity: 1, filter: 'blur(0px)', duration: 0.6, stagger: 0.03 },
				0
			);
			timelines.title = tl;
		}
	}

	// Subtitle timeline (with SplitText)
	if (subtitleP && subtitleP.textContent && subtitleP.textContent.trim()) {
		const split = new SplitText(subtitleP, { type: 'lines,chars', linesClass: 'split-line' });
		if (split.chars && split.chars.length > 0) {
			gsap.set(split.lines, { display: 'inline-block' });
			gsap.set(split.chars, { opacity: 0, filter: 'blur(6px)' });

			const tl = gsap.timeline({ paused: true });
			tl.to(subtitleP, { opacity: 1, duration: 0.01 }, 0);
			tl.fromTo(
				split.chars,
				{ opacity: 0, filter: 'blur(6px)' },
				{ opacity: 1, filter: 'blur(0px)', duration: 0.5, stagger: 0.02 },
				0
			);
			timelines.subtitle = tl;
		}
	}

	// CTA buttons timeline
	if (ctaButtons && ctaButtons.length > 0) {
		const tl = gsap.timeline({ paused: true });
		tl.fromTo(
			Array.from(ctaButtons),
			{ opacity: 0, y: 24 },
			{ opacity: 1, y: 0, duration: 0.45, stagger: 0.08 },
			0
		);
		timelines.cta = tl;
	}

	// Figure timeline - use .set() + .to() to ensure figure starts at opacity: 0
	if (figure) {
		const tl = gsap.timeline({ paused: true });
		tl.set(figure, { opacity: 0 }, 0);
		tl.to(figure, { opacity: 1, duration: 2 }, 0);
		timelines.figure = tl;
	}

	// Store timelines for this slide
	slideTimelines.set(slideIndex, timelines);
	console.log(`✅ Timelines created for slide ${slideIndex}`);
};

// Collect all DOM nodes and data required for hero animations
const collectHeroSetup = (): HeroSetup | null => {
	console.log('INVOKE collectHeroSetup');
	const slide = firstSlide.value;
	if (!slide) {
		console.warn('HomeHero: missing initial slide');
		return null;
	}

	const slideContainerEl = slidesContainer.value;

	const headerEl = siteHeaderRef.value ?? document.querySelector<HTMLElement>('.site-header');
	if (!siteHeaderRef.value && headerEl) {
		siteHeaderRef.value = headerEl;
	}
	const headerLogoEl = headerEl?.querySelector<HTMLElement>('[data-hero-logo]') ?? headerEl ?? null;

	if (!slideContainerEl) {
		if (hasMounted.value) {
			console.warn('HomeHero: missing hero elements', ['slidesContainer']);
		}
		return null;
	}

	const elements: HeroElements = {
		slides: slideContainerEl,
		header: headerEl ?? null,
		headerLogo: headerLogoEl,
	};

	return { slide, elements };
};

const waitForDocumentReady = () => new Promise<void>((resolve) => {
	if (typeof document === 'undefined') {
		resolve();
		return;
	}
	if (document.readyState === 'complete') {
		resolve();
		return;
	}
	window.addEventListener(
		'load',
		() => {
			resolve();
		},
		{ once: true },
	);
});

const waitForImageLoad = (src?: string | null) => new Promise<void>((resolve) => {
	if (!src || typeof window === 'undefined') {
		resolve();
		return;
	}
	const img = new Image();
	let settled = false;
	const cleanup = () => {
		if (settled) return;
		settled = true;
		window.clearTimeout(timeoutId);
		resolve();
	};
	const timeoutId = window.setTimeout(cleanup, 5000);
	img.onload = cleanup;
	img.onerror = cleanup;
	img.src = src;
	if (img.complete) {
		cleanup();
	}
});

const prepareHero = async () => {
	console.log('INVOKE prepareHero');
	if (!import.meta.client) return;
	if (isHeroReady.value || isPreparingHero.value) return;
	const heroSetup = collectHeroSetup();
	if (!heroSetup) return;

	isPreparingHero.value = true;
	try {
		if (!document.body.classList.contains('preload')) {
			showHeroPreloader();
		}
		await Promise.all([waitForDocumentReady(), waitForImageLoad(heroSetup.slide.image)]);
		await waitForDelay(1500);
		isHeroReady.value = true;
		await hideHeroPreloader();
	} finally {
		isPreparingHero.value = false;
	}
};

/**
 * Intro Timeline
 */
const { $gsap } = useNuxtApp();
const gsap = $gsap;
if (gsap && typeof window !== 'undefined' && 'registerPlugin' in gsap) {
	gsap.registerPlugin(SplitText);
}
const introTimeline = ref<gsap.core.Timeline | null>(null);

const playIntroTimeline = () => {
	if (!gsap || introPlayed.value) return;
	introTimeline.value?.kill();

	const heroSetup = collectHeroSetup();
	if (!heroSetup) return;

	const {
		slides: slideContainerEl,
		header: headerEl,
		headerLogo,
	} = heroSetup.elements;

	// Create timelines for the first slide (slide 0)
	createTimelinesForSlide(0);
	const firstSlideTimelines = slideTimelines.get(0);

	if (!firstSlideTimelines) {
		console.warn('Failed to create timelines for first slide');
		return;
	}

	// Create master timeline that nests all sub-timelines
	const master = gsap.timeline({
		defaults: { ease: 'power2.out' },
		onComplete: () => {
			// Initialize timelines for remaining slides (1, 2, 3, ...)
			// Use nextTick to ensure Vue has finished any pending DOM updates
			nextTick(() => {
				slides.value.forEach((slide, index) => {
					if (index > 0) {
						createTimelinesForSlide(index);
					}
				});
			});
		}
	});

	// 1. Slides container opacity
	master.to(slideContainerEl, { opacity: 1, duration: 0.05 }, 0);

	// 2. First slide container - make it visible and interactive
	const firstSlideContainer = slideContainerEl.querySelector<HTMLElement>('[data-slide-index="0"]');
	const contentWrapper = firstSlideContainer?.querySelector<HTMLElement>('.relative.z-10');
	if (firstSlideContainer) {
		master.set(firstSlideContainer, { opacity: 1, 'pointer-events': 'auto' }, 0);

		// Get first slide elements to set initial states
		const figure = firstSlideContainer.querySelector<HTMLElement>('figure');
		const altIndicatorDiv = firstSlideContainer.querySelector<HTMLElement>('.absolute.bottom-8.right-\\[clamp\\(1\\.5rem\\,4vw\\,3rem\\)\\]');

		// Set initial states BEFORE playing timelines
		if (figure) {
			master.set(figure, { opacity: 0 }, 0);
		}
		if (altIndicatorDiv) {
			master.set(altIndicatorDiv, { opacity: 0, y: -16 }, 0);
		}
	}

	// 3. Alt indicator (if exists)
	if (firstSlideTimelines.altIndicator) {
		master.add(firstSlideTimelines.altIndicator.play(), 0);
	}

	// 4. Alt text (if exists)
	if (firstSlideTimelines.altText) {
		master.add(firstSlideTimelines.altText.play(), '<');
	}

	// 5. Figure (image)
	if (firstSlideTimelines.figure) {
		master.add(firstSlideTimelines.figure.play(), '+=0.3');
	}

	// 6. Header
	if (headerEl) {
		// Set header opacity immediately to 1 so it doesn't block children animations
		master.set(headerEl, { opacity: 1 });

		if (headerLogo) {
			master.fromTo(
				headerLogo,
				{ opacity: 0, y: -16 },
				{ opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', immediateRender: false }
			);
		}

		master.add(() => headerEl.classList.remove('site-header--intro'));
	}

	// 7. Set contentWrapper to opacity 1 RIGHT BEFORE text children animate
	if (contentWrapper) {
		master.set(contentWrapper, { opacity: 1 });
	}

	// 8. Tagline (if exists)
	if (firstSlideTimelines.tagline) {
		master.add(firstSlideTimelines.tagline.play(), '<');
	}

	// 9. Title (if exists)
	if (firstSlideTimelines.title) {
		master.add(firstSlideTimelines.title.play(), '-=0.2');
	}

	// 10. Subtitle (if exists)
	if (firstSlideTimelines.subtitle) {
		master.add(firstSlideTimelines.subtitle.play(), '-=0.35');
	}

	// 11. CTA buttons (if exists)
	if (firstSlideTimelines.cta) {
		master.add(firstSlideTimelines.cta.play(), '-=0.2');
	}

	introTimeline.value = master;
	introPlayed.value = true;

	// TESTING: Skip intro animation for faster testing
	// master.progress(1);
};

watch(
	firstSlide,
	(slide, previous) => {
		if (slide && previous && slide.id !== previous.id) {
			isHeroReady.value = false;
			introPlayed.value = false;
			introTimeline.value?.kill();
			introTimeline.value = null;
			isPreparingHero.value = false;
		}
		void prepareHero();
	},
	{ immediate: true },
);

watch(
	isHeroReady,
	(ready) => {
		if (!ready) return;
		playIntroTimeline();
	},
);

onMounted(() => {
	hasMounted.value = true;
	showHeroPreloader();
	void prepareHero();
});

// Toggle collapse
const toggleCollapse = () => {
	infoCollapsed.value = !infoCollapsed.value;
};

onBeforeUnmount(() => {
	introTimeline.value?.kill();
	introTimeline.value = null;
	slideTimelines.clear();
	siteHeaderRef.value = null;
	isHeroReady.value = false;
	introPlayed.value = false;
	isPreparingHero.value = false;
	if (import.meta.client) {
		const body = document.body;
		body.classList.remove('preload', 'loaded');
		body.classList.add('hero-loader-hidden');
	}
});
</script>

<template>
	<section class="relative flex min-h-screen items-end justify-center overflow-hidden bg-(--surface-inverse) text-on-dark">
		<div ref="slidesContainer" style="opacity:0" class="absolute inset-0">
			<div
				v-for="(slide, index) in slides"
				:key="slide.id"
				:data-slide-index="index"
				class="slide-container absolute inset-0 flex items-end justify-center"
				style="opacity: 0; pointer-events: none"
			>
				<figure class="absolute inset-0" style="opacity: 0">
					<img
						:src="slide.image"
						:alt="slide.alt"
						class="h-full w-full object-cover"
						:style="{ objectPosition: objectPositionFor(slide.focus) }"
					/>
					<span class="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,11,17,0)0%,rgba(8,11,17,0.2)45%,rgba(8,11,17,0.7)80%,rgba(8,11,17,0.9)100%)]" />
				</figure>

				<div
					v-if="slide.alt"
					class="absolute bottom-8 right-[clamp(1.5rem,4vw,3rem)] z-20 flex max-w-88 flex-col gap-2 text-right text-sm uppercase tracking-widest text-white/85 sm:text-base"
					style="opacity:0"
				>
					<span style="opacity:0">{{ slide.alt }}</span>
				</div>

				<div
					class="relative z-10 mx-auto flex h-full w-full max-w-content items-end justify-end px-4 pb-4 pt-10 sm:px-6 sm:pb-20 sm:pt-24"
					style="opacity:0"
			>
					<div class="flex w-full flex-col items-stretch md:w-2/3">
						<div class="ml-auto flex w-full flex-col gap-0 rounded-md border border-white/15 bg-[color:rgba(8,15,20,0.25)] p-6 text-left text-on-dark backdrop-blur-2xl shadow-[0_45px_90px_-50px_rgba(0,0,0,0.85)] md:min-h-[66vh] md:gap-10 md:p-12"
						>
							<button
								type="button"
								class="toggle-info absolute right-6 top-6 z-10 flex items-center justify-center text-on-dark transition-colors hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent sm:hidden"
								@click="toggleCollapse"
								:aria-expanded="!infoCollapsed"
								aria-label="Toggle construction information"
							>
								<ChevronDown :size="24" :stroke-width="2" class="text-white drop-shadow-lg transition-transform duration-300"
									:class="infoCollapsed ? '' : 'rotate-180'"
								/>
							</button>

							<div class="flex flex-col md:flex-1">
								<h1 class="font-display text-4xl font-semibold tracking-[0.025em] text-[#0F7C7C] leading-[1.08] sm:text-6xl sm:leading-tight">
									Intermezzo
								</h1>

								<div class="overflow-hidden sm:!h-auto sm:!opacity-100"
									:class="infoCollapsed ? 'h-0 opacity-0' : 'h-auto opacity-100'"
								>
									<p class="mt-4 text-base leading-[1.85rem] text-on-dark/80 sm:mt-8 sm:text-xl sm:leading-[2.5rem]">
										Esteemed visitor, the site is presently undergoing a comprehensive rebuild. While the new experience takes shape, you can reach me via the contact details and consult the forthcoming concert schedule through the panels below. I appreciate your patience and continued interest.
									</p>
								</div>
							</div>

							<div class="overflow-hidden sm:!h-auto sm:!opacity-100"
								:class="infoCollapsed ? 'h-0 opacity-0' : 'h-auto opacity-100'"
							>
								<div class="mt-6 flex flex-wrap items-end gap-4 sm:mt-0 sm:gap-6">
								<Dialog>
									<DialogTrigger as-child>
										<BaseButton
											id="hero-contact"
											variant="secondary"
											size="lg"
											:custom-icon="Mail"
											class="button-hide-label-mobile mobile-button sm:px-8 sm:py-3"
											label="Contact"
										/>
								</DialogTrigger>
								<DialogContent class="mx-auto flex h-[90vh] max-h-[90vh] w-[92%] max-w-[60rem] flex-col overflow-hidden border border-white/10 bg-[rgba(8,12,16,0.92)] px-6 py-10 text-left text-on-dark sm:px-10 sm:py-12">
									<DialogHeader class="border-b border-[rgba(15,124,124,0.4)] pb-6">
										<DialogTitle class="text-3xl font-semibold leading-snug">Contact Information</DialogTitle>
										<DialogDescription class="text-on-dark/75 text-lg leading-relaxed">
											I remain available for correspondence throughout this redevelopment.
										</DialogDescription>
									</DialogHeader>
									<div class="modal-body flex-1 overflow-y-auto py-6 pr-2 text-on-dark/80 text-lg leading-relaxed">
										<p>
											<span class="font-semibold text-on-dark">Phone:</span>
											<a :href="contactPhoneHref" class="ml-2 underline decoration-white/30 underline-offset-4 hover:decoration-white">
												{{ contactPhone }}
											</a>
										</p>
										<p class="mt-4">
											<span class="font-semibold text-on-dark">Email:</span>
											<a :href="contactEmailHref" class="ml-2 underline decoration-white/30 underline-offset-4 hover:decoration-white">
												{{ contactEmail }}
											</a>
										</p>
										<p class="mt-4">
											<span class="font-semibold text-on-dark">Website:</span>
											<span class="ml-2">{{ contactWebsite }} <span class="text-on-dark/60">(Temporarily offline)</span></span>
										</p>
									</div>
									<DialogFooter class="mt-0 flex justify-end border-t border-[rgba(15,124,124,0.4)] pt-6">
										<DialogClose as-child>
											<BaseButton id="hero-contact-close" variant="secondary" size="lg" label="Close" class="w-auto" />
										</DialogClose>
									</DialogFooter>
								</DialogContent>
							</Dialog>

							<Dialog>
								<DialogTrigger as-child>
									<BaseButton
										id="hero-calendar"
										variant="secondary"
										size="lg"
										:custom-icon="CalendarDays"
										class="button-hide-label-mobile mobile-button sm:px-8 sm:py-3"
										label="Upcoming Concerts"
									/>
									</DialogTrigger>
								<DialogContent class="mx-auto flex h-[90vh] max-h-[90vh] w-[92%] max-w-[60rem] flex-col overflow-hidden border border-white/10 bg-[rgba(8,12,16,0.92)] px-6 py-10 text-left text-on-dark sm:px-10 sm:py-12">
									<DialogHeader class="border-b border-[rgba(15,124,124,0.4)] pb-6">
										<DialogTitle class="text-3xl font-semibold leading-snug">Upcoming Concert Dates</DialogTitle>
									</DialogHeader>
									<div class="modal-body flex-1 overflow-y-auto py-6 pr-2 text-on-dark/80 text-lg leading-relaxed">
										<p>Coming soon.</p>
									</div>
									<DialogFooter class="mt-0 flex justify-end border-t border-[rgba(15,124,124,0.4)] pt-6">
										<DialogClose as-child>
											<BaseButton id="hero-calendar-close" variant="secondary" size="lg" label="Close" class="w-auto" />
										</DialogClose>
									</DialogFooter>
								</DialogContent>
							</Dialog>

							<Dialog>
								<DialogTrigger as-child>
									<BaseButton
										id="hero-rebuild"
										variant="secondary"
										size="lg"
										:custom-icon="HelpCircle"
										class="button-hide-label-mobile mobile-button sm:px-8 sm:py-3"
										label="Why this rebuild?"
									/>
									</DialogTrigger>
								<DialogContent class="mx-auto flex h-[90vh] max-h-[90vh] w-[92%] max-w-[60rem] flex-col overflow-hidden border border-white/10 bg-[rgba(8,12,16,0.92)] px-6 py-10 text-left text-on-dark sm:px-10 sm:py-12">
									<DialogHeader class="border-b border-[rgba(15,124,124,0.4)] pb-6">
										<DialogTitle class="text-3xl font-semibold leading-snug">About the Rebuild</DialogTitle>
										<DialogDescription class="text-on-dark/75 text-lg leading-relaxed">
											This overhaul will better reflect current projects and research activities.
										</DialogDescription>
									</DialogHeader>
									<div class="modal-body flex-1 overflow-y-auto py-6 pr-2 text-on-dark/80 text-lg leading-relaxed">
										<p>
											The forthcoming design will offer clearer access to scores, recordings, and archival documentation, complemented by multilingual resources for presenters and scholars.
										</p>
										<p class="mt-4">Your patience during this transition is sincerely appreciated.</p>
									</div>
									<DialogFooter class="mt-0 flex justify-end border-t border-[rgba(15,124,124,0.4)] pt-6">
										<DialogClose as-child>
											<BaseButton id="hero-rebuild-close" variant="secondary" size="lg" label="Close" class="w-auto" />
										</DialogClose>
									</DialogFooter>
								</DialogContent>
							</Dialog>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<style>
.modal-body {
	scrollbar-width: thin;
	scrollbar-color: rgba(15, 124, 124, 0.65) transparent;
}

.modal-body::-webkit-scrollbar {
	width: 6px;
}

.modal-body::-webkit-scrollbar-track {
	background: transparent;
}

.modal-body::-webkit-scrollbar-thumb {
	background: rgba(15, 124, 124, 0.65);
	border-radius: 9999px;
}

.modal-body::-webkit-scrollbar-thumb:hover {
	background: rgba(15, 124, 124, 0.8);
}

@media (max-width: 640px) {
	.button-hide-label-mobile > span > span:last-child {
		display: none;
	}

	.mobile-button {
		height: 2.75rem;
		padding: 0.5rem;
	}

	.mobile-button > span {
		gap: 0;
		justify-content: center;
		width: 100%;
	}

	.mobile-button svg {
		width: 1.75rem !important;
		height: 1.75rem !important;
	}

	.mobile-button > span > svg:first-child {
		margin-right: 0 !important;
	}
}
</style>
