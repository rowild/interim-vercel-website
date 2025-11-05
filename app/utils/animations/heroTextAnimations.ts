import SplitText from 'gsap/SplitText';

export interface TextAnimationOptions {
	element: HTMLElement | null;
	gsap: any;
	split?: SplitText | null;
	duration?: number;
	stagger?: number;
	ease?: string;
}

/**
 * Creates a reversible timeline for alt text reveal
 * Can be reversed for gallery transitions
 */
export function createAltTextReveal(options: TextAnimationOptions) {
	const { element, gsap, split, duration = 0.45, stagger = 0.03, ease = 'power2.out' } = options;

	if (!element || !gsap || !split?.chars.length) {
		return null;
	}

	const timeline = gsap.timeline();
	timeline.to(element, { opacity: 1, duration: 0.01 }, 0);
	timeline.fromTo(
		split.chars,
		{ opacity: 0, filter: 'blur(6px)' },
		{ opacity: 1, filter: 'blur(0px)', duration, stagger },
		'<'
	);

	return timeline;
}

/**
 * Creates a reversible timeline for tagline reveal
 * Can be reversed for gallery transitions
 */
export function createTaglineReveal(options: TextAnimationOptions) {
	const { element, gsap, split, duration = 0.45, stagger = 0.025, ease = 'power2.out' } = options;

	if (!element || !gsap || !split?.chars.length) {
		return null;
	}

	const timeline = gsap.timeline();
	timeline.to(element, { opacity: 1, duration: 0.01 }, 0);
	timeline.fromTo(
		split.chars,
		{ opacity: 0, filter: 'blur(6px)' },
		{ opacity: 1, filter: 'blur(0px)', duration, stagger },
		0
	);

	return timeline;
}

/**
 * Creates a reversible timeline for title reveal
 * Can be reversed for gallery transitions
 */
export function createTitleReveal(options: TextAnimationOptions) {
	const { element, gsap, split, duration = 0.6, stagger = 0.03, ease = 'power2.out' } = options;

	if (!element || !gsap || !split?.chars.length) {
		return null;
	}

	const timeline = gsap.timeline();
	timeline.to(element, { opacity: 1, duration: 0.01 }, 0);
	timeline.fromTo(
		split.chars,
		{ opacity: 0, filter: 'blur(6px)' },
		{ opacity: 1, filter: 'blur(0px)', duration, stagger },
		0
	);

	return timeline;
}

/**
 * Creates a reversible timeline for subtitle reveal
 * Can be reversed for gallery transitions
 */
export function createSubtitleReveal(options: TextAnimationOptions) {
	const { element, gsap, split, duration = 0.5, stagger = 0.02, ease = 'power2.out' } = options;

	if (!element || !gsap || !split?.chars.length) {
		return null;
	}

	const timeline = gsap.timeline();
	timeline.to(element, { opacity: 1, duration: 0.01 }, 0);
	timeline.fromTo(
		split.chars,
		{ opacity: 0, filter: 'blur(6px)' },
		{ opacity: 1, filter: 'blur(0px)', duration, stagger },
		0
	);

	return timeline;
}

/**
 * Creates a reversible timeline for CTA buttons reveal
 * Can be reversed for gallery transitions
 */
export function createCtaReveal(elements: HTMLElement[], gsap: any) {
	if (!elements.length || !gsap) {
		return null;
	}

	const timeline = gsap.timeline();
	timeline.fromTo(
		elements,
		{ opacity: 0, y: 24 },
		{ opacity: 1, y: 0, duration: 0.45, stagger: 0.08 },
		0
	);

	return timeline;
}

/**
 * Creates fadeout animations for text chars
 * Used in gallery transitions
 */
export function createTextFadeOut(options: TextAnimationOptions) {
	const { element, gsap, split, duration = 0.25, stagger = 0.005, ease = 'power2.in' } = options;

	if (!element || !gsap || !split?.chars.length) {
		return null;
	}

	const timeline = gsap.timeline();
	timeline.to(
		split.chars,
		{
			opacity: 0,
			filter: 'blur(6px)',
			duration,
			stagger,
			ease,
		},
		0
	);

	return timeline;
}

/**
 * Creates fadeout animation for CTA buttons
 */
export function createCtaFadeOut(elements: HTMLElement[], gsap: any) {
	if (!elements.length || !gsap) {
		return null;
	}

	const timeline = gsap.timeline();
	timeline.to(
		elements,
		{
			opacity: 0,
			y: -12,
			duration: 0.25,
			stagger: 0.04,
			ease: 'power2.in',
		},
		0
	);

	return timeline;
}
