<script>
  export let meta;
  import {onMount} from "svelte";
  let time = 0, duration = 0, video_el, player_wrap;
  let playing = false;
  let is_full_screen = false;
  let user_moved = false,
      move_time_out;

  $: hide_ui = playing && !user_moved;

  onMount(()=>{
    video_el.src = `${meta.path}`;
    video_el.addEventListener('loadedmetadata', (event) => {
      duration = video_el.duration;
    });
  })

  function toggle(){
    duration = video_el.duration;
    playing = !playing;
    if(playing){
      video_el.play()
    }else{
      video_el.pause()
    }
  }

  function seek(e){
    let el_width = e.target.getBoundingClientRect().width,
        seek_percent = e.layerX/el_width;
    video_el.currentTime = duration * seek_percent;
  }

  function user_move(){
    if(move_time_out) clearTimeout(move_time_out);
    user_moved = true;
    move_time_out = setTimeout(()=>{
      user_moved = false;
    }, 1000);
  }

  function toggle_fullscreen(){
    if (!document.fullscreenElement) {
      player_wrap.requestFullscreen();
      is_full_screen = true;
    } else {
      document.exitFullscreen();
      is_full_screen = false;
    }
  }

  function second_to_timestamp(seconds){
    return new Date(seconds * 1000).toISOString().substr(14, 5);
  }

</script>

<svelte:head>
  <link rel="prefetch" href="/player/Play.svg">
  <link rel="prefetch" href="/player/Pause.svg">
</svelte:head>

<div
class="wrap"
on:pointermove={user_move}
bind:this={player_wrap}>

  <div class="shade" class:hidden={hide_ui}></div>
  <div class="timer" class:hidden={hide_ui}>
    {second_to_timestamp(time)} / {second_to_timestamp(duration)}
  </div>
  <div class="options" class:hidden={hide_ui}>
    <button
    on:click={toggle_fullscreen}
    class="fullscreen_button"
    >
      {#if is_full_screen}
        <img src="/player/Small.svg" alt="">
      {:else}
        <img src="/player/Full.svg" alt="">
      {/if}
    </button>
  </div>

  <div
  class="indicator"
  class:hidden={hide_ui}
  >
    {#if playing}
      <img src="/player/Pause.svg" alt="">
    {:else}
      <img src="/player/Play.svg" alt="">
    {/if}
  </div>
  <video
  preload="metadata"
  bind:this={video_el}
  bind:currentTime={time}
  on:click={toggle}
  width="1920"
  height="1080"
  >
  </video>
    <div
    class="track"
    class:hidden={hide_ui}
    on:click={seek}
    >
    <div class="current_time"
      style="width:{time/duration*100}%"
    ></div>
  </div>
</div>
<style>
.indicator{
  width: 3em;
  height: 3em;
  position: absolute;
  left:50%;
  top:50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  transition: all .2s;
}

.indicator img{
  opacity: .8;
  width: 100%;
  height: 100%;
}


.indicator.hidden{
  opacity: 0;
  transform: translate(-50%, -50%) scale(.9);
}

.shade{
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6));
  pointer-events: none;
  transition: opacity 0.2s;
}

.shade.hidden{
  opacity: 0;
}

.timer{
  position: absolute;
  left: 1em;
  top: 1em;
  font-size: .8em;
  font-weight: 600;
}

.timer.hidden{
  opacity: 0;
}

.wrap{
  z-index: 1;
  position: relative;
  overflow: clip;
  width: 100%;
  height: auto;
}

.current_time{
  position: absolute;
  height: 100%;
  background-color: #26C94A;
  transition: width .1s;
  pointer-events: none;
}

.track{
  bottom: 0;
  position: absolute;
  width: 100%;
  height: 1em;
  background: rgba(0,0,0,0.9);
  transition: transform 0.2s;
}


.track.hidden{
  transform: translateY(100%);
}


.fullscreen_button.hidden{
  opacity: 0;
}

.options{
  z-index: 2;
  background-color: rgba(0,0,0,.9);
  position: absolute;
  right: 2em;
  top:50%;
  transform: translate(0%, -50%);
  display: flex;
  flex-direction: column;
  transition: transform 0.2s, opacity .1s;
}

.options button{
  background: none;
  border: 0;
  padding: .6em;
  display: block;
}

.options button img{
  width: 100%;
  height: 100%;
  display: block;
}

.options.hidden{
  opacity: 0;
  transform: translate(50%, -50%);
}

video{
  width: 100%;
  height: auto;
  display: block;
  object-fit: contain;
}

</style>
