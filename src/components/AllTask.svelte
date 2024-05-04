<script lang="ts">
  import { View } from "drizzle-orm";
import CompletedTask from "./CompletedTask.svelte";
import OnGoingTask from "./OnGoingTask.svelte";
import ViewTask from "./ViewTask.svelte";
import dashImage from "$lib/dashImage.jpeg"
  import EditTaskForm from "./EditTaskForm.svelte";
  import { auth, db } from "$lib/firebase/firebase";
  import { arrayRemove, arrayUnion, collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
export let closeEditForm: () => void
export let showEditForm: () => void
export let isOpen: boolean
export let alltaskCard: boolean
export let ongoingCard: boolean
export let completedCard: boolean
let showViewTask: boolean = false
let taskDetails: any = null
let showEditTaskForm: boolean = false
let userTasks: any[] = []
let completedTasks: any[] = []
let sortByProgressAsc = false
let searchTerm: string = ''
let filteredTasks: any[] = []
let showCards: boolean = true
let showTable: boolean = false
let showMobileBtn:boolean = false
let showSearchBar:boolean = false

const fetchUserTasks = async () => {
        const user = auth.currentUser;
        if(user){
            const q = query(collection(db, "users"), where("email", "==", user.email))
            const querySnapshot = await getDocs(q)
            querySnapshot.forEach((doc) => {
                userTasks = doc.data().tasks || []
                filteredTasks = userTasks
            })
            console.log(userTasks)
        }
    }  
const markAsComplete = async (task: any) => {
    try {
        const user = auth.currentUser
        if(!user){
            console.log("User is not authenticated")
            return
        }
        task.progress = 100
        task.isCompleted = true
        const completedAt = new Date()
        task.completedAt = completedAt

        const updatedTasks = userTasks.filter(t => t !== task)
    

        const userDocRef = doc(db, `users/${user.uid}`)
        await updateDoc(userDocRef, {
            tasks: updatedTasks,
            completedTasks: arrayUnion(task)
        })
        userTasks = updatedTasks
        window.location.reload()
        console.log("Task marked as complete:", task)
    } catch (error) {
        console.log("error marking as complete", error)
    }
}
   
const viewTask = (task: any) => {
    showViewTask =  true;
    console.log("task details: ", task)
    taskDetails = task
}
const editTask = (task: any) => {
    showEditForm()
    console.log("task details: ", task)
    showEditTaskForm = true
    taskDetails = task
}

const closeForm = () => {
    closeEditForm()
    showEditTaskForm = false
}

const closeViewTask = () => {
    showViewTask = false
}
const sortByProgress = () => {
    sortByProgressAsc = !sortByProgressAsc
    if(sortByProgressAsc){
        filteredTasks.sort((a, b) => b.progress - a.progress)
    }else{
        filteredTasks.sort((a, b) => a.progress - b.progress)
    }
    filteredTasks = [...filteredTasks]
    console.log(`sorted tasks:`, filteredTasks)
    showMobileBtn = false
    
}

const showCardView = () => {
    showCards = true
    showTable = false
    localStorage.setItem('view', 'cards')
    console.log("cards clicked")
    showMobileBtn = false
}

const showTableView = () => {
    showTable = true
    showCards = false
    localStorage.setItem('view', 'table')
    console.log("table clicked")
    showMobileBtn = false
}
const displayMobileBtns = () => {
    showMobileBtn = !showMobileBtn
}

const displaySearchBtn = () => {
    showSearchBar = true
}
const closeSearchBar = () => {
    showSearchBar = false
}
onMount(() => {
   const preferredView = localStorage.getItem('view')
   if(preferredView == 'table'){
       showTableView()
   }else{
        showCardView()
   }
})
// onMount(() => {
//     fetchUserTasks()
// })

</script>
   <div   class="flex flex-col  gap-8 xl:flex-row  xl:h-[100vh] {showTable ? 'xl:flex-col gap-20' : ''}">
        <div class="overflow-y-scroll" class:hidden={showEditTaskForm || showViewTask}>
           {#if ongoingCard}
           <OnGoingTask
           showSearchBar={showSearchBar}
           closeSearchBar={closeSearchBar}
           showCards={showCards}
           showTable={showTable}
           markAsComplete={markAsComplete}
           fetchUserTasks={fetchUserTasks}
           viewTask={viewTask} 
           editTask={editTask} 
           filteredTasks={filteredTasks}
           userTasks={userTasks}/>
           {/if}
        </div>
        <!-- {#if completedTasks.length === 0 && userTasks.length === 0}
            <div class="flex flex-col items-center gap-4">
                <img src={dashImage} alt="da" class="rounded-full w-72 "/>
                <div class="flex flex-col gap-2 text-center text-xl">
                    <h3>This is your <span class="font-bold bg-gradient-to-r from-orange-600 from-10% to-green-200 bg-clip-text ">central workspace.</span> Here,</h3>
                    <p>you can see easily view all your tasks organizing</p>
                    <p>your workload in structured way.</p>
                </div>
            </div>
            
        {/if} -->
        <div class="overflow-y-scroll" class:hidden={showViewTask || showEditTaskForm}>
          {#if completedCard}
             <CompletedTask
             viewTask={viewTask}  
             showCards={showCards}
             showTable={showTable}/>
          {/if}
        </div>
        {#if showViewTask}
        <div class="overflow-y-scroll mt-8" class:hidden={showEditTaskForm}>
            <ViewTask isOpen={isOpen} closeTask={closeViewTask} taskDetails={taskDetails}/>
        </div>
        {/if}
        {#if showEditTaskForm}
        <div class="overflow-y-scroll flex justify-center">
            <EditTaskForm userTasks={userTasks} taskDetails={taskDetails} closeEditForm={closeForm}/>
        </div>
      
        {/if}
<!-- sort btn -->
        <div class="hidden md:block">
            <button 
                class="fixed md:right-[2%] top-36  md:top-24 right-0 border px-2 py-1 mr-11 text-xl rounded-lg hover:bg-[#232529] hover:text-white dark:bg-[#626366] dark:border-none" 
                on:click={sortByProgress} 
                title="sort by progress" >
                <i class="fa-solid fa-arrow-down-wide-short"></i>
            </button>
        </div>
        <div class="hidden md:block">
            <button 
                class="fixed md:right-[6%] top-36  md:top-24 right-0 border px-2 py-1 mr-16 text-xl rounded-lg hover:bg-[#232529] hover:text-white dark:bg-[#626366] dark:border-none" 
                on:click={showTableView} 
                title="table view" >
                <i class="fa-solid fa-table-list"></i>
            </button>
        </div>
        <div class="hidden md:block">
            <button 
                class="fixed md:right-[10%] top-36  md:top-24 right-0 border px-3 py-1 mr-20 text-xl rounded-lg hover:bg-[#232529] hover:text-white dark:bg-[#626366] dark:border-none" 
                on:click={showCardView} 
                title="card view" >
                <i class="fa-solid fa-grip-vertical"></i>
            </button>
        </div>
        <!-- mobile menu btns -->
        <div>
            <button 
                class:hidden={showSearchBar}
                on:click={displayMobileBtns} 
                class="fixed top-6 md:hidden -right-4 border px-3 py-2 mr-10 text-xl rounded-full  hover:bg-[#232529]  dark:bg-[#626366] dark:border-none">
                <i class="fa-solid fa-ellipsis "></i>
            </button>
            <button 
                class:hidden={showSearchBar}
                on:click={displaySearchBtn} 
                class="fixed top-6 md:hidden right-10 border px-3 py-2 mr-10 text-xl rounded-full  hover:bg-[#232529]  dark:bg-[#626366] dark:border-none">
                <i class="fa-solid fa-magnifying-glass "></i>
            </button>
        </div>
        {#if showMobileBtn}
            <div class="absolute top-24 right-8 w-56 bg-white border p-2 shadow-md dark:bg-[#1B1D21] dark:border-none  rounded-md z-10">
                <div class="flex flex-col gap-6 items-start justify-center px-3 py-4">
                    <button on:click={showCardView} class="text-md flex items-center gap-2  hover:bg-[#232529] hover:text-white  dark:border-none">
                        <i class="fa-solid fa-grip-vertical px-[0.2rem]"></i>
                        <p class="px-2">Card View</p>
                    </button>
                    <button on:click={showTableView} class="text-md flex items-center gap-2  hover:bg-[#232529] hover:text-white  dark:border-none ">
                        <i class="fa-solid fa-table-list"></i>
                        <p class="px-2">Table View</p>
                    </button>
                    <button on:click={sortByProgress} class="text-md flex items-center gap-2  hover:bg-[#232529] hover:text-white  dark:border-none">
                        <i class="fa-solid fa-arrow-down-wide-short"></i>
                        <p class="px-2">Sort By Progress</p>
                    </button>
                </div>
            </div>
        {/if} 
</div>
<style>
    /* your styles go here */
</style>

