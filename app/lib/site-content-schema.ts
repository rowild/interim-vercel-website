import { z } from 'zod';

const ctaSchema = z.object({
	label: z.string(),
	to: z.string(),
});

const heroCtaButtonSchema = z.object({
	text: z.string(),
	href: z.string(),
	target: z.string().optional(),
});

const navigationLinkSchema = z.object({
	id: z.string(),
	label: z.string(),
	to: z.string(),
});

const navigationSchema = z.object({
	primary: z.array(navigationLinkSchema),
	secondary: z.array(navigationLinkSchema).optional(),
});

const heroSlideSchema = z.object({
	id: z.string(),
	image: z.string().url().or(z.string().startsWith('/')),
	alt: z.string(),
	focus: z.string().optional(),
	tagline: z.string().optional(),
	title: z.string().optional(),
	subtitle: z.string().optional(),
	url: z.string().optional(),
	ctaPrimary: heroCtaButtonSchema.optional(),
	ctaSecondary: heroCtaButtonSchema.optional(),
});

const heroSchema = z.object({
	title: z.string(),
	subtitle: z.string().optional(),
	tagline: z.string().optional(),
	ctaPrimary: ctaSchema.optional(),
	ctaSecondary: ctaSchema.optional(),
	slides: z.array(heroSlideSchema).min(1),
});

const homeIntroSchema = z.object({
	headline: z.string(),
	body: z.string(),
});

const featuredItemSchema = z.object({
	id: z.string(),
	title: z.string(),
	category: z.string(),
	summary: z.string(),
	media: z.object({
		image: z.string().url(),
		alt: z.string(),
	}),
});

const featuredSchema = z.object({
	headline: z.string(),
	items: z.array(featuredItemSchema).min(1),
});

const testimonialEntrySchema = z.object({
	id: z.string(),
	name: z.string(),
	role: z.string(),
	quote: z.string(),
});

const testimonialsSchema = z.object({
	headline: z.string(),
	quote: z.string().optional(),
	entries: z.array(testimonialEntrySchema).min(1),
});

const aboutHeroSchema = z.object({
	title: z.string(),
	intro: z.string(),
	portrait: z.object({
		image: z.string(),
		alt: z.string(),
	}),
});

const aboutHighlightSchema = z.object({
	id: z.string(),
	label: z.string(),
	items: z.array(z.string()).min(1),
});

const aboutValueSchema = z.object({
	id: z.string(),
	title: z.string(),
	description: z.string(),
});

const aboutSchema = z.object({
	hero: aboutHeroSchema,
	biography: z.array(z.string()).min(1),
	highlights: z.array(aboutHighlightSchema).optional(),
	values: z
		.object({
			headline: z.string(),
			items: z.array(aboutValueSchema),
		})
		.optional(),
});

const workFilterSchema = z.object({
	id: z.string(),
	label: z.string(),
});

const workItemSchema = z.object({
	id: z.string(),
	title: z.string(),
	type: z.string(),
	year: z.number().optional(),
	summary: z.string(),
	media: z.object({
		image: z.string().url(),
		alt: z.string(),
	}),
});

const workSchema = z.object({
	headline: z.string(),
	intro: z.string().optional(),
	filters: z.array(workFilterSchema).optional(),
	items: z.array(workItemSchema),
});

const reviewEntrySchema = z.object({
	id: z.string(),
	source: z.string(),
	date: z.string().optional(),
	quote: z.string(),
});

const reviewSegmentSchema = z.object({
	id: z.string(),
	label: z.string(),
	entries: z.array(reviewEntrySchema).min(1),
});

const reviewsSchema = z.object({
	headline: z.string(),
	filterLabel: z.string().optional(),
	segments: z.array(reviewSegmentSchema),
	closing: z.string().optional(),
});

const contactSchema = z.object({
	headline: z.string(),
	intro: z.string().optional(),
	address: z
		.object({
			label: z.string(),
			body: z.string(),
		})
		.optional(),
	email: z
		.object({
			label: z.string(),
			value: z.string(),
		})
		.optional(),
	form: z
		.object({
			nameLabel: z.string(),
			emailLabel: z.string(),
			messageLabel: z.string(),
			submitLabel: z.string(),
			successMessage: z.string().optional(),
			errorMessage: z.string().optional(),
		})
		.optional(),
});

const socialProfileSchema = z.object({
	id: z.string(),
	label: z.string(),
	handle: z.string().optional(),
	url: z.string(),
});

const socialSchema = z.object({
	profiles: z.array(socialProfileSchema),
});

const footerSchema = z.object({
	tagline: z.string().optional(),
	legal: z
		.object({
			copyright: z.string(),
			imprint: ctaSchema.optional(),
			privacy: ctaSchema.optional(),
		})
		.optional(),
	navigation: z.array(navigationLinkSchema).optional(),
	services: z.array(z.string()).optional(),
});

const metaSchema = z.object({
	siteTitle: z.string(),
	siteDescription: z.string(),
	keywords: z.array(z.string()).optional(),
});

export const localeContentSchema = z.object({
	meta: metaSchema,
	navigation: navigationSchema.optional(),
	home: z
		.object({
			hero: heroSchema,
			intro: homeIntroSchema,
			featured: featuredSchema.optional(),
			testimonials: testimonialsSchema.optional(),
		})
		.optional(),
	about: aboutSchema.optional(),
	work: workSchema.optional(),
	reviews: reviewsSchema.optional(),
	contact: contactSchema.optional(),
	social: socialSchema.optional(),
	footer: footerSchema.optional(),
});

export const siteContentSchema = z
	.object({
		version: z.string(),
		locales: z.record(localeContentSchema),
	})
	.superRefine((data, ctx) => {
		if (!data.locales?.en) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "Missing required 'en' locale content.",
				path: ['locales'],
			});
		}
	});

export type SiteContent = z.infer<typeof siteContentSchema>;
export type LocaleContent = z.infer<typeof localeContentSchema>;
