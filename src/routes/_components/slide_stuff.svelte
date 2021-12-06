<script>
export let d = 0, text = "hey";
function trans(node, {
	duration = 400,
	delay = 0
}) {
	return {
		delay,
		duration,
		css: t => `transform: translateY(${(1-t)*100}%);`
	};
}
</script>

{#each text.split(/\b(\s)/) as s, i}
<div class="txt-wrap">
  <div
  class="txt-body"
  in:trans={{delay:parseInt(d) + 400}}
  out:trans
  >
		{s}
	</div>
</div>
{/each}

<style>
  .txt-wrap{
    display: inline-block;
    overflow: clip;
  }
  .txt-body {
		white-space: break-spaces;
    margin: 0;
  }
  :global(.txt-body *){
    margin: 0;
  }
</style>
