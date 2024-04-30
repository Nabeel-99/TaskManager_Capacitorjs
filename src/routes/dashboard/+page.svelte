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



  let isOpen: boolean = false
  let isTaskForm: boolean = false
  let isEditForm: boolean = false
  let userTasks:any[] = []
  let allTasks: boolean = true
  let ongoingCard: boolean = true
  let completedCard: boolean = true
  let displayName: string
  let showDisplayCard: boolean = false
  let projectTitle: any[] = []
  let projectName: string = ''

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
                const projects = docSnap.data().projects || []
                displayName = userData.displayName
                if(projects.length > 0) {
                    projectTitle = projects
                }else{
                    projectTitle = ["You haven't created projects yet"];
                }
              
        }
        console.log(`project title: `, projectTitle)
       
    }
}
    
onMount(() => {
    fetchUserDetails()
})

const createProject = async() => {
    if(!projectName){
        console.log("Field is required")
        return
    }
    const user = auth.currentUser
    if(!user){
        console.log("user is not authenticated")
        return
    }
    try {
        const userDocRef = doc(db, `users/${user.uid}`)
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
            const userData = docSnap.data();
            const existingProjects = userData.projects || [];
            const defaultTask = { title: "Default Task", progress: 0, description: "Description of the default task" };
            const newProject = {
                name: projectName,
                tasks: [defaultTask],
                completedTasks: []
            };
            // Combine existing projects with the new one
            const updatedProjects = [...existingProjects, newProject];
            // Update the Firestore document with the updated projects array
            await updateDoc(userDocRef, { projects: updatedProjects });
            console.log("Project created successfully");
            closeDisplayCard();
        } else {
            console.log("User document does not exist");
        }
    } catch (error) {
        console.error("Error creating project:", error);
    }
}

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
  const fetchUserTasks = async () => {
        const user = auth.currentUser;
        if(user){
            const q = query(collection(db, "users"), where("email", "==", user.email))
            const querySnapshot = await getDocs(q)
            querySnapshot.forEach((doc) => {
                userTasks = doc.data().projects
            })
            console.log(`user tasks:`, userTasks)
        }
    }
  onMount(async () => {
    console.log("dashboard rendered")
    await fetchUserTasks()
  })

//   show task form on btn click
const showTaskForm = () => {
    isTaskForm = true;

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
}

const ongoing = () => {
    allTasks = false
    ongoingCard = true
    completedCard = false

}

const completed = () => {
    allTasks = false
    ongoingCard = false
    completedCard = true

}




</script>

{#if !$authStore.loading}
    <div class="flex flex-col h-full w-full  transition-all duration-200  md:flex-row dark:bg-[#2A2D33] ">
        <div class="text-black   md:w-20 flex flex-col md:items-center md:border-r-2  bg-white md:px-8 z-20 open dark:bg-[#1B1D21] dark:border-none" class:md:w-60={isOpen} >
            <div class="hidden md:flex flex-col h-full justify-between fixed bg-white transition-all duration-200  dark:bg-[#1B1D21]">
                <div class="text-2xl mt-8">
                    <button on:click={openMenu} class:hidden={isOpen}><i class="fa-solid fa-bars-staggered dark:text-white"></i></button>
                </div>
                <div class="flex gap-3 pb-8">
                   <button on:click={authHandlers.logout} class:hidden={isOpen} title="Log out"><i class="fa-solid fa-right-from-bracket text-2xl dark:text-white"></i></button> 
                </div>   
            </div>
            <!-- mobile  -->
            <div class="flex md:hidden fixed flex-col justify-between md:px-8 dark:bg-[#2A2D33]">
                <div class="text-2xl mt-7 ml-4">
                    <button on:click={openMenu} class:hidden={isOpen}  class="border rounded-md px-3 py-1"><i class="fa-solid fa-bars-staggered"></i></button>
                </div>
             </div>
             <!-- if menu is open -->   
            {#if isOpen}
            <div class="flex flex-col absolute md:fixed bg-white transition-all duration-200  open dark:bg-[#1B1D21]">
              <SideMenu
              fetchUserDetails={fetchUserDetails}
              displayName={displayName}
              displayCreateCard={displayCreateCard}
              closeDisplayCard={closeDisplayCard}
              createProject={createProject}
              projectTitle={projectTitle}
              showDisplayCard={showDisplayCard}
              projectName={projectName}
              closeMenu={closeMenu}/>
            </div> 
            {/if}
        </div>
        <div class="bg-white w-full  h-full flex flex-col gap-4 transition-all duration-200  dark:bg-[#2A2D33]">
            <!-- PROJECT NAME AND SEARCH BAR  -->
            <div class="flex flex-col gap-8 bg-white  border rounded-b-lg shadow-md w-full fixed pt-20  md:pt-7 justify-between  px-10 pb-4 dark:bg-[#2A2D33] dark:border-none">
                <div class="flex flex-col gap-5 bg-white  md:flex-row justify-between items-center border-b pb-3 w-full dark:bg-[#2A2D33] dark:border-b-[#464b51]">
                    <div>
                        <h2 class="text-2xl font-bold">Project Name</h2>
                    </div> 
                   
                </div>
                <!-- TASK HEADER -->
                <div class="flex justify-between items-center">
                   <div class="flex gap-5">
        <button on:click={alltask} class="{allTasks ? ' border-b-4 border-b-[#7864f4] transition-all duration-200 ease-in-out hover:text-[#553fe3]'  : ''}">All Tasks</button>
        <button on:click={ongoing} class="{ongoingCard ? ' border-b-4 border-b-[#7864f4]  transition-all duration-200 ease-in-out hover:text-[#553fe3]' : ''}">On Going</button>
        <button on:click={completed} class="{completedCard ? ' border-b-4 border-b-[#7864f4]  transition-all duration-200 ease-out hover:text-[#553fe3]' : ''}">Completed</button>
      </div>
                </div>
           </div>
           <div class="flex flex-col xl:flex-row px-3 xl:px-10 mt-72 h-full md:mt-44 justify-between">
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
           
    </div>

{:else}
  <div class="flex items-center justify-center h-screen"> <i class="fa-solid fa-circle-notch spin text-4xl"></i> </div>
{/if}


<style>
   .open{
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
