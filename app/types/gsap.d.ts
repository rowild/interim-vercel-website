import type { gsap as GsapInstance } from 'gsap';

declare module '#app' {
	interface NuxtApp {
		$gsap: GsapInstance | null;
	}
}

declare module 'vue' {
	interface ComponentCustomProperties {
		$gsap: GsapInstance | null;
	}
}

export {};
