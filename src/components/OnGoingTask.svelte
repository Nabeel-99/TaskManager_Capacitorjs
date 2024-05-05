<script lang="ts">
  import { auth, db } from "$lib/firebase/firebase";
  import { doc, updateDoc } from "firebase/firestore";
  import { afterUpdate, onMount } from "svelte";
  import EditTaskForm from "./EditTaskForm.svelte";
  import { fade, slide, blur, fly } from "svelte/transition";
  import completedImage from "$lib/projectImage.svg"
  import ongoingImage from "$lib/completed.png"
  export let viewTask: (task: any) => void
  export let editTask: (task: any) => void
  export let userTasks: any[]
  export let showCards: boolean
  export let showTable: boolean
  export let fetchUserTasks: () => Promise<void>;
  export let markAsComplete: (task: any) => void;
  export let filteredTasks: any[]
  export let showSearchBar:boolean
  export let closeSearchBar:() => void
  let searchQuery: string = "";


  const deleteTask = async (task: any) => {
    try {
        const user = auth.currentUser;
        if (!user) {
            console.log("User is not authenticated");
            return;
        }
        const userDocRef = doc(db, `users/${user.uid}`);
        const updatedTasks = userTasks.filter((t) => t.createdAt !== task.createdAt);
        await updateDoc(userDocRef, {
            tasks: updatedTasks
        });
        userTasks = updatedTasks;
        filteredTasks = updatedTasks
    } catch (error) {
        console.log("Error deleting task", error);
    }
  }
  const updateProgress = async(task: any) => {
    try {
        const user = auth.currentUser;
        if(!user){
            console.log("user is not authenticated");
            return;
        }
        const userDocRef = doc(db, `users/${user.uid}`);
        await updateDoc(userDocRef, {
            tasks: userTasks
        });
    } catch (error) {
        console.log("Error updating task: ", error);
    }
  }

  const searchTasks = () => {
    filteredTasks = userTasks.filter(task =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  onMount(() => {
      fetchUserTasks();

  });
  $: searchTasks();
</script>

<div transition:fade="{{duration: 300}}" class=" flex flex-col gap-2 ">
  <!-- search btn -->
  <div class="hidden md:flex items-center md:fixed right-10 top-5 justify-center">
    <label for="search-input"><i class="fa-solid fa-magnifying-glass border border-r px-3 py-3 rounded-l-full dark:bg-[#3f4146] dark:border-[#898c97]"></i></label>
    <input placeholder="Search ongoing tasks" id="search-input" class="border px-2 w-80 py-2 rounded-r-full dark:bg-[#3f4146] dark:border-[#898c97]" bind:value={searchQuery} on:input={searchTasks} />
  </div>
  <!-- mobile search btn -->
  {#if showSearchBar}
    <div class="fixed top-20  items-center right-0 left-0 px-3 flex justify-center w-full  md:hidden ">
      <button on:click={() => closeSearchBar()}>
        <i class="fa-solid fa-xmark border border-r px-3 py-3 rounded-l-full dark:bg-[#3f4146] dark:border-[#898c97]"></i>
      </button>
        <input placeholder="Search ongoing tasks" id="search-input" class="border px-2 w-full py-2 rounded-r-full dark:bg-[#3f4146] dark:border-[#898c97]" bind:value={searchQuery} on:input={searchTasks} />
    </div>
  {/if}
  <div class="px-7 flex items-center gap-2 xl:px-0">
    <i class="fa-solid fa-circle text-[0.6rem] text-orange-400"></i>
    On Going
  </div>
<!-- Cards view -->
{#if showCards}
<div class="grid grid-flow-col xl:grid-rows-1 xl:grid-flow-row gap-8 pb-10 overflow-y-scroll">
  {#await filteredTasks}
    <p>Loading..</p>
  {:then} 
  {#if filteredTasks.length === 0 && searchQuery !== ""}
  <div class="italic">NO MATCHING TASKS FOUND.</div>
    {:else if filteredTasks.length == 0}
    <div class="p-4 rounded-md bg-white border dark:bg-[#3f4247] dark:border-none shadow-md flex flex-col items-center justify-center w-72 gap-2 px-5 py-3 h-48 italic ">
      <div>
          <img src={ongoingImage}  alt="" class="h-32 w-42"/>
      </div>
        EMPTY ONGOING TASKS
     </div>
  {:else}
    {#each filteredTasks as task }
     <div transition:blur="{{amount: 10}}" class="flex flex-col w-96  justify-between gap-3 border-2 rounded-lg shadow-lg p-3 dark:bg-[#3f4247] dark:border-none">
        <div class="flex flex-col gap-3">
          <div class="flex justify-between items-center">
              <h4 class="text-md w-44">{task.title.length > 20 ? task.title.slice(0, 18).concat('...') : task.title}</h4>
              <button  on:click={() => viewTask(task)} class="text-md border p-1 flex items-center px-2 rounded-md bg-gray-300 hover:bg-[#232529] hover:text-white dark:bg-[#626366] dark:border-none">View full task</button>
          </div>
          <h4 class="text-md dark:text-[#a0a1a4]">{task.description.length > 20 ? task.description.slice(0,20).concat("...") : task.description}</h4>
          <div class="flex gap-2">
              {#each task.tags  as tag}
                  <h4 class="text-md px-2 py-1 rounded-lg bg-[#7864F4]  text-white">{tag.length > 20 ? tag.slice(0,12).concat("...") : tag}</h4>  
              {/each}
          </div>
          <div class="flex text-md items-center gap-3">
              <h4>Priority: </h4>
                  {#if task.priority === "High"}
                      <h4 class="bg-red-500 rounded-md px-3 py-1 text-white">{task.priority}</h4>
                      {:else if  task.priority === "Medium"}
                      <h4 class="bg-yellow-500 rounded-md border px-3 py-1 text-black">{task.priority}</h4>
                  {:else}
                      <h4 class="bg-gray-50 rounded-md px-3 py-1 border text-black">{task.priority}</h4>
                  {/if}
          </div>
          <h4 class="text-md italic dark:text-[#a0a1a4]"><span></span>{task.createdAt.toDate().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</h4>
          <form>
              <label for="progress">Update task progress: </label>
              <select id="progress" class="border  px-1 py-2 rounded-md dark:bg-[#2A2D32]" bind:value={task.progress} on:change={() => updateProgress(task)}>
                  <option value="" selected disabled>Select Progress</option>
                  <option value="0">0%</option>
                  <option value="25">25%</option>
                  <option value="50">50%</option>
                  <option value="75">75%</option>
                  <option value="100">100%</option>
              </select>
          </form>
          <div class="flex gap-3 items-center text-sm mt-3 ">
              <div class=" bg-gray border h-3 w-44 rounded-full">
                  <div class="bg-[#7864F4] h-2.5 rounded-full transition-all delay-150 duration-300 ease-in-out" style="width: {task.progress}%"></div>
              </div>
              {task.progress}%
          </div>
        </div>
        <div class="flex justify-between items-center">
            <div class="flex gap-2 items-center">
                <form class="flex items-center gap-2">
                    <input type="checkbox" id="complete" class="h-4 w-4 cursor-pointer" bind:checked={task.isCompleted}
                          on:change={() => {
                            task.progress = 100
                            markAsComplete(task)
                            }}
                          />
                    <label for="complete">Mark as complete</label>
                </form>
            </div>
            <div class="flex gap-3 justify-center items-center">
                <button on:click={() => editTask(task)} class="border px-3 py-2 rounded-lg dark:bg-[#626366] dark:border-none">
                    <i class="fa-solid fa-pencil"></i>
                </button>
                <button on:click={() => deleteTask(task)} class="border px-3 py-2 rounded-lg dark:bg-[#626366] dark:border-none">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        </div>   
      </div>
    {/each}
  {/if}
  {/await}
 
</div> 
{/if}
<!-- Table View -->
{#if showTable}
<div style="max-height: 400px; overflow-y: auto;">
  <table class="w-4/5 border max-h-[400px] rounded-md border-collapse">
    <thead class=" bg-gray-200 dark:bg-gray-700">
      <tr class="bg-gray-200 dark:bg-gray-700">
        <th class="px-4 py-2 text-left">Task</th>
        <th class="px-4 py-2 text-left">Description</th>
        <th class="px-4 py-2 text-left">Priority</th>
        <th class="px-4 py-2 text-left">Progress</th>
        <th class="px-4 py-2 text-left">Creation Date</th>
        <th class="px-4 py-2 text-left">Tags</th>
        <th class="px-4 py-2 text-left">Actions</th>
      </tr>
    </thead>
    <tbody class="overflow-y-scroll">
      {#each filteredTasks as task }
        <tr transition:blur="{{amount: 10}}" class="border-b  dark:border-gray-600">
          <td class="px-4 py-2">{task.title.length > 20 ? task.title.slice(0,18).concat("...") : task.title}</td>
          <td class="px-4 py-2">{task.description.length > 20 ? task.description.slice(0, 20).concat("...") : task.description}</td>
          <td class="px-4 py-2">
            <span class="inline-block  py-1 text-sm font-semibold rounded-full">
              {#if task.priority === "High"}
              <h4 class="bg-red-500 rounded-md px-3 py-1 text-white">{task.priority}</h4>
              {:else if  task.priority === "Medium"}
              <h4 class="bg-yellow-500 rounded-md border px-3 py-1 text-black">{task.priority}</h4>
              {:else}
              <h4 class="bg-gray-50 rounded-md px-3 py-1 border text-black">{task.priority}</h4>
              {/if}
            </span>
          </td>
          <td class="px-4 py-2">
            <select id="progress" class="border w-20  cursor-pointer px-1 py-1 rounded-md dark:bg-[#2A2D32]" bind:value={task.progress} on:change={() => updateProgress(task)}>
              <option value="" selected disabled>Select Progress</option>
              <option value="0">0%</option>
              <option value="25">25%</option>
              <option value="50">50%</option>
              <option value="75">75%</option>
              <option value="100">100%</option>
              
          </select>
          <div class="flex gap-3 items-center text-sm mt-3 ">
            <div class=" bg-gray border h-3 w-20 rounded-full">
                <div class="bg-[#7864F4] h-2.5 rounded-full transition-all delay-150 duration-300 ease-in-out" style="width: {task.progress}%"></div>
            </div>
        </div>
          </td>
          <td class="px-4 py-2">{task.createdAt.toDate().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
          <td class="px-4 py-2">
            {#each task.tags as tag}
              <span class="inline-block  bg-[#7864F4]   text-white px-2 py-1 text-xs font-semibold rounded-full mr-1">
                {tag.length > 20 ? tag.slice(0,12).concat("...") : tag}
              </span>
            {/each}
          </td>
          <td class=" gap-2 text-left flex  py-4 px-4">
            <button title="view task" on:click={() => viewTask(task)} class="text-sm bg-gray-200 dark:bg-gray-700 dark:text-white px-2 py-1 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"><i class="fa-solid px-1 fa-eye"></i></button>
            <button title="edit task" on:click={() => editTask(task)} class="text-sm bg-gray-200 dark:bg-gray-700 dark:text-white px-2 py-1 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"><i class="fa-solid  px-1 fa-edit" ></i></button>
            <button title="mark as complete" on:click={() => markAsComplete(task)} class="text-sm bg-gray-200 dark:bg-gray-700 dark:text-white px-2 py-1 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"><i class="fa-solid  px-1 text-lg fa-square-check" ></i></button>
            <button title="delete task" on:click={() => deleteTask(task)} class="text-sm bg-gray-200 dark:bg-gray-700 dark:text-white px-2 py-1 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"><i class="fa-solid  px-1 fa-trash" ></i></button>
          </td>
        </tr>
      {/each}
      {#if filteredTasks.length == 0}
      <div class="flex items-center justify-center w-44 p-2 italic text-center">
         <p>No any ongoing tasks.</p>
      </div>
  {/if}
    </tbody>
  </table>
</div>
{/if}
 
  
</div>

<style>
  /* Add your styles here */
</style>
