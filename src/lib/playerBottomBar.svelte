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

	$effect(() => {

	});

	$effect(() => {
		const audioElement = document.querySelector('audio');
		if (audioElement) {
			audioElement.addEventListener('play', () => {
				audioState.isPlaying = true;
				console.log('Audio is playing', audioState.isPlaying);
			});
			audioElement.addEventListener('pause', () => {
				audioState.isPlaying = false;
				console.log('Audio is paused', audioState.isPlaying);
			});
			audioElement.addEventListener('ended', () => {
				audioState.isPlaying = false;
				console.log('Audio playback ended', audioState.isPlaying);
			});
            audioElement.addEventListener('timeupdate', () => {
                audioCurrentTime = audioElement.currentTime;
            });
            audioElement.addEventListener('loadedmetadata', (event) => {
                console.log('Audio duration:', audioElement.duration);
                audioDuration = audioElement.duration;
                console.log('Audio metadata loaded', event);
            });
		}
	});
</script>

<div>
	<div
		class="player-bottom-bar fixed right-0 bottom-0 left-0 z-50 border-t border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
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
				<span class="text-gray-700 dark:text-gray-300">Now Playing: {songTitle}</span>
                <div class="text-gray-500 dark:text-gray-400">
                    { audioCurrentTimeDervided() } /
                    {#if audioDuration > 0}
                        { audioDurationDerived() }
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
