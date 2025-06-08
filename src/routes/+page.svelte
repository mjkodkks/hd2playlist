<script lang="ts">
    import PlayerBottomBar from '$lib/playerBottomBar.svelte';
    import { currentSongSrc , currentSongTitle} from '../store/store'

    import { onMount } from 'svelte';

    currentSongSrc.set('/hd1.mp3');
    currentSongTitle.set('A Cup of Liber-tea');
    let songTitle = $currentSongTitle;
    let audioSrc = $currentSongSrc;

    let playerBottomBarComponent: PlayerBottomBar

    $effect(() => {
        console.log('Current song title:', songTitle);
        console.log('Current audio source:', audioSrc);
    });

</script>

<div>
    <PlayerBottomBar bind:this={playerBottomBarComponent} songTitle={songTitle} audioSrc={audioSrc} >
    </PlayerBottomBar>
</div>

<style>
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
        animation: zoomSlow 90s infinite alternate;
    }
</style>
