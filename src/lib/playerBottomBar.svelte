<script lang="ts">
	import type { Snippet } from 'svelte';
	import Icon from './icon.svelte';
	import { formatTime } from '$lib';

	interface Props {
		children?: Snippet;
		songTitle: string;
		audioSrc: string;
	}

	let { children, songTitle = '', audioSrc = '' }: Props = $props();

	export function handlePlayPause() {
		const audioElement = document.querySelector('audio');
		if (audioElement) {
			if (audioElement.paused) {
				audioElement.play();
			} else {
				audioElement.pause();
			}
		}
	}

	const audioState = $state({
		isPlaying: false
	});
	let audioDuration = $state(0);
	let audioDurationDerived = $derived(() => {
		return formatTime(audioDuration);
	});
	let audioCurrentTime = $state(0);
	let audioCurrentTimeDervided = $derived(() => {
		return formatTime(audioCurrentTime);
	});

	export function onAudioState() {
		return audioState;
	}

	// all event functions on effect
	function handlePlay() {
		audioState.isPlaying = true;
		console.log('Audio is playing', audioState.isPlaying);
		onAudioState();
	}

	function handlePause() {
		audioState.isPlaying = false;
		console.log('Audio is paused', audioState.isPlaying);
		onAudioState();
	}

	function handleStop() {
		const audioElement = document.querySelector('audio');
		if (audioElement) {
			audioElement.pause();
			audioElement.currentTime = 0; // Reset to the beginning
			audioState.isPlaying = false;
			console.log('Audio stopped', audioState.isPlaying);
			onAudioState();
		}
	}

	function handleEnded() {
		audioState.isPlaying = false;
		console.log('Audio playback ended', audioState.isPlaying);
		onAudioState();
	}

	function handleTimeUpdate() {
		const audioElement = document.querySelector('audio');
		if (audioElement) {
			audioCurrentTime = audioElement.currentTime;
		}
	}
	function handleLoadedMetadata(event: HTMLElementEventMap['loadedmetadata']) {
		const audioElement = document.querySelector('audio');
		if (audioElement) {
			console.log('Audio duration:', audioElement.duration);
			audioDuration = audioElement.duration;
			console.log('Audio metadata loaded', event);
		}
	}

	$effect(() => {
		const audioElement = document.querySelector('audio');
		if (audioElement) {
			audioElement.addEventListener('play', handlePlay);
			audioElement.addEventListener('pause', handlePause);
			audioElement.addEventListener('ended', handleEnded);
			audioElement.addEventListener('timeupdate', handleTimeUpdate);
			audioElement.addEventListener('loadedmetadata', handleLoadedMetadata);
		}

		return () => {
			if (audioElement) {
				audioElement.removeEventListener('play', handlePlay);
				audioElement.removeEventListener('pause', handlePause);
				audioElement.removeEventListener('ended', handleEnded);
				audioElement.removeEventListener('timeupdate', handleTimeUpdate);
				audioElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
			}
		};
	});
</script>

<div>
	<div
		class="player-bottom-bar fixed right-0 bottom-0 left-0 z-50 border-t border-gray-200 bg-white bg-clip-padding backdrop-blur-3xl backdrop-filter dark:border-gray-700 dark:bg-gray-800/70"
	>
		<div class="flex items-center justify-between p-4">
			<div class="flex items-center space-x-4">
				<button
					onclick={() => handlePlayPause()}
					class="cursor-pointer rounded-full border-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
					aria-label="Play/Pause"
				>
					<Icon size="6px" color="currentColor" name={audioState.isPlaying ? 'pause' : 'play'} />
				</button>
				<button
					onclick={() => handleStop()}
					class={`cursor-pointer rounded-full border-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 disabled:cursor-not-allowed disabled:opacity-50`}
					aria-label="Stop"
					disabled={!(audioCurrentTime > 0)}
				>
					<Icon size="6px" color="currentColor" name="stop" />
				</button>
				<span class="text-gray-700 dark:text-gray-300">Now Playing: {songTitle}</span>
				<div class="text-gray-500 dark:text-gray-400">
					{audioCurrentTimeDervided()} /
					{#if audioDuration > 0}
						{audioDurationDerived()}
					{:else}
						00:00
					{/if}
				</div>
			</div>
			<div>
				<audio controls>
					<source src={audioSrc} type="audio/mp3" />
					Your browser does not support the audio element.
				</audio>
			</div>
			<div>
				{#if children}
					{@render children()}
				{/if}
			</div>
		</div>
	</div>
</div>

<style>
</style>
