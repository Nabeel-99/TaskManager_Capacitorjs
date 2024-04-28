<script lang="ts">
    // your script goes here
    import landingImage from "$lib/landingImage.svg"
    export let createProject:() => void
    export let projectName: string
</script>
<div class="flex items-center justify-between h-screen bg-slate-100 ">
    <div class="flex px-44 text-left items-start justify-between flex-col gap-6">
      <div class="flex flex-col gap-4">
         <h2 class="text-3xl">Welcome, Farouk Nabeel</h2>
         <div class="flex flex-col gap-2 text-xl">
            <h2 class="text-xl">Begin your first step by creating a project.</h2>
            <label for="project-name">Project name:</label>
            <input bind:value={projectName} class="border text-base px-2 p-1 border-black rounded-md" id="project-name"/>
         </div>
      </div>
      <div class="flex mt-16">
        <button on:click={createProject} class="border px-2 p-1 shadow-sm hover:bg-green-700 bg-green-500 text-white rounded-md">Create Project</button>
     </div>
    </div>
    <div class="flex mr-24 flex-col bg-white w-[38rem] h-96   gap-8 rounded-md  xl:mr-32 border p-8 shadow-md">
        <div class="ml-6 text-xl">
            <h2 class="border-b-2 border-black">{projectName}</h2>
        </div>
       <div class="flex items-center justify-center">
            <img src={landingImage} alt="landing" class="xl:w-[20rem] "/>
       </div>
    </div>
</div>
<style>
    /* your styles go here */
</style>

<!-- markup (zero or more items) goes here -->