<script lang="ts">
  import { auth, db } from "$lib/firebase/firebase";
  import { doc, updateDoc } from "firebase/firestore";
  import { afterUpdate, onMount } from "svelte";
  import EditTaskForm from "./EditTaskForm.svelte";

  export let viewTask: (task: any) => void
  export let editTask: (task: any) => void
  export let userTasks: any[]
  export let showCards: boolean
  export let showTable: boolean
  export let fetchUserTasks: () => void;
  export let markAsComplete: (task: any) => void;
  export let filteredTasks: any[]
  let searchQuery: string = "";
  let showOptions: boolean = false
  let selectedTasks: any[] = []
  // let filteredTasks: any[] = userTasks;
  const displayOptions = () => {
    showOptions = !showOptions
  }
  const closeDisplay = () => {
    showOptions = false
  }
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
        console.log("Task deleted successfully: ", task);
        userTasks = updatedTasks;
        filteredTasks = updatedTasks
    } catch (error) {
        console.log("Error deleting task", error);
    }
  }
// Function to update the selected tasks and header checkbox
const updateSelection = () => {
    const headerCheckbox = document.getElementById('headerCheckbox') as HTMLInputElement;
    if (headerCheckbox) {
        headerCheckbox.checked = selectedTasks.length === filteredTasks.length;
    }
};

const selectAll = (event: Event) => {
    const isChecked = (event.target as HTMLInputElement).checked;

    // Update the isChecked property of each task
    filteredTasks.forEach(task => {
        task.isChecked = isChecked;
    });

    // Update the selectedTasks array based on the checked status
    if (isChecked) {
        selectedTasks = [...filteredTasks]; // Select all tasks
    } else {
        selectedTasks = []; // Deselect all tasks
    }

    console.log(selectedTasks);
};

// After each update, ensure the header checkbox is updated
afterUpdate(updateSelection);



  const deleteSelected = async () => {
    try {
        // Delete selected tasks
        const user = auth.currentUser;
        if (!user) {
            console.log("User is not authenticated");
            return;
        }
        const userDocRef = doc(db, `users/${user.uid}`);
        const updatedTasks = userTasks.filter(task => !selectedTasks.includes(task));
        await updateDoc(userDocRef, { tasks: updatedTasks });

        // Clear the selected tasks
        selectedTasks = [];
    } catch (error) {
        console.log("Error deleting tasks: ", error);
    }
};

  const markSelectedAsComplete = async () => {
    try {
        // Mark selected tasks as complete
        const user = auth.currentUser;
        if (!user) {
            console.log("User is not authenticated");
            return;
        }
        const userDocRef = doc(db, `users/${user.uid}`);
        const updatedTasks = userTasks.map(task => {
            if (selectedTasks.includes(task)) {
                return { ...task, isCompleted: true };
            }
            return task;
        });
        await updateDoc(userDocRef, { tasks: updatedTasks });

        // Clear the selected tasks
        selectedTasks = [];
    } catch (error) {
        console.log("Error marking tasks as complete: ", error);
    }
};



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
        console.log("progress updated successfully", task);
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
    // filteredTasks = [...userTasks]; 
  });
  $: searchTasks();
</script>

<div class=" flex flex-col gap-2 ">
  <!-- search btn -->
  <div class="hidden md:flex items-center md:fixed right-10 top-5 justify-center">
    <label for="search-input"><i class="fa-solid fa-magnifying-glass border border-r px-3 py-3 rounded-l-full dark:bg-[#3f4146] dark:border-[#898c97]"></i></label>
    <input placeholder="Search ongoing tasks" id="search-input" class="border px-2 w-80 py-2 rounded-r-full dark:bg-[#3f4146] dark:border-[#898c97]" bind:value={searchQuery} on:input={searchTasks} />
  </div>
  
  <div class="px-7 xl:px-0">
    On Going
  </div>
