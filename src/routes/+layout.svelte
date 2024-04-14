<script lang="ts">
	import Navbar from "../components/Navbar.svelte";
  import '../app.css';
     import  { onMount } from "svelte";
  import { auth } from "$lib/firebase/firebase";
	const nonAuthRoutes = ['/', 'product']
	 onMount(() => {
		console.log('mounting')
		const unsubscribe = auth.onAuthStateChanged(async user => {
			const currentPath = window.location.pathname

			if(!user && !nonAuthRoutes.includes(currentPath)){
				window.location.href ='/'
			}
		})
	 })
</script>

<div class="app">
  <Navbar/> 

	<main>
		<slot />
	</main>

	<footer class="border-t w-screen">
		<p> All Rights Reserved &copy; copyright 2024</p>
	</footer>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
		
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		/* padding: 1rem; */
		width: 100%;
		/* max-width: 64rem; */
		margin: 0 auto;
		box-sizing: border-box;
	}

	footer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 12px;
	}

	footer a {
		font-weight: bold;
	}

	@media (min-width: 480px) {
		footer {
			padding: 12px 0;
		}
	}
</style>
