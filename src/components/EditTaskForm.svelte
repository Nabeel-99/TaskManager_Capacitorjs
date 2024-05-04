<script lang="ts">
    import { addDoc, arrayUnion, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore";
    import { authStore } from "../store/store";
    import OnGoingTask from "./OnGoingTask.svelte";
    import { onMount } from "svelte";
    import { auth, db } from "$lib/firebase/firebase";
    import { update } from "firebase/database";
  
      export let closeEditForm: () => void;
      export let userTasks: any[]
      export let taskDetails: any
      // export let taskList: {title: string, description: string, tags:string[], priority:string}[] = [];
      let title: string = ''
      let description: string = ''
      let tags: string = ''
      let priority: string = ''
      let showCategoriesAdded: boolean = false
      let addedTags: string[] = []
      let catMessage: string = ''
      let catMsgErr: boolean = false
    
       
      const updateTask = async () => {
    if (!title || !description || !priority) {
        console.log("Please fill in all required fields");
        return;
    }
  

    const user = auth.currentUser;
    if (!user) {
        console.log('User is not authenticated');
        return;
    }

    try {
        const userDocRef = doc(db, `users/${user.uid}`);
        const updatedUserTasks = userTasks.map(task => {
            // Update the specific task if its ID matches the task being edited
            if (task.createdAt === taskDetails.createdAt) {
                return {
                    ...task,
                    title,
                    description,
                    tags: addedTags,
                    priority
                };
            }
           
            return task; // Return unchanged tasks
        });

        await updateDoc(userDocRef, {
            tasks: updatedUserTasks
        });

        console.log("Task updated successfully");
        closeEditForm()
    } catch (error) {
        console.log("Error updating task: ", error);
    }
};



      const handleAddTags = () => {
          if(tags.trim() !== ''){
              if(addedTags.length < 3){
                  showCategoriesAdded = true
                  addedTags = [...addedTags, tags];
              }else{
                  catMsgErr = true
                  setTimeout(() => {
                      catMessage = ""
                  }, 2000);
                  catMessage = "Maximum tags reached"
                
              }
            
              tags = ''
          }
          console.log(addedTags)
      }
      const removetags = (catToRemove: string) => {
          addedTags = addedTags.filter(item => item !== catToRemove)
          console.log(addedTags)
      }

      onMount(() => {
        if (taskDetails) {
        title = taskDetails.title || '';
        description = taskDetails.description || '';
        tags = ''
        priority = taskDetails.priority || '';
        addedTags = taskDetails.tags || [];
        showCategoriesAdded = addedTags.length > 0;
    }


      })
  
   </script>
 <div class="flex flex-col gap-8 w-full xl:w-[60vw] mb-8 ">
    <div class="text-xl font-bold font-sans ">Edit Task</div>
    <form class="flex flex-col gap-3 border p-5 border-black rounded-md w-full bg-white dark:bg-[#3c3e42] dark:border-none">
        <label for="title">Title:</label>
        <input bind:value={title}  type="text" id="title" class="border border-[#abadaf] dark:bg-[#2A2D32]  rounded-sm px-2 p-1" required/>
        <label for="description">Task Description:</label>
           <textarea bind:value={description} id="description"  placeholder="Design the frontend of the application..." class="border dark:bg-[#2A2D32] border-[#abadaf]   h-28 text-black py-1  dark:text-white px-2 overflow-y-scroll"></textarea>
        <label for="tags">Tags: <span class="text-gray-400">(Optional)</span></label>
        <div class="flex gap-3 ">
           <input bind:value={tags}  type="text" id="tags" placeholder="e.g web design, Book reading, UI design, Thesis...(5 tags maximum)" class="border dark:bg-[#2A2D32] border-[#abadaf] w-full rounded-sm px-2 p-1"/>
           <button on:click={handleAddTags} class="px-4 py-2 bg-green-700 rounded-md hover:bg-green-600 text-white">Add</button>
        </div>
           {#if showCategoriesAdded}
           <div class="flex gap-3">
              {#each addedTags as catItem }
                  <div class="flex gap-4 border p-3 rounded-md">
                       {catItem}
                       <div>
                           <button on:click={() => removetags(catItem)} class="text-black" ><i class="fa fa-xmark dark:text-white"></i></button>
                       </div>
                   </div> 
              {/each}
             
           </div>
           {/if}
           {#if catMsgErr}
           <div class="text-red-500">{catMessage}</div>
           {/if}
        <label for="priority">Priority:</label>
        <select id="priority" bind:value={priority}  class="w-44 border border-[#abadaf] p-2 dark:bg-[#2A2D32]" required>
           <option value="" disabled selected>Select Priority</option>
           <option value="High">High</option>
           <option value="Medium">Medium</option>
           <option value="Low">Low</option>
        </select>
        <div class="mt-4 flex gap-5">
            <button on:click={updateTask} class="bg-green-700 text-white hover:bg-green-600 px-5 py-2 rounded-md">Update Task</button>
            <button on:click={closeEditForm} class="bg-red-700 text-white hover:bg-red-600 px-5 py-2 rounded-md">Cancel</button>
        </div>
    </form>
</div>
  
   <style>
       /* your styles go here */
   </style>
   
   <!-- markup (zero or more items) goes here -->