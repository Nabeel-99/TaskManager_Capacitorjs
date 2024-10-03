<script lang="ts">
  export let closeTask: () => void;
  export let taskDetails: any;
  export let isOpen: boolean;
</script>

<div
  class="flex flex-col bg-[#ffffff] dark:bg-[#3f4149] dark:text-white justify-between gap-6 text-lg xl:w-[50vw] border-2 dark:border-none border-black rounded-md overflow-scroll shadow-md p-3 px-8 mb-8 w"
  class:w-[100%]={isOpen}
>
  <div class="flex flex-col gap-3 py-2">
    <div
      class="text-xl font-bold font-sans flex justify-center border-b-4 border-b-black dark:border-b-[#7d7f85]"
    >
      Full Task Details
    </div>
    <div
      class="flex justify-between border-b-4 border-b-black pb-3 dark:border-b-[#7d7f85]"
    >
      <div class="flex gap-2">
        <h4>Title:</h4>
        <h3 class="font-bold">{taskDetails.title}</h3>
      </div>
    </div>
    <div
      class="flex flex-col gap-4 border-b-black border-b-4 pb-4 dark:border-b-[#7d7f85]"
    >
      <h4 class="underline underline-offset-4">Description:</h4>
      <ul class="list-disc">
        {#each taskDetails.description.split('\n') as list}
          <li>{list}</li>
        {/each}
      </ul>
    </div>
    <div class="flex items-center gap-3 mt-2">
      <div class="flex gap-1 mt-2">
        <h4>priority:</h4>
        <h4 class="italic font-bold">{taskDetails.priority}</h4>
      </div>
    </div>
    <div class="flex gap-3 mt-2"></div>
  </div>

  <div>
    <button
      on:click={closeTask}
      class="px-3 py-1 rounded-md bg-black text-white hover:bg-[#a2a3a7] hover:text-black"
      >Close task</button
    >
  </div>
</div>

<!-- markup (zero or more items) goes here -->

<style>
  /* your styles go here */
</style>
