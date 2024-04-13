<script lang="ts">
    export let showForm: () => void;
    let progress: number = 0
    let isCompleted: boolean = false

</script>
<div class="grid md:grid-rows-1 md:grid-flow-row gap-2 mb-8">
    <div class="">
        On Going
    </div>
    <div class="grid grid-flow-col xl:grid-rows-1 xl:grid-flow-row gap-8 overflow-y-scroll">
    <div class="flex flex-col w-96 gap-3 border rounded-lg shadow-md p-3">
        <div class="flex justify-between">
            <h4 class="text-md">Title</h4>
            <h4 class="text-md">View full task</h4>
        </div>
        <h4 class="text-md">Task Description</h4>
        <div class="flex gap-2">
            <h4 class="text-md">Task category</h4>
            <h4 class="text-md">Task category</h4>
            <h4 class="text-md">Task type</h4>
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
                <input type="checkbox" class="h-4 w-4 cursor-pointer" bind:checked={isCompleted}
                    on:change={() => progress = 100}
                />
                <p>Mark as completed</p>
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

</div>
    
</div>
<style>
    /* your styles go here */
</style>

<!-- markup (zero or more items) goes here -->