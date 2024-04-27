<script lang="ts">
  import { onMount } from "svelte";
  import { authHandlers } from "../store/store";
  import { auth, db } from "$lib/firebase/firebase";
  import { doc, getDoc } from "firebase/firestore";
    export let closeMenu: () => void;
    let darkMode:boolean = false
    let displayName: string
    onMount(async() => {
        const user = auth.currentUser;
        if(user) {
            const docRef = doc(db, 'users', user.uid)
            const docSnap = await getDoc(docRef)
            if(docSnap.exists()) {
                const userData = docSnap.data();
                displayName = userData.displayName
        }
    }
    // document.body.addEventListener('click', handleBodyClick);
    
});

const toggleDarkMode = () => {
    darkMode = !darkMode
    localStorage.setItem('darkMode', JSON.stringify(darkMode)); 
    applyDarkMode()
}

const applyDarkMode = () => {
        document.body.classList.toggle('dark', darkMode); 
    }
    
    const handleBodyClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    const sideMenu = document.getElementById('side-menu');
    // Check if the clicked element is inside the side menu
    if (!sideMenu?.contains(target)) {
      closeMenu(); // Close the menu if the click is outside
    }
  }   
   

</script>
<div class="flex flex-col h-screen w-screen fixed transition-all duration-200   md:static bg-white md:w-full dark:bg-[#1B1D21] dark:text-[#a6a7aa]">
    <div class="text-4xl mt-8 ml-6 md:ml-1">
        <button on:click={closeMenu}><i class="fa-solid fa-xmark"></i></button>
</div>
<div class="flex flex-col ml-7 md:ml-0 md:justify-between  h-screen">
    <div class="flex flex-col mt-6">
        <!-- USER NAME  -->
        <div class="flex gap-3 pb-8">
            <div class="flex gap-2 items-center md:w-44 text-xl md:text-base  px-3   rounded-md">
                <i class="fa-solid fa-user-large"></i>
               {displayName}
            </div>
        </div>
         <!-- MAIN MENU  -->
        <div class="px-3 md:text-[0.7rem] font-bold pb-2">MAIN MENU</div>
        <div class="flex flex-col gap-3 pb-8 ">
            <button class="flex gap-2 items-center md:w-44 text-xl md:text-base px-3 hover:bg-[#232529] rounded-md hover:text-white">
                <i class="fa-solid fa-grip text-xl"></i>
                Dashboard
            </button>
            <button class="flex gap-3 items-center md:w-44 text-xl md:text-base  px-3 hover:bg-[#232529] rounded-md hover:text-white">
                <i class="fa-regular fa-clipboard text-xl"></i>
                Project
            </button>
        </div>
      <!-- TASK -->
        <div class="px-3 md:text-[0.7rem] font-bold pb-2">TASKS</div>
        <div class="flex gap-3 pb-8 ">
           <p class="px-3 md:text-[0.8rem]">Recently created task</p>
        </div>
        <!-- PROJECT  -->
        <div class="px-3 md:text-[0.7rem] font-bold pb-2">PROJECTS</div>
        <div class="flex gap-3 pb-8 ">
            <p class="px-3 md:text-[0.8rem]">Recently created project</p>
        </div>
    </div> 
    <div class="mt-20 md:mt-0">
        <div class="flex gap-3 pb-8 ">
            <button on:click={toggleDarkMode}  class="flex gap-2 items-center md:w-44 text-xl md:text-base  px-3 hover:bg-[#232529] rounded-md hover:text-white">
                {#if darkMode}
                    <i class="fa-solid fa-sun text-xl"></i>
                    {:else}
                        <i class="fa-solid fa-moon text-xl"></i>
                {/if}
                    Toggle Mode
            </button>
        </div>
            <!-- LOG OUT -->
        <div class="flex gap-3 pb-8 ">
            <button on:click={authHandlers.logout} class="flex gap-2 items-center md:w-44  text-xl md:text-base px-3 hover:bg-[#232529] rounded-md hover:text-white">
                <i class="fa-solid fa-right-from-bracket text-xl "></i>
                    Log out
            </button>
        </div>
    </div> 
</div>
</div>

    <!-- TOGGLE MODE  -->
  

 
<style>
    /* your styles go here */
</style>

<!-- markup (zero or more items) goes here -->