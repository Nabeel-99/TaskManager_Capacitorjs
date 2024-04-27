<script lang="ts">
  import { auth, db } from "$lib/firebase/firebase";
  import { arrayRemove, collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
  import { onMount } from "svelte";
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

<div class="grid md:grid-rows-1 md:grid-flow-row gap-2  mb-8">
    <div class="px-7 xl:px-0">
        Completed
    </div>
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

</div>
<style>
    /* your styles go here */
</style>

<!-- markup (zero or more items) goes here -->