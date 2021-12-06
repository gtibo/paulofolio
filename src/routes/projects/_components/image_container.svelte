<script>
  export let element;
  import {onMount} from "svelte";
  let image_el, loaded = false;
  onMount(()=>{
    image_el.src = element.formats.small;
    image_el.onload = ()=>{
      loaded = true;
    }
  });

</script>

<div class="wrap">
  <div
  class="loader"
  class:hidden={loaded}
  ></div>
  <picture>
      <source srcset={element.formats.small}
              media="(max-width: 520px)">
      <source srcset={element.formats.medium}
              media="(max-width: 920px)">
      <source srcset={element.formats.large}
              media="(max-width: 1920px)">
      <img
      bind:this={image_el}
      class:loaded
      width={element.width}
      height={element.height}
      alt={element.alt}
      on:load={()=>{loaded = true;}}
      loading="lazy"
      />
  </picture>
</div>

<style>
.wrap{
  background-color: rgba(0,0,0,.6);
  height: auto;
  width: 100%;
  position: relative;
}
.loader{
  position: absolute;
  width: 2em;
  height: 2em;
  top:50%;
  left:50%;
  transform: translate(-50%,-50%);
  background-image: url("/favicon.png");
  background-size: cover;
  animation: blink .6s infinite alternate;
}
.loader.hidden{
  opacity: 0;
  animation: none;
  transition: opacity .1s;
}
@keyframes blink {
  from{
    opacity: 0;
  }
  to{
    opacity: 1;
  }
}
img{
  opacity: 0;
  width: 100%;
  height: auto;
  display: block;
  transition: opacity .2s ease-out;
}
img.loaded{
  opacity: 1;
}
picture{
  width: 100%;
}
</style>
