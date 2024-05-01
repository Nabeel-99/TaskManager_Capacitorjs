<script lang="ts">
  import { onMount } from "svelte";
  import { authHandlers } from "../store/store";
  import { auth, db } from "$lib/firebase/firebase";
  import { collection, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
  import projectImg  from "$lib/projectImage.svg"
    export let closeMenu: () => void;
    export let displayName: string
    export let fetchUserDetails:() => void
    let darkMode:boolean = false
    export let taskTitles: any[]
 


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
   

  onMount(() => {
    fetchUserDetails()
  })


</script>
<div class="flex flex-col h-screen w-screen fixed transition-all duration-200   md:static bg-white md:w-full dark:bg-[#1B1D21] dark:text-[#a6a7aa]">
    <div class="text-4xl mt-8 ml-6 px-5 md:ml-1">
        <button on:click={closeMenu}><i class="fa-solid fa-xmark"></i></button>
</div>
<div class="flex flex-col ml-7 md:ml-0 md:justify-between px-4  h-screen md:h-full">
    <div class="flex flex-col mt-6">
        <!-- USER NAME  -->
        <div class="flex gap-3 pb-8">
            <div class="flex gap-2 items-center md:w-44 text-xl md:text-base  px-3   rounded-md">
                <i class="fa-solid fa-user-large"></i>
               {displayName}
            </div>
        </div>
         <!-- MAIN MENU  -->
        <div class="px-3 md:text-sm font-bold pb-2">MAIN MENU</div>
        <div class="flex flex-col gap-3 pb-8 ">
            <button class="flex gap-2 items-center md:w-44 text-xl md:text-base px-3 hover:bg-[#232529] rounded-md hover:text-white">
                <i class="fa-solid fa-grip text-xl"></i>
                Dashboard
            </button>
            <!-- <button on:click={displayCreateCard} class="flex gap-3 items-center justify-between md:w-44 text-xl md:text-base  px-3 hover:bg-[#232529] rounded-md hover:text-white">
                <div class=" flex  items-center gap-2">
                    <i class="fa-regular fa-clipboard text-xl"></i>
                    Project
                </div>
                <button><i class="fa-regular fa-plus text-xl"></i></button>
            </button> -->
        </div>
      <!-- TASK -->
        <div class="px-3 md:text-sm font-bold pb-2">TASKS</div>
        <div class="flex flex-col gap-2 ">
            <p class="px-3 text-sm">Recently created tasks</p>
            {#each taskTitles.slice(-3) as task }
                <p class="px-4 text-[0.8rem] ">{task}</p>
            {/each}
        
        </div>
        <!-- PROJECT 
        <div class="px-3 md:text-[0.7rem] font-bold pb-2">PROJECTS</div>
        <div class="flex flex-col gap-2 justify-start">
           {#if projectTitle.length > 0}
            {#each projectTitle as title}
                <button class="px-3  hover:bg-[#232529] rounded-md hover:text-white flex">{title.name}</button>
            {/each}
           {/if}
           
        </div> -->
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