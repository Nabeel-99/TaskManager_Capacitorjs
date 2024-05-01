<script lang="ts">
  import { auth, db } from "$lib/firebase/firebase";
  import { arrayRemove, collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
  import { onMount } from "svelte";
   export let showCards:boolean
   export let showTable:boolean
   export let viewTask:(task: any) => void
   let completedTasks: any[] = []
   let showModal: boolean = false
   let isShowOptions: boolean = false
   const showOptions = (task:any) => {
        isShowOptions = true
   }
   const displayModal = () => {
        showModal = true
    }
    const closeModal = () => {
        showModal = false
    }
  const fetchCompletedTasks = async () => {
        const user = auth.currentUser;
        if(user){
            const q = query(collection(db, "users"), where("email", "==", user.email))
            const querySnapshot = await getDocs(q)
            querySnapshot.forEach((doc) => {
                completedTasks = doc.data().completedTasks || []
            })
            console.log(completedTasks)
        }
    }

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
        console.log("Task deleted successfully: ", task);
        closeModal();
        completedTasks = updatedTasks;
    } catch (error) {
        console.log("Error deleting task", error);
    }
}
    

    onMount(() => {
        fetchCompletedTasks()
    })
</script>

<div class="flex flex-col gap-2">
    <div class="px-7 xl:px-0">
        Completed
    </div>
    {#if showCards}
    <div class="grid grid-flow-col xl:grid-rows-1 xl:grid-flow-row gap-6 overflow-scroll">
        {#if completedTasks.length === 0}
             <div>NO COMPLETED TASKS YET.</div>
         {/if}  
      {#each completedTasks as task }
       <div class="flex flex-col w-72  justify-between gap-3 border-2 rounded-lg shadow-lg p-3 dark:bg-[#3f4247] dark:border-none">
          <div class="flex flex-col gap-3">
            <div class="flex justify-between items-center">
                <h4 class="text-md w-44">{task.title}</h4>
                <button on:click={() => removeTask(task)}  class="text-md border p-1 flex items-center px-2 rounded-md bg-gray-300 hover:bg-[#232529] hover:text-white dark:bg-[#626366] dark:border-none ">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
                <h4 class="text-md dark:text-[#a0a1a4] italic">{task.description.slice(0,90)}...</h4>
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
          <!-- {#if isShowOptions}
            <div class=" bg-white shadow-md flex flex-col  p-1 rounded-md text left text-sm gap-2 top-64 z-10 left-50 right-[40%] border">
                <button class="flex gap-2 items-center justify-start hover:bg-gray-400 px-2 rounded-sm">
                    <i class="fa-solid fa-eye"></i>
                    View task
                </button>
                <button class="flex gap-2 items-center justify-start hover:bg-gray-400 px-2 rounded-sm">
                    <i class="fa-solid fa-trash"></i>
                    Remove from history
                </button>
            </div>
          {/if} -->
          <!-- {#if showModal}
            <div class="fixed top-0 right-0 left-0 bottom-0 flex items-center justify-center  z-10">
                <div class="inset-0 bg-gray-50 opacity-50 fixed top-0 right-0 left-0"></div>
                <div class="flex flex-col gap-4 last:bg-gray-50 p-8  border rounded-md shadow-md z-10">
                    <h2>Are you sure you want to delete this task?</h2>
                    <div class="flex justify-center items-center gap-4">
                        <button on:click={() => removeTask(task)} class="border bg-red-500 text-white px-3 rounded-md hover:bg-red-600">Yes</button>
                        <button on:click={closeModal} class="border bg-gray-500 text-white px-3 rounded-md hover:bg-gray-400">No</button>
                    </div>
                </div>
            </div>
          {/if} -->
          
        </div>
      {/each}
     
    </div>
    {/if}
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
          <th class="px-4 py-2 text-left">Creation Date</th>
          <th class="px-4 py-2 text-left">Completion Date</th>
          <th class="px-4 py-2 text-left">Actions</th>
        </tr>
      </thead>
      <tbody>
        {#each completedTasks as task }
          <tr class="border-b  dark:border-gray-600">
            <!-- <td class="px-4 py-2">
              <input type="checkbox" bind:checked={task.isChecked} on:change={displayOptions}  />
            </td> -->
            <td class="px-4 py-2">{task.title}</td>
            <td class="px-4 py-2">{task.description.slice(0, 30)}...</td>
            <td class="px-2 py-2">{task.createdAt.toDate().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
            <td class="px-2 py-2">{task.completedAt.toDate().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
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