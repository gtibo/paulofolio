<script context="module">
  import { base } from '$app/paths';
  export async function load({
    fetch
  }) {
    const links_list = await fetch(`/content/links.json`)
      .then((r) => r.json());
    const about_content = await fetch(`/about.json`)
      .then((r) => r.json());
    const projects_list = await fetch(`/projects.json`)
      .then((r) => r.json());
    return {
      props: {
        projects_list,
        about_content,
        links_list
      }
    };
  }
</script>
<script>
  export let
  projects_list,
  about_content,
  links_list;
  import PCard from "./_components/project_card.svelte"
  import { fade, fly } from 'svelte/transition';
  import SlideStuff from "./_components/slide_stuff.svelte";
  import {onMount} from "svelte";

  let ThreeView;
  onMount(()=>{
    import("./_components/three_view.svelte").then(res => ThreeView = res.default);
  });

</script>
<svelte:head>
  <title>Folio</title>
</svelte:head>



<main
class="main-wrap"
>
  <header class="container">
  <div class="illustration">
    <svelte:component this="{ThreeView}" />
  </div>

    <div class="about">

        <h1>
          <SlideStuff d=0 text={about_content.name}/>
        </h1>
        <h2>
          <SlideStuff d=200 text={about_content.role}/>
        </h2>

        {@html about_content.body}
      {#each links_list as link}
        <a target="_blank" href={link.href}>
          <SlideStuff d=400 text={link.title}/>
        </a>
      {/each}
    </div>
  </header>
  <div class="gallery container">
  {#each projects_list as p, i}
    <PCard
      index={i}
      title={p.title}
      date={p.date}
      link="{base}/projects/{p.slug}"
      vignette={p.vignette}
    />
  {/each}
  </div>
  <footer class="container">
    <p>Design and development, Thibaud Goiffon</p>
    <p>Built with <a href="https://kit.svelte.dev/" target="_blank">SvelteKit</a>.</p>
  </footer>
</main>


<style>
  header{
    width: 100%;
    display: flex;
  }

  header .illustration{
    z-index: -1;
    position: absolute;
    right: 0;
    top:0;
    height: 100%;
    width: 100%;
    max-width: 1920px;
  }

  .illustration::after{
    content:"";
    position: absolute;
    bottom:0;
    left:0;
    width: 100%;
    height: 50%;
    background: linear-gradient(
      rgba(13, 13, 13, 0),
      rgba(13, 13, 13, 1)
      );
  }

  .about{
    max-width: 60%;
    padding: 2em 0;
  }
  .about a{
    font-weight: 600;
    text-transform: uppercase;
    text-decoration: none;
    font-size: .8em;
    margin-right: .8em;
  }
  .about a:last-child{
    margin-right: 0;
  }
  .container{
    max-width: 1200px;
    width: 100%;
    padding:2em;
    box-sizing: border-box;
  }

  .gallery{
    display: grid;
    grid-template-columns: auto auto;
    grid-gap: 4em 6em ;
    margin-bottom: 8em;

  }
  .gallery > :global(*:nth-child(even)){
    transform: translateY(8em);
  }


  footer{
    font-size: .8em;
    border-top: 1px solid rgba(255,255,255,0.2);
    color:rgba(255,255,255,0.6);
  }

  @media (max-width:600px) {
    .about{
      max-width: none;
    }
    .gallery{
      display: grid;
      grid-template-columns: auto;
      grid-gap: 2em;
      margin-bottom: 0;
    }

    .gallery > :global(*:nth-child(even)){
      transform: none;
    }
    header .illustration{
      position: relative;
      top:0;
      height: 60vh;
      width: 100%;
    }
    header{
      min-height: unset;
      display: flex;
      flex-direction: column;
    }

    header.container{
      padding: 0;
    }
    header .about{
      margin-top: -40%;
      padding: 2em;
    }

  }
</style>
