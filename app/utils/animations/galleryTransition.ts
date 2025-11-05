import SplitText from 'gsap/SplitText';

export interface SlideElements {
	figure: HTMLElement;
	altText: HTMLElement | null;
	tagline: HTMLElement | null;
	title: HTMLElement | null;
	subtitle: HTMLElement | null;
}

export interface GalleryTransitionOptions {
	gsap: any;
	currentSlide: SlideElements;
	nextSlide: SlideElements;
	onComplete?: () => void;
	onStart?: () => void;
}

/**
 * Creates a gallery slide transition timeline
 *
 * Sequence:
 * 1. Fade out current slide text (2x speed) + alt text
 * 2. Fade out current image (starts 0.05s after text, lasts 0.1s longer)
 * 3. Fade in new alt text
 * 4. Fade in new image (overlaps with alt)
 * 5. Fade in new text content (overlaps with image)
 *
 * @example
 * const timeline = createGalleryTransition({
 *   gsap,
 *   currentSlide: { figure, altText, tagline, title, subtitle },
 *   nextSlide: { figure, altText, tagline, title, subtitle },
 *   onComplete: () => console.log('Transition complete')
 * });
 *
 * // Kill on rapid click
 * timeline?.kill();
 */
export function createGalleryTransition(options: GalleryTransitionOptions): gsap.core.Timeline | null {
	const { gsap, currentSlide, nextSlide, onComplete, onStart } = options;

	if (!gsap) return null;

	const masterTimeline = gsap.timeline({
		onStart,
		onComplete,
	});

	// ===== PHASE 1: FADE OUT CURRENT SLIDE =====
	const fadeOutTimeline = gsap.timeline();

	// Collect current slide text elements for fadeout
	const currentTextElements: HTMLElement[] = [];
	if (currentSlide.tagline) currentTextElements.push(currentSlide.tagline);
	if (currentSlide.title) currentTextElements.push(currentSlide.title);
	if (currentSlide.subtitle) currentTextElements.push(currentSlide.subtitle);

	// Fade out all text elements in parallel
	if (currentTextElements.length > 0) {
		fadeOutTimeline.to(
			currentTextElements,
			{
				opacity: 0,
				filter: 'blur(4px)',
				duration: 0.25,
				ease: 'power2.in',
			},
			0
		);
	}

	// Fade out alt text simultaneously with other text
	if (currentSlide.altText) {
		fadeOutTimeline.to(
			currentSlide.altText,
			{
				opacity: 0,
				duration: 0.25,
				ease: 'power2.in',
			},
			0
		);
	}

	// Apply 2x speed to text fadeout
	fadeOutTimeline.timeScale(2); // Text fades out in ~0.125s

	// Fade out image (starts 0.05s after text, lasts 0.1s longer)
	fadeOutTimeline.to(
		currentSlide.figure,
		{
			opacity: 0,
			duration: 0.35,
			ease: 'power2.in',
		},
		0.05
	);

	masterTimeline.add(fadeOutTimeline, 0);

	// ===== PHASE 2: FADE IN NEW SLIDE =====
	// Get fadeout duration to calculate when to start fadein (seamless crossfade)
	const fadeOutDuration = fadeOutTimeline.duration();

	// Fade in new alt text
	if (nextSlide.altText) {
		masterTimeline.to(
			nextSlide.altText,
			{
				opacity: 1,
				duration: 0.3,
				ease: 'power2.out',
			},
			fadeOutDuration // Start immediately after fadeout
		);
	}

	// Fade in new image (overlaps with alt fadein)
	masterTimeline.to(
		nextSlide.figure,
		{
			opacity: 1,
			duration: 0.35,
			ease: 'power2.out',
		},
		`${fadeOutDuration}+=0.05` // Slight delay after alt starts
	);

	// Fade in new text content (starts before image finishes for smooth flow)
	const textFadeInStart = fadeOutDuration + 0.15;

	// Fade in tagline first (if exists)
	if (nextSlide.tagline) {
		masterTimeline.to(
			nextSlide.tagline,
			{
				opacity: 1,
				filter: 'blur(0px)',
				duration: 0.3,
				ease: 'power2.out',
			},
			textFadeInStart
		);
	}

	// Fade in title (if exists)
	if (nextSlide.title) {
		masterTimeline.to(
			nextSlide.title,
			{
				opacity: 1,
				filter: 'blur(0px)',
				duration: 0.35,
				ease: 'power2.out',
			},
			nextSlide.tagline ? `${textFadeInStart}+=0.1` : textFadeInStart
		);
	}

	// Fade in subtitle (if exists)
	if (nextSlide.subtitle) {
		const subtitleStart = nextSlide.title
			? `${textFadeInStart}+=0.25`
			: nextSlide.tagline
			? `${textFadeInStart}+=0.1`
			: textFadeInStart;

		masterTimeline.to(
			nextSlide.subtitle,
			{
				opacity: 1,
				filter: 'blur(0px)',
				duration: 0.3,
				ease: 'power2.out',
			},
			subtitleStart
		);
	}

	return masterTimeline;
}

/**
 * Helper to reset SplitText elements for a new transition
 * Reuses existing SplitText instance but resets char states
 */
export function resetSplitTextChars(split: SplitText | null, gsap: any, visible: boolean = false) {
	if (!split || !gsap) return;

	gsap.set(split.chars, {
		opacity: visible ? 1 : 0,
		filter: visible ? 'blur(0px)' : 'blur(6px)',
	});
}
