<script lang="ts">
  // your script goes her
  import dashboardImage from '$lib/landingImage.svg';
  import completedImage from '$lib/projectImage.svg';
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
  import ongoingImage from '$lib/completed.png';
  import { onMount } from 'svelte';
  import { auth, db } from '$lib/firebase/firebase';
  export let ongoingTasks: any[];
  export let userTasks: any[];
  export let doneTasks: any[];
  export let showTaskForm: () => void;
  export let isOpen: boolean;
  export let viewTask: () => void;
  export let fetchUserDetails: () => Promise<void>;
  export let fetchTaskUser: () => Promise<void>;
  export let displayName: string;
  import { PushNotifications } from '@capacitor/push-notifications';
  import { Capacitor } from '@capacitor/core';

  const registerPushNotification = async () => {
    const user = auth.currentUser; // Ensure the user is signed in

    if (
      Capacitor.getPlatform() === 'android' ||
      Capacitor.getPlatform() === 'ios'
    ) {
      // Only proceed if the user is logged in
      if (user) {
        const result = await PushNotifications.requestPermissions();
        if (result.receive === 'granted') {
          PushNotifications.register().catch((err) => {
            console.error('Error during push notification registration:', err);
          });
        } else {
          console.log('User denied permission to receive push notifications');
        }

        // Register event listeners
        PushNotifications.addListener('registration', async (token) => {
          console.log('Registration successful:', token);
          const userDocRef = doc(db, `users/${user.uid}`);
          await setDoc(
            userDocRef,
            {
              pushToken: token.value, 
            },
            { merge: true },
          );
          console.log('Push token saved to Firestore');
        });

        PushNotifications.addListener(
          'pushNotificationReceived',
          (notification) => {
            console.log('Notification received', notification);
            alert(`Notification: ${notification.title} - ${notification.body}`);
          },
        );
      } else {
        console.log('User is not signed in');
      }
    } else {
      console.log('Push notifications are not supported on this platform.');
    }
  };

  onMount(async () => {
    const user = auth.currentUser; // Check if user is signed in
    if (user) {
      await registerPushNotification();
    }
  });

  onMount(() => {
    fetchUserDetails();
    fetchTaskUser();
  });
</script>

