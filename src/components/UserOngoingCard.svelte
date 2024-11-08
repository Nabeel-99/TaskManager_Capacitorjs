<script lang="ts">
  import { auth, db } from '$lib/firebase/firebase';
  import {
    doc,
    getDoc,
    updateDoc,
    collection,
    query,
    where,
    getDocs,
  } from 'firebase/firestore';
  import {
    getStorage,
    ref,
    uploadBytes,
    getDownloadURL,
    uploadString,
  } from 'firebase/storage'; // Import necessary Firestore storage functions

  import { afterUpdate, onMount } from 'svelte';
  import EditTaskForm from './EditTaskForm.svelte';
  import { fade, slide, blur, fly } from 'svelte/transition';
  import completedImage from '$lib/projectImage.svg';
  import ongoingImage from '$lib/completed.png';
  import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

  export let viewTask: (task: any) => void;
  export let editTask: (task: any) => void;
  export let showCards: boolean;
  export let ongoingTasks: any[];
  export let showTable: boolean;
  export let fetchUserTasks: () => Promise<void>;
  export let fetchUserDetails: () => Promise<void>;
  export let showSearchBar: boolean;
  export let closeSearchBar: () => void;
  export let isOpen: boolean;

  let userTasks = [];
  let filteredTasks = [];
  let searchQuery = '';
  const storage = getStorage();
  const updateProgress = async (task) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.log('User is not authenticated');
        return;
      }

      const taskIndex = userTasks.findIndex((t) => t.Id === task.Id);
      if (taskIndex > -1) {
        userTasks[taskIndex].progress = task.progress; // Update progress in the local array
      }

      const userDocRef = doc(db, `users/${user.uid}`);
      await updateDoc(userDocRef, { tasks: userTasks });
    } catch (error) {
      console.log('Error updating task: ', error);
    }
  };

  const searchTasks = () => {
    filteredTasks = userTasks.filter(
      (task) =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase()),
    );
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
              // Include the admin displayName in the returned task object
              return {
                ...adminTask,
                adminDisplayName: adminData.displayName, // Add the admin's display name
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
        searchTasks(); // Update filteredTasks after fetching userTasks
      } catch (error) {
        console.log('Error fetching user tasks:', error);
        userTasks = [];
      }
    } else {
      console.log('No such document!');
      userTasks = [];
    }
  };

  let isImageExpanded = false;
  let expandedImageUrl = '';
  let successMessage = '';
  let showSuccessMessage = false;

  const expandImage = (imageUrl) => {
    expandedImageUrl = imageUrl; // Set the expanded image URL
    isImageExpanded = true; // Show the expanded image modal
  };

  const closeImage = () => {
    isImageExpanded = false; // Hide the expanded image modal
    expandedImageUrl = ''; // Clear the expanded image URL
  };

  const takePicture = async (task) => {
    try {
      const picture = await Camera.getPhoto({
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera,
      });

      const base64Data = picture.base64String;
      if (!base64Data) {
        console.error('No base64 data returned from the camera');
        return;
      }

      // Upload the image to Firestore, passing the specific task
      await uploadImageToFirestore(base64Data, task);
    } catch (error) {
      console.error('Error taking picture:', error);
    }
  };
  const uploadImageToFirestore = async (base64Data, task) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.log('No authenticated user');
        return;
      }

      // Get user document reference
      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        console.error('User document does not exist.');
        return;
      }

      // Fetch the admin's user ID using their display name
      const adminId = await getAdminIdByDisplayName(task.adminDisplayName);
      if (!adminId) {
        console.error('Admin ID could not be found.');
        return;
      }

      // Define image reference in Firebase Storage
      const imageRef = ref(storage, `tasks/${task.Id}/image.jpg`);

      // Upload the image string directly to Firebase Storage
      await uploadString(imageRef, base64Data, 'base64');

      // Get the download URL
      const downloadURL = await getDownloadURL(imageRef);

      // Update the user's assigned task with the download URL
      await updateDoc(userDocRef, {
        assignedTasks: userDocSnap
          .data()
          .assignedTasks.map((t) =>
            t.Id === task.Id ? { ...t, imageUrl: downloadURL } : t,
          ),
      });

      // Update the admin task in Firestore
      const adminDocRef = doc(db, 'users', adminId);
      const adminDocSnap = await getDoc(adminDocRef);

      if (adminDocSnap.exists()) {
        const adminTasks = adminDocSnap.data().tasks || [];

        await updateDoc(adminDocRef, {
          tasks: adminTasks.map((t) =>
            t.Id === task.Id ? { ...t, imageUrl: downloadURL } : t,
          ),
        });

        console.log(
          'Image uploaded successfully to both user and admin tasks.',
        );
      } else {
        console.error('Admin document does not exist.');
      }
      await fetchTaskUser();
      successMessage = 'Image uploaded successfully!'; // Set success message
      showSuccessMessage = true; // Show success message

      // Hide the message after 3 seconds
      setTimeout(() => {
        showSuccessMessage = false; // Hide the message
      }, 3000);
    } catch (error) {
      console.error('Error uploading image to Firestore:', error);
    }
  };

  // Fetch admin ID by display name
  const getAdminIdByDisplayName = async (displayName) => {
    const adminsCollection = collection(db, 'users');
    const q = query(adminsCollection, where('displayName', '==', displayName));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].id; // Admin's user ID
    }
    return null;
  };

  // Call fetchTaskUser every time the component is mounted
  onMount(() => {
    fetchUserTasks();
    fetchTaskUser();
    fetchUserDetails();
  });

  // Automatically filter tasks when userTasks or searchQuery changes
  $: searchTasks();