<!-- Cards view -->
{#if showCards}
<div class="grid grid-flow-col xl:grid-rows-1 xl:grid-flow-row gap-8 overflow-y-scroll">
  {#if filteredTasks.length === 0 && searchQuery !== ""}
  <div>NO MATCHING TASKS FOUND.</div>
    {:else if filteredTasks.length == 0}
    <div>NO ANY ONGOING TASKS.</div>
  {:else}
    {#each filteredTasks as task }
     <div class="flex flex-col w-96  justify-between gap-3 border-2 rounded-lg shadow-lg p-3 dark:bg-[#3f4247] dark:border-none">
        <div class="flex flex-col gap-3">
          <div class="flex justify-between items-center">
              <h4 class="text-md w-44">{task.title}</h4>
              <button on:click={() => viewTask(task)} class="text-md border p-1 flex items-center px-2 rounded-md bg-gray-300 hover:bg-[#232529] hover:text-white dark:bg-[#626366] dark:border-none">View full task</button>
          </div>
          <h4 class="text-md dark:text-[#a0a1a4]">{task.description.slice(0,90)}...</h4>
          <div class="flex gap-2">
              {#each task.tags  as tag}
                  <h4 class="text-md px-2 py-1 rounded-lg bg-[#7864F4]  text-white">{tag}</h4>  
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
</div> 
{/if}
<!-- Table View -->
{#if showTable}
<div>
  <table class="w-4/5 border max-h-[400px] rounded-md border-collapse">
    <thead>
      <tr class="bg-gray-200 dark:bg-gray-700">
        <!-- <th class="px-4 py-2 text-left">
          <input id="headerCheckbox" type="checkbox" 
                 checked={selectedTasks.length === filteredTasks.length}
                 on:change={selectAll}/>
      </th> -->
        <th class="px-4 py-2 text-left">Task</th>
        <th class="px-4 py-2 text-left">Description</th>
        <th class="px-4 py-2 text-left">Priority</th>
        <th class="px-4 py-2 text-left">Progress</th>
        <th class="px-4 py-2 text-left">Creation Date</th>
        <th class="px-4 py-2 text-left">Tags</th>
        <th class="px-4 py-2 text-left">Actions</th>
      </tr>
    </thead>
    <tbody>
      {#each filteredTasks as task }
        <tr class="border-b  dark:border-gray-600">
          <!-- <td class="px-4 py-2">
            <input type="checkbox" bind:checked={task.isChecked} on:change={displayOptions}  />
          </td> -->
          <td class="px-4 py-2">{task.title}</td>
          <td class="px-4 py-2">{task.description.slice(0, 30)}...</td>
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
          <td class="px-7 py-2">{task.progress}%</td>
          <td class="px-2 py-2">{task.createdAt.toDate().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
          <td class="px-4 py-2">
            {#each task.tags as tag}
              <span class="inline-block  bg-[#7864F4]   text-white px-2 py-1 text-xs font-semibold rounded-full mr-1">
                {tag}
              </span>
            {/each}
          </td>
          <td class=" gap-2 text-left flex  py-4 px-4">
            <button on:click={() => viewTask(task)} class="text-sm bg-gray-200 dark:bg-gray-700 dark:text-white px-2 py-1 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"><i class="fa-solid fa-eye" title="view task"></i></button>
            <button on:click={() => editTask(task)} class="text-sm bg-gray-200 dark:bg-gray-700 dark:text-white px-2 py-1 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"><i class="fa-solid fa-edit" title="edit task"></i></button>
            <button on:click={() => deleteTask(task)} class="text-sm bg-gray-200 dark:bg-gray-700 dark:text-white px-2 py-1 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"><i class="fa-solid fa-trash" title="delete task"></i></button>
          </td>
        </tr>
        <!-- {#if showOptions}
           <div class="fixed top-[83%] right-[50%] left-[40%] border rounded-md shadow-sm bg-gray-200 p-1  items-center  w-[40%]">
               <div class="flex gap-2 justify-between">
                  <div class="flex">
                    <span class="text-4xl border-r border-slate-500 h-full flex items-center px-6 ">3 </span> 
                    <h2 class="text-xl flex items-center justify-center px-2">Tasks selected</h2>
                  </div>
                  <div class="flex gap-8">
                      <button class="flex flex-col justify-center items-center gap-2 hover:text-blue-800">
                        <i class="fa-regular text-3xl fa-square-check "></i>
                        Done
                      </button>
                      <button class="flex flex-col justify-center items-center gap-2 hover:text-blue-800">
                        <i class="fa-regular text-3xl fa-trash-can" title="delete task"></i>
                        Delete
                      </button>
                      <button on:click={closeDisplay} class="border-l border-slate-500 px-4 flex items-center hover:text-blue-800">
                        <i class="fa-solid text-3xl fa-xmark"></i>
                      </button>
                  </div>
              
               </div>
            

           </div>
        {/if} -->
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
