<script context="module">
  export function load({ error, status }) {
      return {
          props: {
            message: error.message
          }
      };
  }
</script>

<script>
  export let message;
</script>

<h1>Aïe :(</h1>
<p>{message}</p>
<a href="/">Retourner à l'accueil</a>
