<script lang="ts">
  import { onMount } from "svelte";
  import AllTask from "../../components/AllTask.svelte";
  import SideMenu from "../../components/SideMenu.svelte";
  import TaskForm from "../../components/TaskForm.svelte";
  import EditTaskForm from "../../components/EditTaskForm.svelte";
  import { fade, slide } from "svelte/transition";
  import { authHandlers, authStore } from "../../store/store";
  import { collection, getDocs, type DocumentData, query, where, doc, getDoc, updateDoc } from "firebase/firestore";
  import { auth, db } from "$lib/firebase/firebase";
  import ViewTask from "../../components/ViewTask.svelte";

  import Dashboard from "../../components/Dashboard.svelte";



  let isOpen: boolean = false
  let isTaskForm: boolean = false
  let isEditForm: boolean = false
  let userTasks:any[] = []
  let allTasks: boolean = true
  let ongoingCard: boolean = true
  let completedCard: boolean = true
  let displayName: string
  let showDisplayCard: boolean = false
  let taskTitles: any[] = []
  let completedCount: number = 0
  let inProgressCount: number = 0
  let ongoingTasks: any[] = []
  let doneTasks: any[] = []
  let showDashboard:boolean = true
  let showOtherView:boolean = false

  const displayCreateCard = () => {
    showDisplayCard = true
} 

const closeDisplayCard = () => {
    showDisplayCard = false
}

const fetchUserDetails = async () => {
    const user = auth.currentUser;
        if(user) {
            const docRef = doc(db, 'users', user.uid)
            const docSnap = await getDoc(docRef)
            if(docSnap.exists()) {
                const userData = docSnap.data();
                const tasks = docSnap.data().tasks || []
                const completedTasks = docSnap.data().completedTasks || []
                displayName = userData.displayName
                if(tasks.length > 0) {
                    taskTitles = tasks.map((task:any) => task.title)
                }else{
                    taskTitles = ["No tasks added yet"];
                }
                completedCount = completedTasks.length
                inProgressCount = tasks.length
                ongoingTasks = tasks
                userTasks = tasks
                doneTasks = completedTasks
                
        }
        console.log(`task titles: `, taskTitles)
        console.log("completed", completedCount)
        console.log(ongoingTasks)
       
    }
}
    
onMount(() => {
    fetchUserDetails()
})


  function openMenu(){
    isOpen = !isOpen
  }

  function closeMenu(){
    isOpen = false
  }

  onMount(() => {
    isOpen = false
    localStorage.getItem('darkMode')
  })

//   show task form on btn click
const showTaskForm = () => {
    isTaskForm = true;
    showDashboard = false
    showOtherView = true

}
const closeTaskForm = () => {
    isTaskForm = false;
}
const showEditForm = () => {
    isEditForm = true
  
}
const closeEditTaskForm = () => {
    isEditForm = false
}

const alltask = () => {
    allTasks = true
    ongoingCard = true
    completedCard = true
    isTaskForm = false
}

const ongoing = () => {
    allTasks = false
    ongoingCard = true
    completedCard = false
    isTaskForm = false

}

const completed = () => {
    allTasks = false
    ongoingCard = false
    completedCard = true
    isTaskForm = false

}

const progressColor = (task: any) => {
    if (task.progress === 25) {
        return "red";
    } else if (task.progress === 50) {
        return "yellow";
    } else if (task.progress === 75) {
        return "green";
    } else if (task.progress === 100) {
        return "blue";
    }
};

const displayDashboard = () => {
    showDashboard = true
    isOpen = false
}

const viewTask = () => {
    showOtherView = true
    showDashboard = false


}
</script>

