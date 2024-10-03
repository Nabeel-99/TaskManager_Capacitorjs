<script lang="ts">
  import {
    addDoc,
    arrayUnion,
    collection,
    doc,
    getDocs,
    getDoc,
    serverTimestamp,
    setDoc,
    updateDoc,
  } from 'firebase/firestore';
  import { authStore } from '../store/store';
  import OnGoingTask from './OnGoingTask.svelte';
  import { onMount } from 'svelte';
  import { auth, db } from '$lib/firebase/firebase';
  import { update } from 'firebase/database';
  import UserSelectModal from './UserSelectModal.svelte'; // Import the modal component
  import { Capacitor } from '@capacitor/core';

  export let closeTaskForm: () => void;
  let title: string = '';
  let description: string = '';
  let priority: string = '';
  let showCategoriesAdded: boolean = false;
  let showUserModal: boolean = false;
  let selectedUsers: string[] = [];
  let allUsers: { uid: string; displayName: string; role?: string }[] = [];
  let assignedUsersCount = 0;

  const fetchUsers = async () => {
    try {
      const usersCollection = collection(db, 'users');
      const userDocs = await getDocs(usersCollection);
      allUsers = userDocs.docs
        .map((doc) => {
          const data = doc.data();
          return {
            uid: doc.id,
            displayName: data.displayName || 'No Name',
            role: data.role || 'user',
          };
        })
        .filter((user) => user.role !== 'admin');
    } catch (error) {
      console.log('Error fetching users', error);
    }
  };

  const closeModal = () => {
    showUserModal = false;
  };
  const handleSaveSelection = (selected: string[]) => {
    selectedUsers = selected;
    assignedUsersCount = selected.length;
    closeModal();
  };

  const createTask = async () => {
  if (!title || !description || !priority) {
    console.log('Please fill in all required fields');
    return;
  }

  const user = auth.currentUser;
  if (!user) {
    console.log('User is not authenticated');
    return;
  }

  // Create a new task document with Firestore auto-generated ID
  const newTaskRef = doc(collection(db, 'tasks')); // Create a reference to a new task document
  const taskId = newTaskRef.id; // Get the auto-generated ID

  const task = {
    Id: taskId,
    title,
    description,
    priority,
    progress: 0,
    createdAt: new Date(),
    assignedUsers: selectedUsers,
  };

  try {
    // Set the task document with the auto-generated ID
    await setDoc(newTaskRef, task);

    // Update admin's tasks array
    const adminDocRef = doc(db, `users/${user.uid}`);
    await updateDoc(adminDocRef, {
      tasks: arrayUnion(task),
    });

    // Update each assigned user's document to include this task
    const userUpdates = selectedUsers.map((userId) => {
      const userDocRef = doc(db, `users/${userId}`);
      return updateDoc(userDocRef, {
        assignedTasks: arrayUnion({
          Id: taskId,
          adminId: user.uid,
        }),
      });
    });
    await Promise.all(userUpdates);

    console.log('Task created successfully');

       // Check platform and send notifications to assigned users only on mobile
       if (Capacitor.getPlatform() === 'android' || Capacitor.getPlatform() === 'ios') {
      selectedUsers.forEach(async (userId) => {
        const userDocRef = doc(db, `users/${userId}`);
        const userSnapshot = await getDoc(userDocRef);
        const userData = userSnapshot.data();

        if (userData && userData.pushToken) {
          const notificationPayload = {
            userId, // Send userId for the server
            taskId,  // Send taskId for the server
            taskTitle: title, // Send task title
          };

          await fetch('http://192.168.100.19:3000/send-notification', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(notificationPayload),
          });
        }
      });
    } else {
      console.log('Notifications are only sent on mobile platforms.');
    }

    // Reset form fields
    title = '';
    description = '';
    priority = '';
    selectedUsers = [];
    showCategoriesAdded = false;
    assignedUsersCount = 0;
    closeTaskForm();
  } catch (error) {
    console.log('Error creating task', error);
  }
};

  onMount(() => {
    fetchUsers();
  });
</script>

<div class="flex flex-col gap-8 xl:w-[60vw] mb-8">
  <div class="text-xl font-bold font-sans">Add Task</div>
  <form
    class="flex flex-col gap-3 border p-5 border-black rounded-md w-full bg-white dark:bg-[#3c3e42] dark:border-none"
  >
    <label for="title">Title:</label>
    <input
      bind:value={title}
      type="text"
      id="title"
      class="border border-[#abadaf] rounded-sm px-2 p-1 dark:bg-[#2A2D32]"
      required
    />
    <label for="description">Task Description:</label>
    <textarea
      bind:value={description}
      id="description"
      placeholder="Design the frontend of the application..."
      class="border border-[#abadaf] dark:bg-[#2A2D32] dark:text-white h-28 text-black py-1 px-2 overflow-y-scroll"
    ></textarea>

    <label for="priority">Priority:</label>
    <select
      id="priority"
      bind:value={priority}
      class="w-44 border border-[#abadaf] p-2 dark:bg-[#2A2D32]"
      required
    >
      <option value="" disabled selected>Select Priority</option>
      <option value="High">High</option>
      <option value="Medium">Medium</option>
      <option value="Low">Low</option>
    </select>

    <div class="mt-4 flex items-center gap-5">
      <p>
        Assigned Users: <span class="w-10 border rounded h-10 px-3 py-1">
          {assignedUsersCount}
        </span>
      </p>
      <button
        type="button"
        on:click={() => (showUserModal = true)}
        class="bg-blue-700 text-white hover:bg-blue-600 px-5 py-2 rounded-md"
        >Assign To</button
      >
    </div>
    <div class="mt-4 flex gap-5">
      <button
        type="submit"
        on:click={createTask}
        class="bg-green-700 text-white hover:bg-green-600 px-5 py-2 rounded-md"
        >Create Task</button
      >
      <button
        type="button"
        on:click={closeTaskForm}
        class="bg-red-700 text-white hover:bg-red-600 px-5 py-2 rounded-md"
        >Cancel</button
      >
    </div>
  </form>

  {#if showUserModal}
    <UserSelectModal
      users={allUsers}
      {selectedUsers}
      saveSelection={handleSaveSelection}
      {closeModal}
    />
  {/if}
</div>

<!-- markup (zero or more items) goes here -->

<style>
  /* your styles go here */
</style>
