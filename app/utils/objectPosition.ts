export const objectPositionFor = (focus?: string): string => {
	if (!focus) {
		return 'center center';
	}

	const trimmed = focus.trim();
	if (!trimmed) {
		return 'center center';
	}

	const tokens = trimmed.split(/\s+/);
	let horizontal: string = 'center';
	let vertical: string = 'center';
	let hasCustomToken = false;

	for (const token of tokens) {
		const lower = token.toLowerCase();
		switch (lower) {
			case 'left':
			case 'right':
				horizontal = lower;
				break;
			case 'top':
			case 'bottom':
				vertical = lower;
				break;
			case 'center':
				break;
			default:
				hasCustomToken = true;
				break;
		}
	}

	if (hasCustomToken) {
		// Mixed values like "25% 10px" or custom keywords should pass through untouched.
		return trimmed;
	}

	return `${horizontal} ${vertical}`;
};
