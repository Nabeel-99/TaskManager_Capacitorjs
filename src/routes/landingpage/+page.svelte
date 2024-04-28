<script>
    import projectImg  from "$lib/projectImage.svg"
</script>
<div class="flex flex-col items-center justify-center  z-10">
    <div class="flex gap-4 last:bg-gray-50 border rounded-md shadow-md z-10">
        <div class="flex flex-col p-8 justify-between gap-2 border-r rounded-md bg-[#232529]">
            <div class="flex flex-col gap-8">
                <h2 class="text-white text-xl">Create a new project</h2>
               <div class="flex flex-col gap-2">
                <label for="project-name" class="text-white text-lg">Project name:</label>
                <input  id="project-name" class="border w-80 px-2 p-1 rounded-md text-black" placeholder="New project" required/>
               </div>
            </div>
            <div class="flex gap-4">
                <button class="px-6 py-1 bg-red-500 rounded-md text-white ">Cancel</button>
                <button class="px-6 py-1 bg-green-500 rounded-md text-white ">Create</button>
            </div>
        </div>
        <div class="p-8">
            <img src={projectImg} alt="project"/>
        </div>
    </div>
</div> 
<style>
    /* your styles go here */
</style>

<!-- markup (zero or more items) goes here -->