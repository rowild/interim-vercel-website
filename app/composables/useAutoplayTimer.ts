import { computed, onBeforeUnmount, ref } from 'vue';
import { useIntervalFn } from '@vueuse/core';

export const useAutoplayTimer = (durationSeconds = 10) => {
	const countdown = ref(durationSeconds);

	const { pause, resume } = useIntervalFn(
		() => {
			countdown.value = countdown.value <= 1 ? durationSeconds : countdown.value - 1;
		},
		1000,
		{ immediate: false },
	);

	const reset = () => {
		countdown.value = durationSeconds;
	};

	const start = () => {
		if (!import.meta.client) return;
		reset();
		resume();
	};

	const stop = () => {
		pause();
		reset();
	};

	const resumeTimer = () => {
		if (!import.meta.client) return;
		resume();
	};

	const pauseTimer = () => {
		pause();
	};

	onBeforeUnmount(() => {
		pause();
	});

	const progress = computed(() => 1 - countdown.value / durationSeconds);

	return {
		countdown,
		progress,
		start,
		stop,
		reset,
		resume: resumeTimer,
		pause: pauseTimer,
	};
};
