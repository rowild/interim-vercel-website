export interface ImageFadeOptions {
	element: HTMLElement | null;
	gsap: any;
	duration?: number;
	ease?: string;
	delay?: number;
	fromOpacity?: number;
	toOpacity?: number;
}

/**
 * Creates image fade-in animation
 * Reusable for hero intro and gallery transitions
 *
 * @example
 * const fadeTimeline = createImageFade({
 *   element: imageEl.value,
 *   gsap,
 *   duration: 2,
 *   fromOpacity: 0,
 *   toOpacity: 1
 * });
 *
 * // Later: reverse
 * fadeTimeline?.reverse();
 */
export function createImageFade(options: ImageFadeOptions): gsap.core.Timeline | null {
	const {
		element,
		gsap,
		duration = 2,
		ease = 'power2.out',
		delay = 0,
		fromOpacity = 0,
		toOpacity = 1,
	} = options;

	if (!element || !gsap) return null;

	return gsap.timeline().fromTo(
		element,
		{ opacity: fromOpacity },
		{ opacity: toOpacity, duration, ease, delay },
	);
}
