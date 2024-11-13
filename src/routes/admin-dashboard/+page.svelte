<script lang="ts">
  import { onMount } from 'svelte';
  import AllTask from '../../components/AllTask.svelte';
  import SideMenu from '../../components/SideMenu.svelte';
  import TaskForm from '../../components/TaskForm.svelte';
  import { fade, slide } from 'svelte/transition';
  import { authHandlers, authStore } from '../../store/store';
  import {
    collection,
    getDocs,
    type DocumentData,
    query,
    where,
    doc,
    getDoc,
    setDoc,
    updateDoc,
    onSnapshot,
  } from 'firebase/firestore';
  import { auth, db } from '$lib/firebase/firebase';

  import AdminDashboard from '../../components/AdminDashboard.svelte';

  let isOpen: boolean = false;
  let isTaskForm: boolean = false;
  let isEditForm: boolean = false;
  let userTasks: any[] = [];
  let allTasks: boolean = true;
  let ongoingCard: boolean = true;
  let completedCard: boolean = true;
  let displayName: string;
  let userRole: string;
  let taskTitles: any[] = [];
  let completedCount: number = 0;
  let inProgressCount: number = 0;
  let ongoingTasks: any[] = [];
  let doneTasks: any[] = [];
  let showDashboard: boolean = true;
  let showOtherView: boolean = false;
  let userDetails: any;
  let assignedTasksCount: number = 0;

  const fetchUserDetails = async () => {
    const user = auth.currentUser;
    if (user) {
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const userData = docSnap.data();
        const tasks = docSnap.data().tasks || [];
        const completedTasks = docSnap.data().completedTasks || [];
        userDetails = userData;
        displayName = userData.displayName;
        userRole = userData.role;
        if (tasks.length > 0) {
          taskTitles = tasks.map((task: any) => task.title);
        } else {
          taskTitles = ['No tasks added yet'];
        }
        completedCount = completedTasks.length;
        inProgressCount = tasks.length;
        ongoingTasks = tasks;
        userTasks = tasks;
        doneTasks = completedTasks;
      }
    }
  };

  const fetchTaskUser = async () => {
    const user = auth.currentUser;
    if (!user) {
      console.log('No authenticated user');
      return;
    }

    const userDocRef = doc(db, 'users', user.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      const assignedTasks = userData.assignedTasks || [];

      if (assignedTasks.length === 0) {
        console.log('No assigned tasks for user.');
        userTasks = [];
        return;
      }

      const fetchTasks = async () => {
        const taskPromises = assignedTasks.map(async (task) => {
          const adminDocRef = doc(db, 'users', task.adminId);
          const adminDocSnap = await getDoc(adminDocRef);

          if (adminDocSnap.exists()) {
            const adminData = adminDocSnap.data();
            const adminTasks = adminData.tasks || [];
            const adminTask = adminTasks.find(
              (adminTask) => adminTask.Id === task.Id,
            );

            if (adminTask) {
              return {
                ...adminTask,
                adminDisplayName: adminData.displayName,
              };
            }
          }
          return null;
        });

        const results = await Promise.all(taskPromises);
        return results.filter((task) => task);
      };

      try {
        userTasks = await fetchTasks();
        console.log('User tasks:', userTasks);
        assignedTasksCount = userTasks.length;
      } catch (error) {
        console.log('Error fetching user tasks:', error);
        userTasks = [];
      }
    } else {
      console.log('No such document!');
      userTasks = [];
    }
  };
  onMount(() => {
    fetchUserDetails();
    fetchTaskUser();
  });

  function openMenu() {
    isOpen = !isOpen;
  }

  function closeMenu() {
    isOpen = false;
  }

  onMount(() => {
    isOpen = false;
    localStorage.getItem('darkMode');
  });

  //   show task form on btn click
  const showTaskForm = () => {
    isTaskForm = true;
    showDashboard = false;
    showOtherView = true;
  };
  const closeTaskForm = () => {
    isTaskForm = false;
  };
  const showEditForm = () => {
    isEditForm = true;
  };
  const closeEditForm = () => {
    isEditForm = false;
  };

  const alltask = () => {
    allTasks = true;
    ongoingCard = true;
    completedCard = true;
    isTaskForm = false;
  };

  const ongoing = () => {
    allTasks = false;
    ongoingCard = true;
    completedCard = false;
    isTaskForm = false;
  };

  const completed = () => {
    allTasks = false;
    ongoingCard = false;
    completedCard = true;
    isTaskForm = false;
  };

  const displayDashboard = () => {
    showDashboard = true;
    isOpen = false;
  };

  const viewTask = () => {
    showOtherView = true;
    showDashboard = false;
  };
</script>

