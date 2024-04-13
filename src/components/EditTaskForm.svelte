<script lang="ts">
    export let closeEditForm: () => void;
</script>
<div class="flex flex-col gap-8  w-[60vw] mb-8 ">
    <div class="text-xl font-bold font-sans ">Add Task</div>
    <form class="flex flex-col gap-3 border p-5 border-black rounded-md w-full bg-white">
        <label for="title">Title:</label>
        <input  type="text" id="title" class="border border-[#abadaf]  rounded-sm px-2 p-1"/>
        <label for="description">Task Description:</label>
           <textarea placeholder="Design the frontend of the application..." class="border border-[#abadaf]   h-28 text-black py-1  px-2 overflow-y-scroll"></textarea>
        <label for="category">Task Category:</label>
        <div class="flex gap-3 ">
           <input  type="text" id="category" placeholder="e.g web design, Book reading, UI design, Thesis..." class="border  border-[#abadaf] w-full rounded-sm px-2 p-1"/>
           <button class="px-4 py-2 bg-green-700 rounded-md hover:bg-green-600 text-white">Add</button>
        </div>
        <div>
           show added category
        </div>
        <label for="priority">Priority:</label>
        <select id="priority" class="w-44 border border-[#abadaf] p-2 ">
           <option value="" disabled selected>Select Priority</option>
           <option value="High">High</option>
           <option value="Medium">Medium</option>
           <option value="Low">Low</option>
        </select>
        <div class="mt-4 flex gap-5">
            <button class="bg-green-700 text-white hover:bg-green-600 px-5 py-2 rounded-md">Update Task</button>
            <button on:click={closeEditForm} class="bg-slate-700 text-white hover:bg-slate-600 px-5 py-2 rounded-md">Cancel</button>
        </div>
    </form>
</div>
<style>
    /* your styles go here */
</style>

<!-- markup (zero or more items) goes here -->