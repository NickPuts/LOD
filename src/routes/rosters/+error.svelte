<script>
  import { page } from '$app/state';
</script>

<h1>Error in /rosters</h1>
<p>Status: {page.status}</p>
<p>Message: {page.error.message}</p>
