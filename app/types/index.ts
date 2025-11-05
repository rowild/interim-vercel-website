export type HeroCtaButton = {
	text: string;
	href: string;
	target?: string;
};

export type HeroSlide = {
	id: string;
	image: string;
	alt: string;
	focus?: string;
	tagline?: string;
	title?: string;
	subtitle?: string;
	url?: string;
	ctaPrimary?: HeroCtaButton;
	ctaSecondary?: HeroCtaButton;
};

export type HeroContent = {
	title: string;
	subtitle?: string;
	tagline?: string;
	ctaPrimary?: { label: string; to: string };
	ctaSecondary?: { label: string; to: string };
	slides: HeroSlide[];
};

export type HeroElements = {
	slides: HTMLElement;
	header: HTMLElement | null;
	headerLogo: HTMLElement | null;
};

export type HeroSetup = {
	slide: HeroSlide;
	elements: HeroElements;
};
