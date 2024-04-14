<script lang="ts">
  import OnGoingTask from "./OnGoingTask.svelte";

    export let closeTaskForm: () => void;
    export let taskList: {title: string, description: string, category:string[], priority:string}[] = [];
    let title: string = ''
    let description: string = ''
    let category: string = ''
    let priority: string = ''
    let showCategoriesAdded: boolean = false
    let addedCategory: string[] = []
    let showTaskForm: boolean = false

    const addTask = () => {
      taskList.push({title,description, category: addedCategory,priority});
      title = ''
      description = ''
      priority = ''
      addedCategory = []
      console.log(taskList)
      showTaskForm = true
      closeTaskForm()
    }

    const showForm = () => {
        showTaskForm = !showTaskForm
    }

    const handleAddCategory = () => {
        showCategoriesAdded = true
        addedCategory = [...addedCategory, category];
        category = ''
        console.log(addedCategory)

    }
 </script>
 <div class="flex flex-col gap-8  w-[60vw] mb-8 ">
         <div class="text-xl font-bold font-sans ">Add Task</div>
         <form class="flex flex-col gap-3 border p-5 border-black rounded-md w-full bg-white">
             <label for="title">Title:</label>
             <input bind:value={title}  type="text" id="title" class="border border-[#abadaf]  rounded-sm px-2 p-1" required/>
             <label for="description">Task Description:</label>
                <textarea bind:value={description} id="description"  placeholder="Design the frontend of the application..." class="border border-[#abadaf]   h-28 text-black py-1  px-2 overflow-y-scroll"></textarea>
             <label for="category">Task Category: <span class="text-gray-400">(Optional)</span></label>
             <div class="flex gap-3 ">
                <input bind:value={category}   type="text" id="category" placeholder="e.g web design, Book reading, UI design, Thesis..." class="border  border-[#abadaf] w-full rounded-sm px-2 p-1"/>
                <button on:click={handleAddCategory} class="px-4 py-2 bg-green-700 rounded-md hover:bg-green-600 text-white">Add</button>
             </div>
                {#if showCategoriesAdded}
                <div class="flex gap-3">
                   {#each addedCategory as catItem }
                       <div class="flex gap-4 border p-3 rounded-md">
                            {catItem}
                            <div>
                                <button class="text-black" ><i class="fa fa-xmark"></i></button>
                            </div>
                        </div> 
                   {/each}
                </div>
                {/if}
             <label for="priority">Priority:</label>
             <select id="priority" bind:value={priority}  class="w-44 border border-[#abadaf] p-2 " required>
                <option value="" disabled selected>Select Priority</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
             </select>
             <div class="mt-4 flex gap-5">
                 <button on:click={addTask} class="bg-green-700 text-white hover:bg-green-600 px-5 py-2 rounded-md">Create Task</button>
                 <button on:click={closeTaskForm} class="bg-slate-700 text-white hover:bg-slate-600 px-5 py-2 rounded-md">Cancel</button>
             </div>
         </form>
 </div>

 <style>
     /* your styles go here */
 </style>
 
 <!-- markup (zero or more items) goes here -->