{#if !$authStore.loading}
    <div class="flex flex-col h-full w-full   md:flex-row dark:bg-[#2A2D33] ">
        <div transition:slide="{{duration: 300}}" class="text-black w-24 flex flex-col md:items-center md:border-r-2  bg-white md:px-8 z-20  dark:bg-[#1B1D21] dark:border-none" class:w-72={isOpen}>
            <div class="hidden md:flex flex-col h-full justify-between fixed bg-white dark:bg-[#1B1D21]">
                <div class="text-2xl mt-8">
                    <button on:click={openMenu} class:hidden={isOpen}><i class="fa-solid fa-bars-staggered dark:text-white"></i></button>
                </div>
                <div class="flex gap-3 pb-8">
                   <button on:click={authHandlers.logout} class:hidden={isOpen} title="Log out"><i class="fa-solid fa-right-from-bracket text-2xl dark:text-white"></i></button> 
                </div>   
            </div>
            <!-- mobile  -->
            <div class="flex md:hidden fixed flex-col justify-between md:px-8 ">
                <div class="text-2xl mt-7 ml-4">
                    <button on:click={openMenu} class:hidden={isOpen}  class="border rounded-md dark:border-[#626366] bg-white dark:bg-[#1B1D21] px-3 py-1"><i class="fa-solid fa-bars-staggered dark:text-white"></i></button>
                </div>
             </div>
             <!-- if menu is open -->   
            {#if isOpen}
            <div class="flex flex-col  md:fixed top-0 left-0 right-0 bg-black  dark:bg-[#1B1D21]">
                <div class="absolute lg:hidden inset-0 top-0 left-0 right-0 w-full h-[100%] bg-gray-900 dark:bg-gray-50 opacity-20"></div>
              <SideMenu
              completedCount={completedCount}
              inProgressCount={inProgressCount}
              taskTitles={taskTitles}
              viewTask={viewTask}
              fetchUserDetails={fetchUserDetails}
              displayName={displayName}
              displayDashboard={displayDashboard}
              closeMenu={closeMenu}/>
            </div> 
            {/if}
        </div>
      
        {#if showDashboard}
            <Dashboard
            displayName={displayName}
            fetchUserDetails={fetchUserDetails}
              viewTask={viewTask}
              ongoingTasks={ongoingTasks}
              doneTasks={doneTasks}
              showTaskForm={showTaskForm}
              isOpen={isOpen}

            />
            {:else if showOtherView}
            <div class="bg-white w-full  h-full flex flex-col gap-4  dark:bg-[#2A2D33]">
                PROJECT NAME AND SEARCH BAR  
               <div class="flex flex-col gap-8 bg-white  border rounded-b-lg shadow-md w-full fixed pt-20  md:pt-7 justify-between  px-10 pb-4 dark:bg-[#2A2D33] dark:border-none">
                   <div class="flex flex-col gap-5 bg-white  md:flex-row justify-between items-center border-b pb-3 w-full dark:bg-[#2A2D33] dark:border-b-[#464b51]">
                       <div>
                           <h2 class="text-2xl font-bold">My Tasks</h2>
                       </div> 
                      
                   </div>
                   <div class="flex md:justify-between justify-center  items-center">
                      <div class="flex md:gap-5 gap-10 justify-center">
                          <button on:click={alltask} class="{allTasks ? ' border-b-4 border-b-[#7864f4] transition-all duration-200 ease-in-out hover:text-[#553fe3]'  : ''}">All Tasks</button>
                          <button on:click={ongoing} class="{ongoingCard ? ' border-b-4 border-b-[#7864f4]  transition-all duration-200 ease-in-out hover:text-[#553fe3]' : ''}">On Going</button>
                          <button on:click={completed} class="{completedCard ? ' border-b-4 border-b-[#7864f4]  transition-all duration-200 ease-out hover:text-[#553fe3]' : ''}">Completed</button>
                       </div>
                   </div>
              </div>
              <div class="flex flex-col xl:flex-row px-3 xl:px-10 mt-60  h-full md:mt-44 justify-between">
                   <div class="xl:grid grid-flow-row xl:grid-flow-col ">
                       {#if isTaskForm}
                           <TaskForm closeTaskForm={closeTaskForm}/>
                         {:else}
                         <AllTask 
                           alltaskCard={allTasks}
                           ongoingCard={ongoingCard}
                           completedCard={completedCard}
                           showEditForm={showEditForm}  
                           isOpen={isOpen} 
                           closeEditForm={closeEditTaskForm} />
                        
                       {/if}
                   </div>
                   <div class="flex flex-col items-center xl:fixed right-50 left-50 xl:right-10 xl:top-60 gap-5 md:mr-10 mb-8 xl:mb-0">
                       <i class="fa-solid fa-clipboard-list text-[12rem] text-slate-800 dark:text-[#838792]"></i>
                       <button on:click={showTaskForm} class="py-2 px-6 rounded-md bg-[#2A2D33] hover:bg-[#4d4d4f] text-white dark:bg-[#7864F4] dark:text-white dark:hover:bg-[#5947cb]">Add Task</button>
                   </div>
              </div>
           </div> 
        {/if}
     
       
        
       
    </div>

{:else}
  <div class="flex items-center justify-center h-screen"> <i class="fa-solid fa-circle-notch spin text-4xl"></i> </div>
{/if}


<style>
  
   .openMenu{
        transition-duration: 300ms;
   }
   .spin{
        animation: spin 2s infinite;
   }
   @keyframes spin {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
   }
</style>
