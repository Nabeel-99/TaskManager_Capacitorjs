<script lang="ts">
    // your script goes her
  import dashboardImage from "$lib/landingImage.svg"
  import completedImage from "$lib/signin.png"
  import ongoingImage from "$lib/projectImage.svg"

  export let ongoingTasks: any[]
  export let doneTasks:any[]
  export let showTaskForm:() => void
  export let isOpen:boolean
</script>
<div class="flex w-2/3 h-screen flex-col  px-10">
    <div class="flex">
        <h2 class="text-[1.6rem] py-8">Task Manager</h2>
    </div>
    <div class="bg-gradient-to-br from-[#9eceff] to-[#a2cdf89b] dark:bg-gradient-to-br dark:from-[#162330] dark:to-[#2234469b] min-w-96  shadow-md h-4/5  w-full rounded-md p-8 py-4 flex flex-col gap-8 items-center justify-between  overflow-scroll" class:w-[80%]={isOpen}>
        <div class="flex items-center justify-center h-80 gap-8">
            {#each ongoingTasks as task}
            <div class="relative bg-gray h-[160px] border border-[#84556588] mt-8 w-[160px] flex flex-col gap-4  rounded-full">
                 <div class="h-[160px] w-[160px]  p-[20px]" 
                    style="border-radius: 50%; ">
                    <div class="h-[120px] w-[120px] flex items-center border border-[#84556588] justify-center" style="border-radius: 50%; 
                        box-shadow: inset 4px 4px 6px -1px rgba(0,0,0,0.2), 
                        inset -4px -4px 6px -1px rgba(0,0,0,0.2),
                        0.5px 0.5px 0px rgba(0,0,0,0.15),
                        0px 12px 10px -10px rgba(0,0,0,0.05);">
                        <div class=" font-bold text-xl">
                            {task.progress}%
                        </div>
                    </div>
                 </div>
                 <div class="flex items-center justify-center w-44 gap-1 italic">
                    <i class="fa-solid fa-circle text-[0.5rem] font-bold text-[#3e4681]"></i>
                    {task.title}
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
            {#if ongoingTasks.length === 0}
                <div class="h-80 flex flex-col items-center justify-center text-xl italic">
                    <div>
                        <img src={dashboardImage} alt="" class="w-96 ">
                    </div>
                    NO ANY ONGOING TASKS
                </div>
            {/if}
        </div>
        <div class="flex gap-8 flex-col lg:flex-row">
            <div class="flex flex-col justify-center items-center gap-4  ">
                <h2>IN PROGRESS</h2>
                {#if ongoingTasks.length > 0 }
                     <div class="p-4 rounded-md bg-gradient-to-br from-[#e1effd] to-[#ebf5ff60] dark:bg-gradient-to-br dark:from-[#111f2d] dark:to-[#08111b9b] shadow-md flex flex-col w-72 gap-2 px-5 py-3 h-48 ">
                        My Tasks
                        <p class="text-sm">Recently created task</p>
                            <div class="flex gap-3 items-center justify-between p-2 rounded-md bg-gray-100">
                             {ongoingTasks[ongoingTasks.length - 1].title}
                            <i class="fa-solid fa-circle-check text-green-500"></i>
                            </div>
                        <div class="flex flex-col gap-2"> 
                            Progress: {ongoingTasks[ongoingTasks.length - 1].progress}
                            <div class=" bg-gray border h-3  rounded-full flex">
                                <div class="bg-gradient-to-r from-[#4933d69a] to-[#2b0ee6] h-2.5 rounded-full transition-all delay-150 duration-300 ease-in-out" style="width: {ongoingTasks[ongoingTasks.length - 1].progress}%"></div>
                            </div>
                            
                        </div> 
                    </div>
                    {:else}
                    <div class="p-4 rounded-md bg-gradient-to-br from-[#e1effd] to-[#ebf5ff60] dark:from-[#111f2d] dark:to-[#08111b9b]  shadow-md flex flex-col items-center justify-center italic w-72 gap-2 px-5 py-3 h-48 ">
                        <div>
                            <img src={ongoingImage} alt="" class="w-32 h-32"/>
                        </div>
                        NO ANY ONGOING TASKS 
                    </div>
                {/if}
               
            </div>
            <div class="flex flex-col justify-center items-center gap-4  ">
                <h2>COMPLETED</h2>
                {#if doneTasks.length > 0 }
                <div class="p-4 rounded-md bg-gradient-to-br from-[#e1effd] to-[#ebf5ff60] dark:from-[#111f2d] dark:to-[#08111b9b] shadow-md flex flex-col w-72 gap-2 px-5 py-3 h-48 overflow-y-scroll ">
                   <div class="border-b pb-3">MY TASKS</div>
                   <p class="text-sm">Completed tasks</p>
                      {#each doneTasks.slice(-3) as done }
                        <div class="flex gap-3 items-center justify-between p-2 rounded-md bg-gray-100">
                            {done.title.slice(0, 15).concat("...")}
                            <i class="fa-solid fa-circle-check text-green-500"></i>
                       </div>
                      {/each}  
               </div>
               {:else}
               <div class="p-4 rounded-md bg-gradient-to-br from-[#e1effd] to-[#ebf5ff60] dark:from-[#111f2d] dark:to-[#08111b9b] shadow-md flex flex-col items-center justify-center italic w-72 gap-2 px-5 py-3 h-48 ">
                <div>
                    <img src={completedImage} alt="" class="h-32 w-32"/>
                </div>
                  NO COMPLETED TASKS 
               </div>
           {/if}     
            </div>
        </div>
    </div>
    <div class="fixed flex flex-col right-50 left-50 right-10 top-32 gap-5 mr-10 mb-8 ">
        <i class="fa-solid fa-clipboard-list text-[8rem] text-slate-800 dark:text-[#838792]"></i>
        <button on:click={showTaskForm} class="py-2 px-6 rounded-md bg-[#2A2D33] hover:bg-[#4d4d4f] text-white dark:bg-[#7864F4] dark:text-white dark:hover:bg-[#5947cb]">Add Task</button>
    </div>
 </div>  
<style>
    /* your styles go here */
</style>

<!-- markup (zero or more items) goes here -->