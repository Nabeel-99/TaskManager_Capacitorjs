<script lang="ts">
    export let showForm: () => void;
    export let taskList: {title: string, description: string, category:string[], priority:string}[] = [];
    let progress: number = 0
    let isCompleted: boolean = false

</script>
<div class="grid md:grid-rows-1 md:grid-flow-row gap-2 mb-8">
    <div class="">
        On Going
    </div>
    <div class="grid grid-flow-col xl:grid-rows-1 xl:grid-flow-row gap-8 overflow-y-scroll">
      {#each taskList as task }
      <div class="flex flex-col w-96 gap-3 border rounded-lg shadow-md p-3">
        <div class="flex justify-between">
            <h4 class="text-md">{task.title}</h4>
            <h4 class="text-md">View full task</h4>
        </div>
        <h4 class="text-md">{task.description}</h4>
        <div class="flex gap-2">
            {#each task.category as category }
                <h4 class="text-md">{category}</h4>  
            {/each}
            <h4 class="text-md">{task.priority}</h4>
        </div>
        <h4 class="text-md">date created</h4>
        <h4 class="text-md">Title? optional</h4>
        <form>
            <label for="progress">Update task progress</label>
            <select id="progress" class="border  px-1 py-2 rounded-md" bind:value={progress}>
                <option value="0">0%</option>
                <option value="25">25%</option>
                <option value="50">50%</option>
                <option value="75">75%</option>
                <option value="100">100%</option>
            </select>
        </form>
        <div class="flex gap-3 items-center text-sm mt-3 ">
            <div class=" bg-gray border h-3 w-44 rounded-full">
                <div class="bg-blue-500 h-2.5 rounded-full" style="width: {progress}%"></div>
            </div>
            {progress}%
        </div>
        <div class="flex justify-between items-center">
            <div class="flex gap-2 items-center">
               <form>
                <input type="checkbox" id="complete" class="h-4 w-4 cursor-pointer" bind:checked={isCompleted}
                on:change={() => progress = 100}
            />
                <label for="complete">Mark as completed</label>
                </form>
            </div>
            <div class="flex gap-3 justify-center items-center">
                <button on:click={showForm}  class="border px-3 py-2 rounded-lg">
                    <i class="fa-solid fa-pencil"></i>
                </button>
                <button class="border px-3 py-2 rounded-lg">
                    <i class="fa-solid fa-trash"></i>
                </button>
               
            </div>
          
        </div>
    </div>
      {/each}  
      {#if taskList.length === 0}
        <div>NO TASKS ADDED</div>
      {/if}
  

</div>
    
</div>
<style>
    /* your styles go here */
</style>

<!-- markup (zero or more items) goes here -->