<script lang="ts">
    import PlayerBottomBar from '$lib/playerBottomBar.svelte';
    import { currentSongSrc , currentSongTitle} from '../store/store'
    import { base } from '$app/paths';

    currentSongSrc.set(`${base}/hd1.mp3`);
    currentSongTitle.set('A Cup of Liber-tea');
    let songTitle = $currentSongTitle;
    let audioSrc = $currentSongSrc;
    let animationDuration = 90; // seconds
    // let animationDurationStyleDerived = $derived(() => {
    //     return `zoomSlow ` + Math.floor(animationDuration) + 's' + ' infinite alternate';
    // });
    let playerBottomBarComponent: PlayerBottomBar
    let audioState = $state({
        isPlaying: false
    });

    $effect(() => {
        console.log('Current song title:', songTitle);
        console.log('Current audio source:', audioSrc);
        const audoDummy = new Audio(audioSrc);
        audoDummy.addEventListener('loadedmetadata', (event) => {
            console.log('Audio duration:', audoDummy.duration);
            animationDuration = Math.floor(audoDummy.duration);
            // update :root css variable for animation duration
            document.documentElement.style.setProperty('--animation-zoomout', `zoomSlow ${animationDuration}s infinite alternate`);
        });

        audioState = playerBottomBarComponent.onAudioState();
        if (audioState) {
            console.log('Audio state:', audioState.isPlaying);
            if (audioState.isPlaying) {
                document.documentElement.style.setProperty('--animation-play-state', 'running');
            } else {
                document.documentElement.style.setProperty('--animation-play-state', 'paused');
            }
        }
    });

</script>

<div>
    <PlayerBottomBar bind:this={playerBottomBarComponent} songTitle={songTitle} audioSrc={audioSrc} >
    </PlayerBottomBar>
</div>

<style>
    :root {
        --animation-zoomout: none;
        --animation-play-state: paused;
    }
    :global(html) {
        height: 100%;
        margin: 0;
        padding: 0;
    }

    :global(body) {
        height: 100%;
        margin: 0;
        padding: 0;
        overflow: hidden;
        position: relative;
    }

    :global(body::before) {
        content: '';
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        background: url('/hd2bg_optimize.jpg') no-repeat center center fixed;
        background-size: cover;
        color: white;
        overflow: hidden;
        position: relative;
        z-index: 0;
        animation: var(--animation-zoomout);
        animation-play-state: var(--animation-play-state);
    }
</style>
