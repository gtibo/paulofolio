<script context="module">
export const load = async ({ url }) => ({
  props: {
    key: url.pathname,
  },
})
</script>

<script>
  import PageTransition from "./_components/page_transition.svelte"
  export let key;
  import {onMount} from "svelte";
  let ready = true;
  onMount(()=>{
    ready = true;
  });
</script>

<svelte:head>
  <link rel="icon" href="/favicon.png" />
  <link rel="stylesheet" href="/global.css">
</svelte:head>

  {#if ready}
  <PageTransition refresh={key}>
    <slot />
  </PageTransition>
  {:else}
  Loading
  {/if}

<style>
  :global(.main-wrap){
    position: absolute;
    overflow-x: hidden;
    width:100%;
    height: 100%;
    overflow-y: scroll;
    display: flex;
    flex-direction: column;
    align-items: center;
    scrollbar-color: #26C94A rgba(0,0,0,0.9);
    scrollbar-width: thin;
  }

  :global(.main-wrap)::-webkit-scrollbar {
    width: 4px;
    height: 8px;
    background-color: rgba(0,0,0,0.9);
  }

  :global(.main-wrap)::-webkit-scrollbar-thumb {
      background: #26C94A;
  }

</style>
