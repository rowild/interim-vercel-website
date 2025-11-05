import SplitText from 'gsap/SplitText';

export interface TextSplitOptions {
	element: HTMLElement | null;
	gsap: any;
	duration?: number;
	stagger?: number;
	ease?: string;
	delay?: number;
	onStart?: () => void;
	onComplete?: () => void;
}

export interface TextSplitResult {
	timeline: gsap.core.Timeline | null;
	split: SplitText | null;
	chars: Element[];
}

/**
 * Creates a reusable SplitText reveal animation
 * Returns null if element doesn't exist (graceful handling)
 *
 * @example
 * const { timeline, split } = createTextSplitReveal({
 *   element: titleEl.value,
 *   gsap,
 *   duration: 0.6,
 *   stagger: 0.03
 * });
 *
 * // Later: reverse animation
 * timeline?.reverse();
 */
export function createTextSplitReveal(options: TextSplitOptions): TextSplitResult {
	const {
		element,
		gsap,
		duration = 0.6,
		stagger = 0.03,
		ease = 'power2.out',
		delay = 0,
		onStart,
		onComplete,
	} = options;

	// Graceful exit if no element
	if (!element || !gsap) {
		return { timeline: null, split: null, chars: [] };
	}

	const split = new SplitText(element, {
		type: 'lines,chars',
		linesClass: 'split-line',
	});

	// Setup lines
	gsap.set(split.lines, {
		display: 'inline-block',
		whiteSpace: 'nowrap',
	});

	// Initial state
	gsap.set(split.chars, {
		opacity: 0,
		filter: 'blur(6px)',
	});

	element.dataset.split = 'true';

	// Create standalone timeline
	const tl = gsap.timeline({
		defaults: { ease },
		onStart,
		onComplete,
	});

	// Make element visible
	tl.to(element, { opacity: 1, duration: 0.01 }, 0);

	// Animate chars
	tl.fromTo(
		split.chars,
		{ opacity: 0, filter: 'blur(6px)' },
		{
			opacity: 1,
			filter: 'blur(0px)',
			duration,
			stagger,
		},
		delay,
	);

	return {
		timeline: tl,
		split,
		chars: split.chars,
	};
}
