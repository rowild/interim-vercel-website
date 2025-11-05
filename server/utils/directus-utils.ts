import type { DirectusFile } from '@directus/sdk';

type AssetLike = string | Pick<DirectusFile, 'id'> | null | undefined;

export function getDirectusAssetURL(fileOrString: AssetLike): string {
	if (!fileOrString) return '';

	const { public: runtimePublic } = useRuntimeConfig();
	const directusUrl = runtimePublic.directusUrl;
	if (!directusUrl) return '';

	const assetId = typeof fileOrString === 'string' ? fileOrString : fileOrString.id;
	return `${directusUrl}/assets/${assetId}`;
}
