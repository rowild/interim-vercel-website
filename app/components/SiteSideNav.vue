<script setup lang="ts">
import { computed, ref, type PropType } from 'vue';

type NavigationLink = {
	id: string;
	label: string;
	to: string;
};

const props = defineProps({
	items: {
		type: Array as PropType<NavigationLink[]>,
		default: () => [],
	},
});

const route = useRoute();

const labelsExpanded = ref(false);
const navRoot = ref<HTMLElement | null>(null);

const toggleLabels = () => {
	labelsExpanded.value = !labelsExpanded.value;
	if (labelsExpanded.value) {
		navRoot.value?.classList.remove('site-side-nav--tease');
	}
	if (typeof window !== 'undefined') {
		window.dispatchEvent(new CustomEvent('site-side-nav:toggle', { detail: { expanded: labelsExpanded.value } }));
	}
};

const toggleIconName = computed(() => (labelsExpanded.value ? 'feather:minimize-2' : 'feather:maximize-2'));

const toggleLabel = computed(() => (labelsExpanded.value ? 'Hide navigation labels' : 'Show navigation labels'));

const isActive = (link: NavigationLink) => {
	const [path] = link.to.split('#');
	const normalized = path || '/';
	return route.path === normalized || (normalized !== '/' && route.path.startsWith(normalized));
};
</script>

<template>
	<nav
		v-if="props.items.length"
		class="site-side-nav fixed right-8 top-1/2 z-30 -translate-y-1/2 sm:right-8"
		:class="{ 'site-side-nav--expanded': labelsExpanded }"
		ref="navRoot"
	>
		<div class="relative flex flex-col items-center justify-center gap-12 perspective-origin-center perspective-dramatic trans">
			<NuxtLink
				v-for="(link, index) in props.items"
				:key="link.id"
				:to="link.to"
				class="group relative flex items-center site-side-nav__item"
				:aria-current="isActive(link) ? 'page' : undefined"
			>
				<span class="relative z-10 flex h-4 w-4 items-center justify-center">
					<span
						class="site-side-nav__indicator absolute h-full w-full border border-(--ink-muted)"
						:class="{ 'site-side-nav__indicator--active': isActive(link) }"
					/>
				</span>
				<span
					v-if="index < props.items.length - 1"
					class="absolute left-1/2 top-full z-0 h-12 w-px -translate-x-1/2 bg-(--ink-soft)/30"
				/>
				<span
					class="site-side-nav__label absolute right-full mr-4 whitespace-nowrap rounded bg-(--surface-inverse)/80 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-on-dark backdrop-blur-sm"
				>
					{{ link.label }}
				</span>
			</NuxtLink>
			<button
				type="button"
				class="site-side-nav__toggle mt-4 flex cursor-pointer items-center justify-center transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent hover:text-white"
				@click="toggleLabels"
				:aria-expanded="labelsExpanded"
				:aria-pressed="labelsExpanded"
				:aria-label="toggleLabel"
				data-nav-toggle
			>
				<Icon :name="toggleIconName" :key="toggleIconName" class="site-side-nav__toggle-icon" aria-hidden="true" />
			</button>
		</div>
	</nav>
</template>

<style scoped>
.site-side-nav--intro .site-side-nav__item {
	opacity: 0;
}

.site-side-nav__indicator {
	--nav-indicator-radius: 12%;
	border-radius: var(--nav-indicator-radius);
	transition: border-radius 300ms ease-out, transform 300ms ease-out, border-color 300ms ease-out;
	transform: rotate(45deg) scale(1);
}

.group:hover .site-side-nav__indicator,
.site-side-nav__indicator--active {
	--nav-indicator-radius: 50%;
	transform: rotate(0deg) scale(1.1);
	border-color: #ffffff;
}


.site-side-nav__label {
	--nav-label-perspective: 600px;
	--nav-label-translate: 0.75rem;
	--nav-label-rotate-x: -45deg;
	--nav-label-rotate-y: -45deg;
	--nav-label-opacity: 0;
	opacity: var(--nav-label-opacity);
	transform-origin: 50% 50%;
	transform: perspective(var(--nav-label-perspective)) translate3d(var(--nav-label-translate), 0, 0) rotateX(var(--nav-label-rotate-x)) rotateX(var(--nav-label-rotate-y));
	background: rgba(0, 0, 0, 0.42);
	color: var(--color-ink-on-dark);
	transition: transform 320ms ease-out, opacity 320ms ease-out, background 260ms ease, color 260ms ease, box-shadow 260ms ease;
}

.group:hover .site-side-nav__label {
	--nav-label-translate: 0;
	--nav-label-rotate-x: 0deg;
	--nav-label-rotate-y: 0deg;
	--nav-label-opacity: 1;
}

.site-side-nav__label:hover,
.site-side-nav__label:focus-visible {
	background: #ffffff;
	color: #000;
	box-shadow: 0 8px 18px -12px rgba(0, 0, 0, 0.2);
}

.site-side-nav--expanded .site-side-nav__label,
.site-side-nav--tease .site-side-nav__label {
	--nav-label-translate: 0;
	--nav-label-rotate-x: 0deg;
	--nav-label-rotate-y: 0deg;
	--nav-label-opacity: 1;
}

.site-side-nav__item[aria-current='page'] .site-side-nav__label {
	background: #ffffff;
	color: #000;
	box-shadow: 0 12px 24px -14px rgba(0, 0, 0, 0.22);
}

.site-side-nav__item[aria-current='page'] {
	cursor: default;
}

.site-side-nav__toggle {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	padding: 0.3rem;
	line-height: 1;
	color: var(--ink-muted);
	transform: translateY(0);
	transition: color 280ms ease;  /* Removed transform transition - GSAP handles movement */
}

.site-side-nav__toggle-icon {
	width: 1.125rem;
	height: 1.125rem;
}

.site-side-nav--intro .site-side-nav__toggle {
	opacity: 0;
	transform: translateY(-40px);
	transition: none !important;  /* Disable CSS transition - GSAP controls the intro animation */
}

.site-side-nav__toggle:active {
	transform: translateY(-0.2rem);
}
</style>