{#if !$authStore.loading}
  <div class="flex flex-col h-full w-full md:flex-row dark:bg-[#2A2D33]">
    <div
      transition:slide={{ duration: 300 }}
      class="text-black w-24 flex flex-col md:items-center md:border-r-2 bg-white md:px-8 z-20 dark:bg-[#1B1D21] dark:border-none"
      class:w-72={isOpen}
    >
      <div
        class="hidden md:flex flex-col h-full justify-between fixed bg-white dark:bg-[#1B1D21]"
      >
        <div class="text-2xl mt-8">
          <button on:click={openMenu} class:hidden={isOpen}
            ><i class="fa-solid fa-bars-staggered dark:text-white"></i></button
          >
        </div>
        <div class="flex gap-3 pb-8">
          <button
            on:click={authHandlers.logout}
            class:hidden={isOpen}
            title="Log out"
            ><i class="fa-solid fa-right-from-bracket text-2xl dark:text-white"
            ></i></button
          >
        </div>
      </div>
      <!-- mobile  -->
      <div class="flex md:hidden fixed flex-col justify-between md:px-8">
        <div class="text-2xl mt-7 ml-4">
          <button
            on:click={openMenu}
            class:hidden={isOpen}
            class="border rounded-md dark:border-[#626366] bg-white dark:bg-[#1B1D21] px-3 py-1"
            ><i class="fa-solid fa-bars-staggered dark:text-white"></i></button
          >
        </div>
      </div>
      <!-- if menu is open -->
      {#if isOpen}
        <div
          class="flex flex-col md:fixed top-0 left-0 right-0 bg-black dark:bg-[#1B1D21]"
        >
          <div
            class="absolute inset-0 top-0 left-0 right-0 w-full h-[100%] bg-gray-900 dark:bg-gray-50 opacity-20"
          ></div>
          <SideMenu
            {completedCount}
            {inProgressCount}
            {taskTitles}
            {userRole}
            {viewTask}
            {assignedTasksCount}
            {fetchUserDetails}
            {displayName}
            {displayDashboard}
            {closeMenu}
          />
        </div>
      {/if}
    </div>

    {#if showDashboard}
      <AdminDashboard
        {userDetails}
        {displayName}
        {fetchUserDetails}
        {viewTask}
        {ongoingTasks}
        {doneTasks}
        {showTaskForm}
        {isOpen}
      />
    {:else if showOtherView}
      <div class="bg-white w-full h-full flex flex-col gap-4 dark:bg-[#2A2D33]">
        <div
          class="flex flex-col gap-8 bg-white border rounded-b-lg shadow-md w-full fixed pt-20 md:pt-7 justify-between px-10 pb-4 dark:bg-[#2A2D33] dark:border-none"
        >
          <div
            class="flex flex-col gap-5 bg-white md:flex-row justify-between items-center border-b pb-3 w-full dark:bg-[#2A2D33] dark:border-b-[#464b51]"
          >
            <div>
              <h2 class="text-2xl font-bold">My Tasks</h2>
            </div>
          </div>
          <div class="flex md:justify-between justify-center items-center">
            <div class="flex md:gap-5 gap-10 justify-center">
              <button
                on:click={alltask}
                class={allTasks
                  ? ' border-b-4 border-b-[#7864f4] transition-all duration-200 ease-in-out hover:text-[#553fe3]'
                  : ''}>All Tasks</button
              >
              <button
                on:click={ongoing}
                class={ongoingCard
                  ? ' border-b-4 border-b-[#7864f4]  transition-all duration-200 ease-in-out hover:text-[#553fe3]'
                  : ''}>On Going</button
              >
              <button
                on:click={completed}
                class={completedCard
                  ? ' border-b-4 border-b-[#7864f4]  transition-all duration-200 ease-out hover:text-[#553fe3]'
                  : ''}>Completed</button
              >
            </div>
          </div>
        </div>
        <div
          class="flex flex-col xl:flex-row px-3 xl:px-10 mt-60 h-full md:mt-44 justify-between"
        >
          <div class="xl:grid grid-flow-row xl:grid-flow-col">
            {#if isTaskForm}
              <TaskForm {closeTaskForm} />
            {:else}
              <AllTask
                alltaskCard={allTasks}
                {ongoingCard}
                {completedCard}
                {showEditForm}
                {isOpen}
                {ongoingTasks}
                {fetchUserDetails}
                {closeEditForm}
              />
            {/if}
          </div>
          <div
            class="flex flex-col items-center xl:fixed right-50 left-50 xl:right-10 xl:top-60 gap-5 md:mr-10 mb-8 xl:mb-0"
          >
            <i
              class="fa-solid fa-clipboard-list text-[12rem] text-slate-800 dark:text-[#838792]"
            ></i>
            <button
              on:click={showTaskForm}
              class="py-2 px-6 rounded-md bg-[#2A2D33] hover:bg-[#4d4d4f] text-white dark:bg-[#7864F4] dark:text-white dark:hover:bg-[#5947cb]"
              >Add Task</button
            >
          </div>
        </div>
      </div>
    {/if}
  </div>
{:else}
  <div class="flex items-center justify-center h-screen">
    <i class="fa-solid fa-circle-notch spin text-4xl"></i>
  </div>
{/if}

<style>
  .spin {
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
