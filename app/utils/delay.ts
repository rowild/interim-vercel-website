export function waitForDelay(ms: number): Promise<void> {
	return new Promise((resolve) => {
		const id = setTimeout(() => {
			clearTimeout(id);
			resolve();
		}, ms);
	});
}
