<script lang="ts">
import CompletedTask from "./CompletedTask.svelte";
import OnGoingTask from "./OnGoingTask.svelte";

export let showForm: () => void

</script>
   <div class="flex flex-col xl:flex-row  gap-8 xl:gap-48 xl:h-[100vh]">
    <div class="overflow-y-scroll">
        <OnGoingTask showForm={showForm}/>
    </div>
    <div class="overflow-y-scroll">
        <CompletedTask/>
    </div>

    </div>

<style>
    /* your styles go here */
</style>

