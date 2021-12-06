<script>
  export let title, date, vignette, link, index = 0;
  import { fly } from 'svelte/transition';
  import {onMount} from "svelte";
  import SlideStuff from "./slide_stuff.svelte";
  import Util from "../util.js";
  let element, y_off = 0;
  let loaded = false;
  let image_el;
  onMount(()=>{
    image_el.src = vignette.formats.small;
    image_el.onload = ()=>{
      loaded = true;
    }
  });
  /*
  export const on_update = () =>{
    let element_y = element.getBoundingClientRect().y;
    let offset = Util.map(
      element_y,
      -element.getBoundingClientRect().height,
      window.innerHeight,
      -1,
      1
    );
     y_off = `${(offset * 10) - 10}%`;
  }
  */
</script>

<a
  transition:fly={{y:100, delay:index * 100}}
  bind:this={element}
  sveltekit:prefetch
  href="{link}"
  class=""
>
  <div class="preview">
  <picture>
      <source srcset={vignette.formats.medium}
              media="(max-width: 920px)">
      <source srcset={vignette.formats.large}
              media="(max-width: 1920px)">
      <img
      bind:this={image_el}
      class="img_preview"
      alt={vignette.alt}
      class:hidden={!loaded}
      loading="lazy"
      />
  </picture>
  </div>
  <h3 class="title">
    <SlideStuff text={`${title} ${date}`}/>
  </h3>
</a>

<style>

 .preview {
  background-color: rgba(0,0,0,0.5);
  position: relative;
  overflow: clip;
  width: 100%;
  height: 0;
  padding-bottom: calc(100% / (1/1.4));
  border-radius: .1em;
  overflow: hidden;
}

  .img_preview{
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.2s ease-out, transform .1s, top .1s;
  }

  .img_preview.hidden{
    opacity: 0;
  }

 a{
  text-decoration: none;
}
 a:hover .img_preview{
  transform: scale(1.05);
}


</style>
