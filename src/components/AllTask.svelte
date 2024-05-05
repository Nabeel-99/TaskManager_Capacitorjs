<script lang="ts">
  import { View } from "drizzle-orm";
import CompletedTask from "./CompletedTask.svelte";
import OnGoingTask from "./OnGoingTask.svelte";
import ViewTask from "./ViewTask.svelte";
import dashImage from "$lib/dashImage.jpeg"
  import EditTaskForm from "./EditTaskForm.svelte";
  import { auth, db } from "$lib/firebase/firebase";
  import { arrayRemove, arrayUnion, collection, doc, getDoc, getDocs, onSnapshot, query, updateDoc, where } from "firebase/firestore";
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
                completedTasks = doc.data().completedTasks || []
                filteredTasks = userTasks
            })
      
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
            completedTasks: [...completedTasks, task],
        })
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
            const userData = docSnap.data();
            if (userData && userData.completedTasks) {
                completedTasks = userData.completedTasks;
            }
        }
        userTasks = updatedTasks
        filteredTasks = userTasks
      

    } catch (error) {
        console.log("error marking as complete", error)
    }
}
   
const viewTask = (task: any) => {
    showViewTask =  true;

    taskDetails = task
}
const editTask = (task: any) => {
    showEditForm()
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
   
    showMobileBtn = false
    
}

const showCardView = () => {
    showCards = true
    showTable = false
    localStorage.setItem('view', 'cards')

    showMobileBtn = false
}

const showTableView = () => {
    showTable = true
    showCards = false
    localStorage.setItem('view', 'table')

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
onMount(async() => {
    await fetchUserTasks()

})

onMount(async () => {
    const user = auth.currentUser
    if(user){
        const q = query(collection(db, "users"), where("email", "==", user.email));
        onSnapshot(q, (snapshot) => {
        const docData = snapshot.docs[0].data();
        userTasks = docData.tasks || [];
        completedTasks = docData.completedTasks || [];
        filteredTasks = userTasks;
    });
    }

   
});


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
        <div class="overflow-y-scroll" class:hidden={showViewTask || showEditTaskForm}>
          {#if completedCard}
          <!-- {#key completedTasks} -->
            <CompletedTask
                completedTasks={completedTasks}
                viewTask={viewTask}
                fetchUserTasks={fetchUserTasks}  
                showCards={showCards}
                showTable={showTable}/>
          <!-- {/key} -->
            
          {/if}
        </div>
        {#if showViewTask}
        <div class="overflow-y-scroll mt-8" class:hidden={showEditTaskForm}>
            <ViewTask isOpen={isOpen} closeTask={closeViewTask} taskDetails={taskDetails}/>
        </div>
        {/if}
        {#if showEditTaskForm}
        <div class="overflow-y-scroll flex justify-center">
            <EditTaskForm
                userTasks={userTasks} 
                taskDetails={taskDetails}
                filteredTasks={filteredTasks} 
                closeEditForm={closeForm}/>
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

