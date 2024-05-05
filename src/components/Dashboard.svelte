<script lang="ts">
    // your script goes her
  import dashboardImage from "$lib/landingImage.svg"
  import completedImage from "$lib/projectImage.svg"
  import ongoingImage from "$lib/completed.png"
  import { onMount } from "svelte";

  export let ongoingTasks: any[]
  export let doneTasks:any[]
  export let showTaskForm:() => void
  export let isOpen:boolean
  export let viewTask:() => void
  export let fetchUserDetails:() => Promise<void>
  export let displayName: string

  onMount(fetchUserDetails)
</script>
<div class="flex  w-full h-screen flex-col  overflow-y-scroll px-10">
    <div class="flex pt-20 md:pt-0">
        <h2 class="text-[1.6rem] py-8">Task Manager</h2>
    </div>
   <div class="flex flex-col justify-between xl:flex-row lg:items-start items-center gap-8 pb-8">
    <div class="bg-gradient-to-br from-[#1b1d2118]  dark:border dark:border-[#1b1d2118] to-[#dbdee523] dark:bg-gradient-to-br dark:from-[#1B1D21] dark:to-[#2A2D33] min-w-96  shadow-md w-full  xl:w-3/4 xl:h-auto h-[40rem]  rounded-md p-8 py-4 pb-10 flex flex-col gap-8 items-center justify-between overflow-y-scroll" class:w-[80%]={isOpen}>
        <div class="flex flex-col lg:h-80 gap-3">
            {#if ongoingTasks.length > 0}
            <div class="flex flex-col text-3xl w-full md:text-4xl">
                <span class="bg-gradient-to-r from-[#030f76] to-[#b12525] text-transparent  mt-4 bg-clip-text font-sans
                dark:from-[#8590f3] dark:to-[#f05050]
                ">Hello, {displayName}</span>
                <span class="bg-gradient-to-r from-[#757575] to-[#141624] text-transparent  mt-4 bg-clip-text font-sans
                dark:from-[#c9c9c9] dark:to-[#fbfbfd]
                ">Here's a quick overview of your pending tasks</span>
            </div>
            {/if}
            <div class="grid grid-cols-2 gap-8 place-items-center lg:flex lg:items-center lg:justify-center  ">
            {#each ongoingTasks.slice(-4) as task}
                <div class="relative bg-gray h-[160px] border border-[#84556588] mt-8 w-[160px] flex flex-col gap-4  rounded-full">
                    <div class="h-[160px] w-[160px]  p-[20px]" 
                       style="border-radius: 50%; ">
                       <div class="h-[120px] w-[120px] flex items-center border border-[#84556588] justify-center" style="border-radius: 50%; 
                           box-shadow: inset 4px 4px 6px -1px rgba(0,0,0,0.2), 
                           inset -4px -4px 6px -1px rgba(0,0,0,0.2),
                           0.5px 0.5px 0px rgba(0,0,0,0.15),
                           0px 12px 10px -10px rgba(0,0,0,0.05);">
                           <div class=" font-bold text-xl task">
                               {task.progress}%
                           </div>
                       </div>
                    </div>
                    <div class="flex items-center justify-center w-44 gap-1 italic">
                       <i class="fa-solid fa-circle text-[0.5rem] font-bold text-[#3e4681]"></i>
                       {task.title.length > 20 ? task.title.slice(0,18).concat("...") : task.title}
                   </div>
                    <svg class="absolute top-0 left-0"
                    xmlns="http://www.w3.org/2000/svg" version="1.1" width="160px" height="160px">
                       <defs>
                          <linearGradient id="gradientColor">
                             <stop offset="0%" stop-color="#e91e63" />
                             <stop offset="100%" stop-color="#673ab7" />
                          </linearGradient>
                       </defs>
                       <circle
                       stroke="url(#gradientColor)" 
                       stroke-dasharray=472
                       stroke-dashoffset="{472 - 472 * (task.progress / 100)}"
                       class=" fill-none  stroke-[20px] progress-circle "
   
                       cx="80" cy="80" r="70" stroke-linecap="round" />
                   </svg>
               </div>
            {/each}
            </div>
            {#if ongoingTasks.length === 0}
                <div class="h- flex flex-col gap-8  text-xl ">
                   <div class="flex flex-col">
                    <span class="bg-gradient-to-r from-[#030f76] to-[#b12525] text-transparent text-4xl mt-4 bg-clip-text font-sans
                    dark:from-[#8590f3] dark:to-[#f05050]
                    ">Hello, {displayName}</span>
                    <span class="bg-gradient-to-r from-[#757575] to-[#141624] text-transparent text-4xl mt-4 bg-clip-text font-sans
                    dark:from-[#c9c9c9] dark:to-[#fbfbfd]
                    ">Feeling productive? Let's get started!</span>
                   </div>
                    <div class="flex gap-8 flex-col md:flex-row items-center justify-center">
                        <div class="flex flex-col items-center md:items-start  ">
                            <img src={dashboardImage} alt="" class="w-72 items-center md:mr-[9rem] flex justify-center ">
                            <p class="italic">NO ANY ONGOING TASKS</p>
                        </div>
                        <div class="flex flex-col items-center justify-center gap-4   ">
                            <i class="fa-solid fa-clipboard-list text-[8rem] text-slate-800 dark:text-[#838792]"></i>
                            <button on:click={showTaskForm} class="py-2 px-6 rounded-md bg-[#2A2D33] hover:bg-[#4d4d4f] text-white dark:bg-[#7864F4] dark:text-white dark:hover:bg-[#5947cb]">Add Task</button>
                         </div>
                    </div>
                </div>
            {/if}
        </div>
        <div class="flex gap-8 flex-col mt-8 md:flex-row">
            <div class="flex flex-col justify-center items-center gap-4 py-8  ">
                <h2>IN PROGRESS</h2>
                {#if ongoingTasks.length > 0 }
                     <div class="p-4 rounded-md bg-white dark:bg-gradient-to-br dark:from-[#1B1D21] dark:to-[#131417] shadow-md flex flex-col w-72 gap-2 px-5 py-3 h-48 ">
                        My Tasks
                        <p class="text-sm">Recently created task</p>
                            <div class="flex gap-3 items-center justify-between p-2 rounded-md border bg-gray-50 dark:bg-[#303137] dark:border-black">
                             {ongoingTasks[ongoingTasks.length - 1].title.length > 20 
                                ? ongoingTasks[ongoingTasks.length - 1].title.slice(0,18).concat("...")
                                : ongoingTasks[ongoingTasks.length - 1].title
                            }
                             <i class="fa-solid fa-clock text-orange-400"></i>
                            </div>
                        <div class="flex flex-col gap-2"> 
                            Progress: {ongoingTasks[ongoingTasks.length - 1].progress}
                            <div class=" bg-gray border border-[#24313f] dark:border-white h-3  rounded-full flex">
                                <div class="bg-gradient-to-r from-[#4933d69a]  to-[#2b0ee6] h-2.5 rounded-full transition-all delay-150 duration-300 ease-in-out" style="width: {ongoingTasks[ongoingTasks.length - 1].progress}%"></div>
                            </div>
                            
                        </div> 
                    </div>
                    {:else}
                    <div class="p-4 rounded-md bg-white dark:bg-gradient-to-br dark:from-[#1B1D21] dark:to-[#131417] shadow-md flex flex-col items-center justify-center w-72 gap-2 px-5 py-3 h-48 italic ">
                        <div>
                            <img   src={ongoingImage} alt="" class="w-42 h-32"/>
                        </div>
                        EMPTY ONGOING TASKS 
                    </div>
                {/if}
               
            </div>
            <div class="flex flex-col justify-center items-center gap-4  ">
                <h2>COMPLETED</h2>
                {#if doneTasks.length > 0 }
                <div class="p-4 rounded-md bg-white dark:bg-gradient-to-br dark:from-[#1B1D21] dark:to-[#131417] shadow-md flex flex-col w-72 gap-2 px-5 py-3 h-48 ">
                   <div class="border-b ">My Tasks</div>
                   <p class="text-sm">Recently completed tasks</p>
                      {#each doneTasks.slice(-2) as done }
                        <div class="flex gap-3 items-center justify-between p-2 rounded-md border bg-gray-50 dark:bg-[#303137] dark:border-black">
                            {done.title.slice(0, 15).concat("...")}
                            <i class="fa-solid fa-circle-check text-green-500"></i>
                       </div>
                      {/each}  
               </div>
               {:else}
               <div class="p-4 rounded-md bg-white dark:bg-gradient-to-br dark:from-[#1B1D21] dark:to-[#131417] shadow-md flex flex-col items-center justify-center w-72 gap-2 px-5 py-3 h-48 italic ">
                <div>
                    <img src={completedImage} alt="" class="h-32 w-42"/>
                </div>
                  EMPTY COMPLETED TASKS
               </div>
           {/if}     
            </div>
        </div>
    </div>
    <div class="flex flex-col items-center gap-14  ">
       <div class="mb-44" >
        <button on:click={viewTask} class="flex justify-between items-center gap-12  py-2 px-6 rounded-full bg-[#2A2D33] text-white hover:bg-[#4d4d4f] dark:bg-[#f3cc1b]  dark:text-black dark:hover:bg-[#d2b11f] ">
            View Tasks
            <i class="fa-solid fa-arrow-right"></i>
        </button>
       </div>
    </div>
   </div>
   
 </div>  
<style>
    .progress-circle {
    animation: progressAnimation 2s linear forwards;
  }
  @keyframes progressAnimation {
    from {
      stroke-dashoffset: 472; /* Initial dash offset */
    }
    
  }

  .task{
    animation: taskText 3s linear forwards;
    opacity: 0;
  }
  @keyframes taskText{
     0%{opacity: 0;}
     50%{opacity: 0.5;}
     100%{opacity: 1;}
  }
</style>

<!-- markup (zero or more items) goes here -->