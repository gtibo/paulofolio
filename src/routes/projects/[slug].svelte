<script context="module">
  export async function load({
    params,
    fetch
  }) {
    const slug = params.slug;
    let res = await fetch(`/projects/${slug}.json`);
    if (res.status == 404) return {
      status: 404,
      error: new Error(`Ce projet n'existe pas`)
    }
    let project = await res.json();
    return {
      props: {
        project
      }
    }
  }
</script>
<script>
  export let project;
  import { fade, fly } from 'svelte/transition';
  import SlideStuff from "../_components/slide_stuff.svelte";
  import ImageContainer from "./_components/image_container.svelte";
  import VideoContainer from "./_components/video_container.svelte";
</script>
<svelte:head>
  <title>{project.title}</title>
</svelte:head>
<main class="main-wrap"
in:fade={{duration:100, delay:200}}
out:fade={{duration:100, delay:100}}
>
  <header>
    <a class="close" href="/">
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M11.3333 5L6 11M6 11L11.3333 17M6 11H15" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M15.5 25.5H16.75C20.7541 25.5 24 22.2541 24 18.25V18.25C24 14.2459 20.7541 11 16.75 11H15" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </a>

    <div class="info">
      <h1><SlideStuff d=0 text={project.title}/></h1>
      <span><SlideStuff d=400 text={`${project.type} | ${project.date}`}/></span>
    </div>


    <div class="banner"
    in:fly={{y:-100,duration:500, delay:500}}
    out:fly={{y:-100,duration:500}}

    style="
      background-image:linear-gradient(transparent 0%, #0D0D0F ),url({project.vignette.formats.large});
    "

    >

    </div>

  </header>
  <div class="container">
    {#each project.body as element}
      {#if element.type == "html"}
        <div class="markdown">
          {@html element.content}
        </div>
      {/if}
      {#if element.type == "video"}
        <VideoContainer meta={element} />
      {/if}
      {#if element.type == "image"}
        <ImageContainer element={element}/>
      {/if}
    {/each}
    {#if project.credits}
      <div class="markdown">
        <h3>Credits</h3>
        <p>{#each project.credits as credit, i}{credit}{#if i != project.credits.length - 1},
        {/if}{/each}</p>
      </div>
    {/if}
  </div>

  <footer>
  <div>
    {#if project.previous_project}
    <a sveltekit:prefetch href="/projects/{project.previous_project.slug}">
    <div class="info" >Previous project</div>
    <h4 class="title" >{project.previous_project.title}</h4>
    </a>
    {/if}
  </div>
  <div>
    {#if project.next_project}
    <a sveltekit:prefetch href="/projects/{project.next_project.slug}">
    <div class="info" >Next project</div>
    <h4 class="title" >{project.next_project.title}</h4>
    </a>
    {/if}
  </div>
  </footer>
</main>

<style>
.banner{
  position: absolute;
  width: 100%;
  height: 100%;
  top:0;
  background-position: top;
  background-size: cover;
  opacity: .8;
}

.banner img{
  height: 100%;
  object-fit: cover;
}
.close{
  position: fixed;
  z-index: 2;
  top:2.5em;
  left:2em;
  width:2em;
  height: 2em;
  font-weight: 600;
  text-transform: uppercase;
  text-decoration: none;
}
.close svg{
  pointer-events: none;
  width: 100%;
  height: 100%;
}
.close:hover{
  transform: rotate(20deg);
}

header{
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #0D0D0F;
  padding: 6em 0 4em 0;
}

header .info{
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
footer{
  margin-top: 2em;
  max-width: 1920px;
  width: 100%;
  display: flex;
  border-top:1px solid white;
}

footer a{
  text-decoration: none;
}

footer > div {
  padding: 2em 3em;
  flex: 1;
  transition: transform .2s ease-out;
}

footer div:last-child a{
  text-align: right;
  align-items: end;
}

footer .info,.title{
  margin: 0;
}

footer .info{
  font-size: .8em;
  opacity: .5;
  margin-bottom: .8em;
}


.container{
  max-width: 1200px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.container > :global(*) {
  margin-bottom: 2em;
}

picture{
  width: 100%;
}
img{
  width: 100%;
  height: auto;
  display: block;
}
.markdown{
  max-width: 72ch;
  text-align: center;
  padding: 0 2em;
  box-sizing: border-box;
}
</style>
