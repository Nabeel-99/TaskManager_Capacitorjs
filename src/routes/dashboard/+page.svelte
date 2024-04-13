<script lang="ts">
  import { onMount } from "svelte";

    // your script goes here

  import AllTask from "../../components/AllTask.svelte";
  import SideMenu from "../../components/SideMenu.svelte";
  import TaskForm from "../../components/TaskForm.svelte";
  import EditTaskForm from "../../components/EditTaskForm.svelte";

  let isOpen: boolean = false
  let isTaskForm: boolean = false
  let isEditForm: boolean = false

  function openMenu(){
    isOpen = !isOpen
    console.log('opened')
  }

  function closeMenu(){
    isOpen = false
  }

  onMount(() => {
    isOpen = false
  })

//   show task form on btn click
const showTaskForm = () => {
    isTaskForm = true;
}
const closeTaskForm = () => {
    isTaskForm = false;
}
const showEditTaskForm = () => {
    isEditForm = true
}

const closeEditTaskForm = () => {
    isEditForm = false
}

</script>
<div class="flex flex-col h-full w-full  md:flex-row ">
    <div class="text-black   md:w-20 flex flex-col md:items-center md:border-r-2  bg-white md:px-8 z-20" class:md:w-60={isOpen}>
        <div class="hidden md:flex flex-col h-full justify-between fixed bg-white ">
            <div class="text-2xl mt-8">
                <button on:click={openMenu} class:hidden={isOpen}><i class="fa-solid fa-bars-staggered"></i></button>
            </div>
            <div class="flex gap-3 pb-8">
               <button class:hidden={isOpen}><i class="fa-solid fa-right-from-bracket text-2xl"></i></button> 
            </div>   
        </div>
        <!-- mobile  -->
        <div class="flex md:hidden fixed flex-col justify-between md:px-8">
            <div class="text-2xl mt-7 ml-7">
                <button on:click={openMenu} class:hidden={isOpen}  class="border rounded-md px-3 py-1"><i class="fa-solid fa-bars-staggered"></i></button>
            </div>
         </div>
         <!-- if menu is open -->   
        {#if isOpen}
        <div class="flex flex-col absolute md:fixed bg-white">
         <SideMenu closeMenu={closeMenu}/>
        </div> 
        {/if}
    </div>
    <div class="bg-white w-full  h-full flex flex-col gap-4">
        <!-- PROJECT NAME AND SEARCH BAR  -->
        <div class="flex flex-col gap-8 bg-white rounded-b-lg shadow-md w-full fixed pt-20  md:pt-7 justify-between  px-10 pb-4">
            <div class="flex flex-col gap-5 bg-white  md:flex-row justify-between items-center border-b pb-3 w-full">
                <div>
                    <h2 class="text-2xl font-bold">Project Name</h2>
                </div> 
                <div class="flex items-center md:fixed right-10 justify-center">
                    <label for="search-input" class=""><i class="fa-solid fa-magnifying-glass border px-3 py-3 rounded-l-full"></i></label>
                    <input placeholder="Search" id="search-input" class="border px-2 w-80 py-2 rounded-r-full" />
                </div>
            </div>
            <!-- TASK HEADER -->
            <div class="flex justify-between items-center">
                <div class="flex gap-5">
                    <button>All Tasks</button>
                    <button>On Going</button>
                    <button>Completed</button>
                </div>
                <div class="fixed md:right-10 right-0 border px-2 py-1 mr-10 text-xl rounded-lg hover:bg-[#232529] hover:text-white">
                        <button><i class="fa-solid fa-arrow-down-wide-short"></i></button>
                </div>
            </div>
       </div>
       <div class="flex flex-col xl:flex-row px-10 mt-72 h-full md:mt-44 justify-between">
            <div class="grid grid-flow-row xl:grid-flow-col ">
                {#if isTaskForm}
                    <TaskForm closeTaskForm={closeTaskForm}/>
                    {:else if isEditForm}
                        <EditTaskForm closeEditForm={closeEditTaskForm}/>
                  {:else}
                  <AllTask showForm={showEditTaskForm} />
                {/if}
            </div>
            <div class="flex flex-col items-center xl:fixed right-50 left-50 xl:right-10 xl:top-60 gap-5 md:mr-10 mb-8 xl:mb-0">
                <i class="fa-solid fa-clipboard-list text-[12rem] text-slate-800"></i>
                <button on:click={showTaskForm} class="py-2 px-6 rounded-md bg-[#232529] hover:bg-[#4d4d4f] text-white">Add Task</button>
            </div>
       </div>
    </div>
       
</div>

<style>
    /* your styles go here */
</style>
<!-- 
    <div class="hidden md:flex flex-col bg-white border-r-2 h-full justify-between fixed py-8 w-12">
        <div class="text-2xl">
            <button><i class="fa-solid fa-bars-staggered"></i></button>
        </div>
        <div class="flex gap-3 pb-8">
            <i class="fa-solid fa-right-from-bracket text-2xl"></i>
        </div>
    </div>

    <div class="text-2xl">
            <button><i class="fa-solid fa-bars-staggered"></i></button>
        </div>
        <div class="flex gap-3 pb-8">
            <i class="fa-solid fa-right-from-bracket text-2xl"></i>
        </div>
 -->
<!-- markup (zero or more items) goes here -->
<!-- <div class="flex flex-col bg-white border-r-2 h-full  justify-between fixed py-8 w-56"> -->
<!--  
     <div class="flex flex-col bg-white border-r-2 h-full justify-between fixed py-8 w-12">
        <div class="text-2xl">
            <button><i class="fa-solid fa-bars-staggered"></i></button>
        </div>
        <div class="flex gap-3 pb-8">
            <i class="fa-solid fa-right-from-bracket text-2xl"></i>
            <button>Log out</button> 
        </div> 

        when open - ml-72 , gap for grid 40
        <div class="flex flex-col">
            <div class="text-3xl">
                <button><i class="fa-solid fa-xmark"></i></button>
            </div>
            <div class="flex flex-col mt-6">
                USER NAME 
                <div class="flex gap-3 pb-8">
                    <button class="flex gap-2 items-center w-44 px-3  hover:bg-[#232529] rounded-md hover:text-white">
                        <i class="fa-solid fa-user-large"></i>
                       Farouk Nabeel
                    </button>
                </div>
                 MAIN MENU 
                <div class="px-3 text-[0.7rem] font-bold pb-2">MAIN MENU</div>
                <div class="flex flex-col gap-3 pb-8 ">
                    <button class="flex gap-2 items-center w-44 px-3 hover:bg-[#232529] rounded-md hover:text-white">
                        <i class="fa-solid fa-grip text-xl"></i>
                        Dashboard
                    </button>
                    <button class="flex gap-2 items-center w-44 px-3 hover:bg-[#232529] rounded-md hover:text-white">
                        <i class="fa-regular fa-clipboard text-xl"></i>
                        Project
                    </button>
                </div>
              TASK
                <div class="px-3 text-[0.7rem] font-bold pb-2">TASKS</div>
                <div class="flex gap-3 pb-8 ">
                   <p class="px-3 text-sm">Recently created task</p>
                </div>
                PROJECT 
                <div class="px-3 text-[0.7rem] font-bold pb-2">PROJECTS</div>
                <div class="flex gap-3 pb-8 ">
                    <p class="px-3 text-sm">Recently created project</p>
                </div>
          </div>
        </div>
        TOGGLE MODE 
        <div>
            <div class="flex gap-3 pb-8 ">
                <button class="flex gap-2 items-center w-44 px-3 hover:bg-[#232529] rounded-md hover:text-white">
                    <i class="fa-solid fa-moon text-xl"></i>
                    Toggle Mode
                </button>
            </div>
            LOG OU
            <div class="flex gap-3 pb-8 ">
                <button class="flex gap-2 items-center w-44 px-3 hover:bg-[#232529] rounded-md hover:text-white">
                    <i class="fa-solid fa-right-from-bracket text-xl "></i>
                    Log out
                </button>
            </div>
        </div>        -->