<script lang="ts">
  import { auth, db } from "$lib/firebase/firebase";
  import { update } from "firebase/database";
  import { arrayRemove, collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
  import {  onMount } from "svelte";
  import EditTaskForm from "./EditTaskForm.svelte";
    export let viewTask: (task: any) => void
    export let editForm: (task: any) => void
    export let userTasks: any[]
    export let fetchUserTasks:() => void;
    export let markAsComplete: (task: any) => void;
    let showModal: boolean = false
    // const displayModal = (task: any) => {
    //     showModal = true
    //     return task
    // }
    // const closeModal = () => {
    //     showModal = false
    // }
    
   
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
        // closeModal();
        userTasks = updatedTasks;
    } catch (error) {
        console.log("Error deleting task", error);
    }
}
    const updateProgress = async(task: any) => {
        try {
            const user = auth.currentUser
            if(!user){
                console.log("user is not authenticated")
                return
            }
            const userDocRef = doc(db, `users/${user.uid}`);
            await updateDoc(userDocRef, {
                tasks: userTasks
            })
            console.log("progess updated successfulyy", task)
        } catch (error) {
            console.log("Error updating task: ", error)
        }
    }
   
    onMount(() => {
        fetchUserTasks()
    })

</script>
<div class="grid md:grid-rows-1 md:grid-flow-row gap-2  mb-8">
    <!-- search btn -->
    <div class="hidden md:flex items-center md:fixed right-10 top-5 justify-center">
        <label for="search-input" class=""><i class="fa-solid fa-magnifying-glass  border-r px-3 py-3 rounded-l-full dark:bg-[#3f4146] dark:border-r-[#898c97] "></i></label>
        <input placeholder="Search" id="search-input" class="border px-2 w-80 py-2 rounded-r-full dark:bg-[#3f4146] dark:border-none"  />
    </div>
    <div class="px-7 xl:px-0">
        On Going
    </div>
    <div class="grid grid-flow-col xl:grid-rows-1 xl:grid-flow-row gap-8 overflow-y-scroll">
        {#if userTasks.length === 0}
             <div>NO ADDED TASKS YET.</div>
         {/if}  
      {#each userTasks as task }
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
                <h4 class="text-md italic dark:text-[#a0a1a4"><span></span>{task.createdAt.toDate().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</h4>
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
                    <button on:click={() => editForm(task)} class="border px-3 py-2 rounded-lg dark:bg-[#626366] dark:border-none">
                        <i class="fa-solid fa-pencil"></i>
                    </button>
                    <button on:click={() => deleteTask(task)} class="border px-3 py-2 rounded-lg dark:bg-[#626366] dark:border-none">
                        <i class="fa-solid fa-trash"></i>
                    </button>
               
                </div>
            </div>   
          <!-- {#if showModal}
            <div class="fixed top-0 right-0 left-0 bottom-0 flex items-center justify-center  z-10">
                <div class="inset-0 bg-gray-50 opacity-50 fixed top-0 right-0 left-0"></div>
                <div class="flex flex-col gap-4 last:bg-gray-50 p-8  border rounded-md shadow-md z-10">
                    <h2>Are you sure you want to delete this task?</h2>
                    <div class="flex justify-center items-center gap-4">
                        <button on:click={() => deleteTask(task)} class="border bg-red-500 text-white px-3 rounded-md hover:bg-red-600">Yes</button>
                        <button on:click={closeModal} class="border bg-gray-500 text-white px-3 rounded-md hover:bg-gray-400">No</button>
                    </div>
                </div>
            </div>
          {/if} -->
          
        </div>
      {/each}
     
    </div>

</div>
<style>

</style>

<!-- markup (zero or more items) goes here -->