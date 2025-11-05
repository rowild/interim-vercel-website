const preloadMarkup = `
<div class="hero-loader" data-hero-preloader>
	<div class="hero-loader__wrapper">
		<div class="hero-loader__ring">
			<span class="sr-only">Loading intro</span>
		</div>
		<p>Building Experience</p>
	</div>
</div>
`.trim();

const preloadStyles = `
<style id="hero-preloader-styles">
.hero-loader {
	position: fixed;
	inset: 0;
	display: none;
	place-items: center;
	z-index: 9999;
	background: transparent;
	color: rgba(255, 255, 255, 0.86);
	overflow: hidden;
	transform: translate(-4px, -4px);
	pointer-events: none;
	opacity: 0;
	visibility: hidden;
}

.hero-loader__wrapper {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 0.75rem;
	text-transform: uppercase;
	letter-spacing: 0.28em;
}

.hero-loader__ring {
	height: 5.5rem;
	width: 5.5rem;
	border-radius: 50%;
	border: 2px solid transparent;
	border-color: color-mix(in oklab, #fff 20%, transparent);
	border-left-color: color-mix(in oklab, #fff 40%, transparent);
	border-right-color: color-mix(in oklab, #fff 40%, transparent);
	border-top-color: color-mix(in oklab, #fff 80%, transparent);
	animation: heroLoaderSpin 1.4s linear infinite;
}

.hero-loader p {
	text-align: center;
	font-size: 0.72rem;
	text-transform: uppercase;
	letter-spacing: 0.36em;
	color: color-mix(in oklab, #fff 70%, transparent);
}

.hero-loader .sr-only {
	position: absolute;
	width: 1px;
	height: 1px;
	padding: 0;
	margin: -1px;
	overflow: hidden;
	clip-path: inset(50%);
	white-space: nowrap;
	border-width: 0;
}

body.preload .hero-loader {
	display: grid;
	opacity: 1;
	visibility: visible;
	animation: fadeIn 1.4s linear forwards;
}

body.loaded .hero-loader {
	display: grid;
	visibility: visible;
	animation: fadeOut 1.4s linear forwards;
}

body.hero-loader-hidden .hero-loader {
	display: none;
	opacity: 0;
	visibility: hidden;
	pointer-events: none;
}

@keyframes heroLoaderSpin {
	from { transform: rotate(0deg); }
	to { transform: rotate(360deg); }
}

@keyframes fadeIn {
	from { opacity: 0; }
	to { opacity: 1; }
}

@keyframes fadeOut {
	from { opacity: 1; }
	to { opacity: 0; }
}
</style>
`.trim();

export default defineNitroPlugin((nitroApp) => {
	nitroApp.hooks.hook('render:html', (html) => {
		html.head ||= [];
		html.bodyPrepend ||= [];

		if (!html.head.includes(preloadStyles)) {
			html.head.push(preloadStyles);
		}
		if (!html.bodyPrepend.includes(preloadMarkup)) {
			html.bodyPrepend.unshift(preloadMarkup);
		}
	});
});
