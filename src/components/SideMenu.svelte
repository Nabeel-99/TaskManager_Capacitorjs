<script lang="ts">
  import { onMount } from "svelte";
  import { authHandlers } from "../store/store";
  import { auth, db } from "$lib/firebase/firebase";
  import { collection, doc, getDoc, getDocs, onSnapshot, query, updateDoc, where } from "firebase/firestore";
  import projectImg  from "$lib/projectImage.svg"
  import { fade, slide } from "svelte/transition";
    export let closeMenu: () => void;
    export let displayName: string
    export let fetchUserDetails:() => void
    let darkMode:boolean = localStorage.getItem('darkMode')?.valueOf() === 'true' ? true : false
    let showTasks: boolean = false
    export let taskTitles: any[]
    export let completedCount: number
    export let inProgressCount: number
    export let displayDashboard:() => void
    export let viewTask:() => void
 
    onMount(() => {
    const user = auth.currentUser
    if(user){
        const q = query(collection(db, "users"), where("email", "==", user.email))
        const unsubscribe = onSnapshot(q, (querySnapshot: any) => {
        const docData = querySnapshot.docs[0].data();
        const tasks = docData.tasks || [];
        const completedTasks = docData.completedTasks || [];

        // Update state variables
        taskTitles = tasks.map((task : any) => task.title);
        completedCount = completedTasks.length;
        inProgressCount = tasks.length;

     
    });

    return () => unsubscribe();
    }


});
const toggleDarkMode = () => {
    darkMode = !darkMode
    localStorage.setItem('darkMode', JSON.stringify(darkMode)); 
    applyDarkMode()
}

const applyDarkMode = () => {
        document.body.classList.toggle('dark', darkMode); 
    }
    
const showDropdown = () => {
    showTasks = !showTasks
}
  onMount(() => {
    fetchUserDetails()
  })


</script>
<div  class="flex flex-col h-screen  fixed     dark:bg-[#1B1D21] dark:text-white z-10">
<div class="  flex flex-col px-4 bg-white w-80  md:w-96 lg:w-0 md:ml-0 justify-between border-r border-r-gray-400 lg:border-none  dark:text-white dark:border-r-[#626366] h-full dark:bg-[#1B1D21]">
    <div class="">
        <div class="text-4xl mt-8  px-1 md:ml-1">
            <button on:click={closeMenu}><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="flex flex-col  mt-6 text-[1.3rem]  lg:w-52   dark:text-[#fefefe]">
            <!-- USER NAME  -->
            <div class="flex gap-3 pb-8 ">
                <div class="flex gap-2 items-center md:w-44  md:text-base  px-3   rounded-md">
                    <i class="fa-solid fa-user-large"></i>
                   {displayName}
                </div>
            </div>
            <div class="flex flex-col gap-3 pb-4 border-t py-4 ">
                <button on:click={displayDashboard}  class="flex gap-2 items-center md:w-52  md:text-base px-3 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md ">
                    <i class="fa-solid fa-grip text-xl"></i>
                    Dashboard
                </button>
            </div>
            <div class="flex flex-col gap-3 pb-4">
                <button on:click={() => {
                    showDropdown()
                    viewTask()
                }} class="flex gap-2 items-center justify-between lg:w-52  md:text-base px-3 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-default  rounded-md ">
                   <div class="flex gap-2 items-center">
                        <i class="fa-solid fa-list-check"></i>  
                        Tasks
                   </div>
                        {#if showTasks}
                            <i  class="fa-solid fa-chevron-up"></i> 
                            {:else}
                            <i class="fa-solid fa-chevron-down"></i>
                        {/if}
                </button>
            </div>
          <!-- TASK -->
          {#if showTasks}
            <div transition:slide="{{duration: 300}}" class="flex flex-col gap-2  ">
                <div class="px-3 text-sm font-semibold cursor-default hover:bg-gray-100 py-1 dark:hover:bg-gray-600 rounded-md flex gap-2 justify-between  items-center ">
                   <div class="px-4 flex items-center gap-2">
                        <i class="fa-solid fa-circle text-[0.4rem] text-orange-400"></i>
                        In progress
                   </div>
                <p>{inProgressCount}</p>
                </div>
                <div class="px-3 text-sm font-semibold cursor-default flex gap-2  hover:bg-gray-100 dark:hover:bg-gray-600 py-1 rounded-md justify-between items-center ">
                    <div class="px-4 flex items-center gap-2">
                        <i class="fa-solid fa-circle text-[0.4rem] text-green-400"></i>
                        Completed
                   </div>
                {completedCount}
                </div>
                <p class="px-3 text-sm">Recently created tasks</p>
                {#each taskTitles.slice(-3) as task }
                    <div class="px-3 text-sm font-semibold flex gap-2 items-center ">
                        <i class="fa-solid fa-circle text-[0.4rem]"></i>
                        {task.length > 20 ? task.slice(0,18).concat("...") : task}
                    </div>
                {/each}
            
            </div>
           {/if} 
     
        </div> 
    </div>
     <!-- TOGGLE MODE  -->
  
    <div class="mb-44 md:mb-0 text-[1.3rem] lg:w-52 ">
        <div class="flex gap-3 pb-8 ">
            <button on:click={toggleDarkMode}  class="flex gap-2 items-center md:w-52  md:text-base  px-3 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md">
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
            <button on:click={authHandlers.logout} class="flex gap-2 items-center md:w-52  md:text-base px-3 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md ">
                <i class="fa-solid fa-right-from-bracket text-xl "></i>
                    Log out
            </button>
        </div>
    </div>

</div>
</div>

   

 
<style>
 
</style>

<!-- markup (zero or more items) goes here -->