<script>
	import { page } from '$app/stores';
    
</script>

<div class="flex">
    <!-- bigger screen navbar -->
    <nav class="hidden md:flex w-full justify-between mx-20 py-7">
        <div aria-current={$page.url.pathname === '/' ? 'page' : undefined}>
            <a href="/" class="text-xl"><i class="fa-solid fa-pen-to-square"></i></a>
        </div>
        <div class="flex gap-5">
           <div aria-current={$page.url.pathname.startsWith('/login') ? 'page' : undefined}>
                <a href="/dashboard" class="hover:text-purple-800 hover:duration-150">Login</a>
            </div>
            <div aria-current={$page.url.pathname.startsWith('/register') ? 'page' : undefined}>
                <a href="/register" class="hover:text-purple-800 hover:duration-150">Create Account</a>
            </div>
        </div>
    </nav>

    <!-- burger menu -->
    <nav class="md:hidden flex w-full justify-between items-center mx-5 py-8">
        <div aria-current={$page.url.pathname === '/' ? 'page' : undefined}>
            <a href="/" class="text-3xl"><i class="fa-solid fa-pen-to-square"></i></a>
        </div>
        <div>
            <button class=" border px-3 p-1 text-2xl rounded-md"><i class="fa-solid fa-bars"></i></button>
        </div>
    </nav>
</div>