<div class="flex w-full h-screen flex-col overflow-y-scroll px-10">
  <div class="flex pt-20 md:pt-0">
    <h2 class="text-[1.6rem] py-8">Task Manager</h2>
  </div>
  <div
    class="flex flex-col justify-between xl:flex-row lg:items-start items-center gap-8 pb-8"
  >
    <div
      class="bg-gradient-to-br from-[#1b1d2118] dark:border dark:border-[#1b1d2118] to-[#dbdee523] dark:bg-gradient-to-br dark:from-[#1B1D21] dark:to-[#2A2D33] min-w-96 shadow-md w-full xl:w-3/4 xl:h-auto h-[40rem] rounded-md p-8 py-4 pb-10 flex flex-col gap-8 items-center justify-between overflow-y-scroll"
      class:w-[80%]={isOpen}
    >
      <div class="flex flex-col lg:h-80 gap-3">
        {#if userTasks.length > 0}
          <div class="flex flex-col text-3xl w-full md:text-4xl">
            <span
              class="bg-gradient-to-r from-[#030f76] to-[#b12525] text-transparent mt-4 bg-clip-text font-sans
                dark:from-[#8590f3] dark:to-[#f05050]
                ">Hello, {displayName}</span
            >
            <span
              class="bg-gradient-to-r from-[#757575] to-[#141624] text-transparent mt-4 bg-clip-text font-sans
                dark:from-[#c9c9c9] dark:to-[#fbfbfd]
                ">Here's a quick overview of your tasks</span
            >
          </div>
          <div
            class="flex flex-col gap-2 overflow-auto border dark:border-[#1b1d21] p-8 bg-white dark:bg-gradient-to-br dark:from-[#1B1D21] dark:to-[#131417] rounded-lg min-h-64 max-h-64"
          >
            <div class="border dark:border-[#4f4f54] px-3 py-2 rounded-xl">
              My Tasks
            </div>
            {#each userTasks as task}
              <div class="">
                <ul class="list-disc ml-6">
                  <li>{task.title}</li>
                </ul>
              </div>
            {/each}
          </div>
        {/if}

        {#if userTasks.length === 0}
          <div class="h- flex flex-col gap-8 text-xl">
            <div class="flex flex-col">
              <span
                class="bg-gradient-to-r from-[#030f76] to-[#b12525] text-transparent text-4xl mt-4 bg-clip-text font-sans
                    dark:from-[#8590f3] dark:to-[#f05050]
                    ">Hello, {displayName}</span
              >
              <span
                class="bg-gradient-to-r from-[#757575] to-[#141624] text-transparent text-4xl mt-4 bg-clip-text font-sans
                    dark:from-[#c9c9c9] dark:to-[#fbfbfd]
                    "
                >Here, you’ll find all the tasks that have been <span
                  class="block">assigned to you.</span
                ></span
              >
            </div>
            <div
              class="flex gap-8 flex-col md:flex-row items-center justify-center"
            >
              <div class="flex flex-col items-center md:items-start">
                <img
                  src={dashboardImage}
                  alt=""
                  class="w-72 items-center flex justify-center"
                />
                <p class="italic">NO ANY ONGOING TASKS</p>
              </div>
            </div>
          </div>
        {/if}
      </div>
      <div class="flex gap-8 flex-col mt-8 md:flex-row">
        <div class="flex flex-col justify-center items-center gap-4 py-8">
          <h2>PENDING TASKS</h2>
          {#if userTasks.length > 0}
            <div
              class="p-4 rounded-md bg-white dark:bg-gradient-to-br dark:from-[#1B1D21] dark:to-[#131417] shadow-md flex flex-col w-72 gap-2 px-5 py-3 h-48"
            >
              My Tasks
              <p class="text-sm">Recently assigned task</p>
              {#each userTasks.slice(-2) as task}
                <div
                  class="flex gap-3 items-center justify-between p-2 rounded-md border bg-gray-50 dark:bg-[#303137] dark:border-black"
                >
                  {task.title.length > 20
                    ? task.title.slice(0, 18).concat('...')
                    : task.title}
                  <i class="fa-solid fa-clock text-orange-400"></i>
                </div>
              {/each}
            </div>
          {:else}
            <div
              class="p-4 rounded-md bg-white dark:bg-gradient-to-br dark:from-[#1B1D21] dark:to-[#131417] shadow-md flex flex-col items-center justify-center w-72 gap-2 px-5 py-3 h-48 italic"
            >
              <div>
                <img src={ongoingImage} alt="" class="w-42 h-32" />
              </div>
              EMPTY ONGOING TASKS
            </div>
          {/if}
        </div>
      </div>
    </div>
    <div class="flex flex-col items-center gap-14">
      <div class="mb-44">
        <button
          on:click={viewTask}
          class="flex justify-between items-center gap-12 py-2 px-6 rounded-full bg-[#2A2D33] text-white hover:bg-[#4d4d4f] dark:bg-[#f3cc1b] dark:text-black dark:hover:bg-[#d2b11f]"
        >
          View Tasks
          <i class="fa-solid fa-arrow-right"></i>
        </button>
      </div>
    </div>
  </div>
</div>

<!-- markup (zero or more items) goes here -->

<style>
  .progress-circle {
    animation: progressAnimation 2s linear forwards;
  }
  @keyframes progressAnimation {
    from {
      stroke-dashoffset: 472; /* Initial dash offset */
    }
  }

  .task {
    animation: taskText 3s linear forwards;
    opacity: 0;
  }
  @keyframes taskText {
    0% {
      opacity: 0;
    }
    50% {
      opacity: 0.5;
    }
    100% {
      opacity: 1;
    }
  }
</style>