</script>

<div transition:fade={{ duration: 300 }} class="flex flex-col gap-2">
  <!-- search btn -->
  <div
    class="hidden md:flex items-center md:fixed right-10 top-5 justify-center"
  >
    <label for="search-input"
      ><i
        class="fa-solid fa-magnifying-glass border border-r px-3 py-3 rounded-l-full dark:bg-[#3f4146] dark:border-[#898c97]"
      ></i></label
    >
    <input
      placeholder="Search ongoing tasks"
      id="search-input"
      class="border px-2 w-80 py-2 rounded-r-full dark:bg-[#3f4146] dark:border-[#898c97]"
      bind:value={searchQuery}
      on:input={searchTasks}
    />
  </div>
  <!-- mobile search btn -->
  {#if showSearchBar}
    <div
      class="fixed top-20 items-center right-0 left-0 px-3 flex justify-center w-full md:hidden"
    >
      <button on:click={() => closeSearchBar()}>
        <i
          class="fa-solid fa-xmark border border-r px-3 py-3 rounded-l-full dark:bg-[#3f4146] dark:border-[#898c97]"
        ></i>
      </button>
      <input
        placeholder="Search ongoing tasks"
        id="search-input"
        class="border px-2 w-full py-2 rounded-r-full dark:bg-[#3f4146] dark:border-[#898c97]"
        bind:value={searchQuery}
        on:input={searchTasks}
      />
    </div>
  {/if}
  {#if showSuccessMessage}
    <div
      class="fixed top-44 flex items-center justify-center py-4 right-0 left-0 w-full px-10 transition-all bg-green-400 text-white duration-300"
    >
      {successMessage}
    </div>
  {/if}
  <div class="px-7 flex items-center gap-2 w-full xl:px-0">
    <i class="fa-solid fa-circle text-[0.6rem] text-orange-400"></i>
    On Going
  </div>
  <!-- Cards view -->
  {#if showCards}
    <div
      class="grid md:grid-cols-2 gap-10 pb-10 w-full overflow-y-scroll {isOpen
        ? 'xl:grid-cols-2'
        : ''}"
    >
      {#await filteredTasks}
        <p>Loading..</p>
      {:then}
        {#if filteredTasks.length === 0 && searchQuery !== ''}
          <div class="italic">NO MATCHING TASKS FOUND.</div>
        {:else if filteredTasks.length == 0}
          <div
            class="p-4 rounded-md bg-white border dark:bg-[#3f4247] dark:border-none shadow-md flex flex-col items-center justify-center w-72 gap-2 px-5 py-3 h-48 italic"
          >
            <div>
              <img src={ongoingImage} alt="" class="h-32 w-42" />
            </div>
            EMPTY ONGOING TASKS
          </div>
        {:else}
          {#each filteredTasks as task}
            <div
              transition:blur={{ amount: 10 }}
              class="flex flex-col w-96 justify-between gap-3 border-2 rounded-lg shadow-lg p-3 dark:bg-[#3f4247] dark:border-none"
            >
              <div class="flex flex-col gap-3">
                <div class="flex justify-between items-center">
                  <h4 class="text-md w-44">
                    Title: {task.title.length > 20
                      ? task.title.slice(0, 18).concat('...')
                      : task.title}
                  </h4>
                  <div class="flex flex-col gap-4">
                    <button
                      on:click={() => viewTask(task)}
                      class="text-md border p-1 flex items-center px-2 rounded-md bg-gray-300 hover:bg-[#232529] hover:text-white dark:bg-[#626366] dark:border-none"
                      >View full task</button
                    >
                    <button
                      on:click={() => takePicture(task)}
                      class="text-md border p-1 flex items-center px-2 rounded-md bg-gray-300 hover:bg-[#232529] hover:text-white dark:bg-[#626366] dark:border-none"
                      >Upload Picture</button
                    >
                  </div>
                </div>
                <div class="flex flex-col gap-2">
                  <h4 class="text-md dark:text-[#a0a1a4]">
                    Description: {task.description.length > 20
                      ? task.description.slice(0, 20).concat('...')
                      : task.description}
                  </h4>
                </div>

                <div class="flex flex-col gap-2">
                  <div>Upload Image:</div>
                  {#if task.imageUrl}
                    <div class="mt-4">
                      <img
                        src={task.imageUrl}
                        alt="Uploaded Image"
                        class=" object-contain w-24 h-24"
                        on:click={() => expandImage(task.imageUrl)}
                      />
                    </div>
                  {:else}
                    <td>No uploaded picture.</td>
                  {/if}

                  {#if isImageExpanded}
                    <div
                      class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
                      on:click={closeImage}
                    >
                      <img
                        src={expandedImageUrl}
                        alt="Expanded Image"
                        class="max-h-screen max-w-screen"
                      />
                    </div>
                  {/if}
                </div>
                <div class="flex text-md items-center gap-3">
                  <h4>Priority:</h4>
                  {#if task.priority === 'High'}
                    <h4 class="bg-red-500 rounded-md px-3 py-1 text-white">
                      {task.priority}
                    </h4>
                  {:else if task.priority === 'Medium'}
                    <h4
                      class="bg-yellow-500 rounded-md border px-3 py-1 text-black"
                    >
                      {task.priority}
                    </h4>
                  {:else}
                    <h4
                      class="bg-gray-50 rounded-md px-3 py-1 border text-black"
                    >
                      {task.priority}
                    </h4>
                  {/if}
                </div>
                <h4 class="text-md italic dark:text-[#a0a1a4]">
                  <span></span>{task.createdAt
                    .toDate()
                    .toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                </h4>
              </div>
            </div>
          {/each}
        {/if}
      {:catch error}
        <p>Error loading tasks: {error.message}</p>
      {/await}
    </div>
  {/if}

  <!-- Table View -->
  {#if showTable}
    <div
      style="max-height: 400px; overflow: auto; max-width: 100%; width: 100%;"
    >
      {#if showSuccessMessage}
        <div
          class="fixed top-44 flex items-center justify-center py-4 right-0 left-0 w-full px-10 transition-all bg-green-400 text-white duration-300"
        >
          {successMessage}
        </div>
      {/if}
      <table
        class="border max-h-[400px] overflow-auto rounded-md border-collapse"
      >
        <thead class=" bg-gray-200 dark:bg-gray-700">
          <tr class="bg-gray-200 dark:bg-gray-700">
            <th class="px-4 py-2 text-left">Task</th>
            <th class="px-4 py-2 text-left">Description</th>
            <th class="px-4 py-2 text-left">Priority</th>
            <th class="px-4 py-2 text-left">Assigned By</th>
            <th class="px-4 py-2 text-left">Creation Date</th>
            <th class="px-4 py-2 text-left">Uploaded Picture</th>
            <th class="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody class="overflow-scroll">
          {#each filteredTasks as task}
            <tr
              transition:blur={{ amount: 10 }}
              class="border-b dark:border-gray-600"
            >
              <td class="px-4 py-2"
                >{task.title.length > 20
                  ? task.title.slice(0, 18).concat('...')
                  : task.title}</td
              >
              <td class="px-4 py-2"
                >{task.description.length > 20
                  ? task.description.slice(0, 20).concat('...')
                  : task.description}</td
              >
              <td class="px-4 py-2">
                <span
                  class="inline-block py-1 text-sm font-semibold rounded-full"
                >
                  {#if task.priority === 'High'}
                    <h4 class="bg-red-500 rounded-md px-3 py-1 text-white">
                      {task.priority}
                    </h4>
                  {:else if task.priority === 'Medium'}
                    <h4
                      class="bg-yellow-500 rounded-md border px-3 py-1 text-black"
                    >
                      {task.priority}
                    </h4>
                  {:else}
                    <h4
                      class="bg-gray-50 rounded-md px-3 py-1 border text-black"
                    >
                      {task.priority}
                    </h4>
                  {/if}
                </span>
              </td>
              <td class="px-4 py-2">{task.adminDisplayName}</td>

              <td class="px-4 py-2"
                >{task.createdAt.toDate().toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}</td
              >

              <td class="px-4 py-2">
                {#if task.imageUrl}
                  <div class="mt-4">
                    <img
                      src={task.imageUrl}
                      alt="Uploaded Image"
                      class=" object-contain w-24 h-24"
                      on:click={() => expandImage(task.imageUrl)}
                    />
                  </div>
                {:else}
                  <td>No uploaded picture.</td>
                {/if}

                {#if isImageExpanded}
                  <div
                    class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
                    on:click={closeImage}
                  >
                    <img
                      src={expandedImageUrl}
                      alt="Expanded Image"
                      class="max-h-screen max-w-screen"
                    />
                  </div>
                {/if}
              </td>
              <td
                class=" gap-2 text-left flex items-center justify-center py-4 px-4"
              >
                <button
                  title="view task"
                  on:click={() => viewTask(task)}
                  class="text-sm bg-gray-200 dark:bg-gray-700 dark:text-white px-2 py-1 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
                  ><i class="fa-solid px-1 fa-eye"></i></button
                >
                <button
                  title="Upload picture"
                  on:click={() => takePicture(task)}
                  class="text-sm bg-gray-200 dark:bg-gray-700 dark:text-white px-2 py-1 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  <i class="fa-solid fa-camera px-1"></i>
                </button>
              </td>
            </tr>
          {/each}
          {#if filteredTasks.length == 0}
            <div
              class="flex items-center justify-center w-44 p-2 italic text-center"
            >
              <p>No any ongoing tasks.</p>
            </div>
          {/if}
        </tbody>
      </table>
    </div>
  {/if}
</div>

<style>
  .success-message {
    /* background-color: green; 
    color: white; 
    padding: 10px; 
    border-radius: 5px; 
    margin-top: 10px; 
    transition: opacity 0.5s ease; 
    position: sticky;
    top: 40px; */
  }
</style>
