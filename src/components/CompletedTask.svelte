<script lang="ts">
  import { auth, db } from "$lib/firebase/firebase";
  import { arrayRemove, collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
  import { onMount } from "svelte";
  import completedImage from "$lib/projectImage.svg"
   export let showCards:boolean
   export let showTable:boolean
   export let viewTask:(task: any) => void
   export let completedTasks:any[]
   export let fetchUserTasks:() => void
   import { fade, slide, blur, fly, draw } from "svelte/transition";
   import { quintOut } from 'svelte/easing';


    const removeTask = async (task: any) => {
    try {
        const user = auth.currentUser;
        if (!user) {
            console.log("User is not authenticated");
            return;
        }
        const userDocRef = doc(db, `users/${user.uid}`);
        const updatedTasks = completedTasks.filter((t) => t.createdAt !== task.createdAt);
        await updateDoc(userDocRef, {
            completedTasks: updatedTasks
        });

        completedTasks = updatedTasks;
    } catch (error) {
        console.log("Error deleting task", error);
    }
}
    

    onMount(() => {
        fetchUserTasks()
    })
</script>

<div transition:fade="{{duration: 300}}" class="flex flex-col gap-2">
    <div class="px-7 xl:px-0">
        Completed
    </div>
    {#if showCards}
    <div class="grid grid-flow-col xl:grid-rows-1 xl:grid-flow-row gap-6 overflow-scroll  pb-10 ">
        {#if completedTasks.length === 0}
        <div class="p-4 rounded-md bg-white border dark:bg-[#3f4247] dark:border-none shadow-md flex flex-col items-center justify-center w-72 gap-2 px-5 py-3 h-48 italic ">
          <div>
              <img src={completedImage}  alt="" class="h-32 w-42"/>
          </div>
            EMPTY COMPLETED TASKS
         </div>
         {/if}  
      {#each completedTasks as task }
       <div transition:blur="{{amount: 10}}"  class="flex flex-col w-72  justify-between gap-3 border-2 rounded-lg shadow-lg p-3 dark:bg-[#3f4247] dark:border-none">
          <div class="flex flex-col gap-3">
            <div class="flex justify-between items-center">
                <h4 class="text-md w-44">{task.title.length > 20 ? task.title.slice(0, 18).concat('...') : task.title}</h4>
                <div class="flex gap-4">
                  <button on:click={() => viewTask(task)} class="text-md border p-1 flex items-center px-2 rounded-md bg-gray-300 hover:bg-[#232529] hover:text-white dark:bg-[#626366] dark:border-none "><i class="fa-solid fa-eye" title="view task"></i></button>
               
                  <button on:click={() => removeTask(task)}  class="text-md border p-1 flex items-center px-2 rounded-md bg-gray-300 hover:bg-[#232529] hover:text-white dark:bg-[#626366] dark:border-none ">
                    <i class="fa-solid fa-trash"></i>
                </button>
                </div>
            </div>
                <h4 class="text-md dark:text-[#a0a1a4] italic">{task.description.length > 20 ? task.description.slice(0,20).concat("...") : task.description}</h4>
            <div class="flex gap-2">
                {#each task.tags  as tag}
                    <h4 class="text-md  px-2 py-1 rounded-lg bg-[#7864F4] text-white">{tag}</h4>  
                {/each}
            </div>
                <h4 class="text-md italic dark:text-[#a0a1a4]">{task.createdAt.toDate().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</h4>
                
          </div>
            {#if task.completedAt}
                <h4 class="text-md italic dark:text-[#a0a1a4]"><span class="">Completion date: </span>{task.completedAt.toDate().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</h4>
            {/if}
          
        </div>
      {/each}
     
    </div>
    {/if}
  {#if showTable}
  <div style="max-height: 300px; overflow-y: auto;">
    <table class="w-4/5 border max-h-[400px] rounded-md border-collapse">
      <thead class="top-0 bg-gray-200 dark:bg-gray-700 z-10">
        <tr class="bg-gray-200 dark:bg-gray-700">
          <th class="px-4 py-2 text-left">Task</th>
          <th class="px-4 py-2 text-left">Description</th>
          <th class="px-4 py-2 text-left">Creation Date</th>
          <th class="px-4 py-2 text-left">Completion Date</th>
          <th class="px-4 py-2 text-left">Actions</th>
        </tr>
      </thead>
      <tbody class="overflow-y-scroll">
        {#each completedTasks as task }
          <tr transition:blur="{{ amount: 10 }}"
           class="border-b  dark:border-gray-600">
            <td class="px-4 py-2">{task.title.length > 20 ? task.title.slice(0,18).concat("...") : task.title}</td>
            <td class="px-4 py-2">{task.description.length > 20 ? task.description.slice(0, 20).concat("...") : task.description}</td>
            <td class="px-4 py-2">{task.createdAt.toDate().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
            <td class="px-4 py-2">{task.completedAt.toDate().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
            <td class="px-4 py-2">
                <div class="flex gap-4">
                    <button on:click={() => viewTask(task)} class="text-sm bg-gray-200 dark:bg-gray-700 dark:text-white px-2 py-1 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"><i class="fa-solid fa-eye" title="view task"></i></button>
                    <button on:click={() => removeTask(task)} class="text-sm bg-gray-200 dark:bg-gray-700 dark:text-white px-2 py-1 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"><i class="fa-solid fa-trash" title="delete task"></i></button>
                 </div>
            </td>
          </tr>
        {/each}
        {#if completedTasks.length == 0}
            <div class="flex items-center  w-56 p-2 italic text-left">
               <p>No completed tasks yet.</p>
            </div>
        {/if}
      </tbody>
    </table>
  </div>
  {/if}
   

</div>
<style>
    /* your styles go here */
</style>

<!-- markup (zero or more items) goes here -->