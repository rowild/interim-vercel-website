import { computed, type ComputedRef } from 'vue';
import rawSiteContent from '~/data/site-content.json';
import { siteContentSchema, type SiteContent, type LocaleContent } from '~/lib/site-content-schema';

const FALLBACK_LOCALE = 'en';

const parsedSiteContent = Object.freeze(siteContentSchema.parse(rawSiteContent)) as Readonly<SiteContent>;

const availableLocales = Object.keys(parsedSiteContent.locales);

const isLocaleAvailable = (value: string): value is string =>
	availableLocales.includes(value);

const normalizeLocale = (value?: string): string => {
	if (!value) {
		return FALLBACK_LOCALE;
	}

	return isLocaleAvailable(value) ? value : FALLBACK_LOCALE;
};

export interface UseSiteContentResult {
	locales: readonly string[];
	locale: ComputedRef<string>;
	content: ComputedRef<LocaleContent>;
	site: Readonly<SiteContent>;
	setLocale: (value: string) => void;
	section: <T extends keyof LocaleContent>(key: T) => ComputedRef<LocaleContent[T] | undefined>;
}

export const useSiteContent = (requestedLocale?: string): UseSiteContentResult => {
	const localeState = useState<string>('site-locale', () => FALLBACK_LOCALE);

	if (requestedLocale) {
		localeState.value = normalizeLocale(requestedLocale);
	}

	const locale = computed(() => normalizeLocale(localeState.value));

	const content = computed(() => {
		const activeLocale = locale.value;
		return parsedSiteContent.locales[activeLocale] ?? parsedSiteContent.locales[FALLBACK_LOCALE];
	});

	const section = <T extends keyof LocaleContent>(key: T) =>
		computed(() => content.value?.[key] ?? parsedSiteContent.locales[FALLBACK_LOCALE]?.[key]);

	const setLocale = (value: string) => {
		localeState.value = normalizeLocale(value);
	};

	return {
		locales: availableLocales,
		locale,
		content,
		site: parsedSiteContent,
		setLocale,
		section,
	};
};
