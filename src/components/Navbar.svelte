<script lang="ts">
	import { page } from '$app/stores';
  import { createEventDispatcher } from 'svelte';
    export let darkMode: boolean
    let isBurgerMenu: boolean = false
    const dispatch = createEventDispatcher()
    const openBurgerMenu = () => {
        isBurgerMenu = !isBurgerMenu
    }
    const toggleDarkMode = () => {
    // Emit custom event to toggle dark mode in the parent component
    // This event will be handled in the parent component (layout.svelte)
    dispatch('toggleDarkMode');
  }
   const closeMenu = () => {
        isBurgerMenu = false
   }
</script>

<div class="flex ">
    <!-- bigger screen navbar -->
    <nav class="hidden md:flex items-center w-full justify-between mx-20 py-7">
        <div aria-current={$page.url.pathname === '/' ? 'page' : undefined}>
            <a href="/" class="text-xl"><i class="fa-solid fa-pen-to-square"></i></a>
        </div>
        <div class="flex gap-5">
           <div aria-current={$page.url.pathname.startsWith('/login') ? 'page' : undefined}>
                <a href="/login" class="hover:text-purple-800 hover:duration-150">Login</a>
            </div>
            <div aria-current={$page.url.pathname.startsWith('/register') ? 'page' : undefined}>
                <a href="/register" class="hover:text-purple-800 hover:duration-150">Create Account</a>
            </div>
            <div>
                <button on:click={toggleDarkMode} class="text-md">
                    {#if darkMode}
                    <i class="fa-solid fa-sun"></i>
                     {:else}
                     <i class="fa-solid fa-moon"></i>
                    {/if }
            </button>
            </div>
        </div>
    </nav>

    <!-- burger menu -->
    <nav class="md:hidden flex w-full justify-between items-center mx-5 py-8">
        <div aria-current={$page.url.pathname === '/' ? 'page' : undefined}>
            <a href="/" class="text-3xl"><i class="fa-solid fa-pen-to-square"></i></a>
        </div>
        <div>
            <button on:click={openBurgerMenu} class=" border px-3 p-1 text-2xl rounded-md">
                {#if isBurgerMenu}
                    <i class="fa-solid fa-xmark"></i>
                    {:else}
                        <i class="fa-solid fa-bars"></i>
                {/if}
        </button>
        </div>
        {#if isBurgerMenu}
            <div class="absolute top-20 right-10 bg-white dark:bg-[#1B1D21] shadow-lg border border-gray-100 p-3 rounded-lg py-4 dark:border-[#606267] dark:shadow-md  z-10 w-56">
                <div class="flex flex-col gap-4 px-3">
                    <div class="flex gap-4 items-center" aria-current={$page.url.pathname.startsWith('/login') ? 'page' : undefined}>
                        <i class="fa-solid fa-user-large"></i>
                        <a href="/login" on:click={closeMenu} class="hover:text-purple-800 hover:duration-150 text-md">Login</a>
                    </div>
                    <div class="flex gap-4 items-center" aria-current={$page.url.pathname.startsWith('/register') ? 'page' : undefined}>
                        <i class="fa-solid fa-user-large"></i>
                        <a href="/register" on:click={closeMenu} class="hover:text-purple-800 hover:duration-150 text-md">Create Account</a>
                    </div>
                    <div>
                        <button on:click={() => {
                            toggleDarkMode() 
                            closeMenu()
                            }}  
                            class="text-md flex items-center gap-4 hover:border hover:rounded-full hover:bg-slate-400">
                            {#if darkMode}
                            <i class="fa-solid fa-sun hover:border hover:rounded-full hover:bg-slate-400"></i>
                             {:else}
                             <i class="fa-solid fa-moon"></i>
                            {/if }
                            Toggle Mode
                    </button>
                    </div>
                </div>
            </div>
        {/if}
    </nav>
</div>



