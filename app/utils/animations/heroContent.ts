import { createTextSplitReveal } from './textSplit';
import type { TextSplitOptions } from './textSplit';

/**
 * Animates all hero text content (tagline, title, subtitle)
 * Returns object with individual timelines for flexible composition
 */
export interface HeroContentElements {
	tagline: HTMLElement | null;
	title: HTMLElement | null;
	subtitle: HTMLElement | null;
}

export interface HeroContentTimelines {
	tagline: gsap.core.Timeline | null;
	title: gsap.core.Timeline | null;
	subtitle: gsap.core.Timeline | null;
}

/**
 * Creates standalone animations for hero content elements
 * Useful for gallery slider reuse
 *
 * @example
 * const { tagline, title, subtitle } = createHeroContentAnimations({
 *   tagline: taglineEl.value,
 *   title: titleEl.value,
 *   subtitle: subtitleEl.value
 * }, gsap);
 *
 * // Compose into master timeline
 * const master = gsap.timeline();
 * if (tagline) master.add(tagline, 0);
 * if (title) master.add(title, '-=0.2');
 * if (subtitle) master.add(subtitle, '-=0.35');
 */
export function createHeroContentAnimations(
	elements: HeroContentElements,
	gsap: any,
): HeroContentTimelines {
	const taglineAnimation = createTextSplitReveal({
		element: elements.tagline,
		gsap,
		duration: 0.45,
		stagger: 0.025,
	});

	const titleAnimation = createTextSplitReveal({
		element: elements.title,
		gsap,
		duration: 0.6,
		stagger: 0.03,
	});

	const subtitleAnimation = createTextSplitReveal({
		element: elements.subtitle,
		gsap,
		duration: 0.5,
		stagger: 0.02,
	});

	return {
		tagline: taglineAnimation.timeline,
		title: titleAnimation.timeline,
		subtitle: subtitleAnimation.timeline,
	};
}
