<script lang="ts">
  import {
    addDoc,
    arrayUnion,
    collection,
    getDoc,
    arrayRemove,
    doc,
    getDocs,
    serverTimestamp,
    updateDoc,
  } from "firebase/firestore";
  import { authStore } from "../store/store";
  import OnGoingTask from "./OnGoingTask.svelte";
  import { onMount } from "svelte";
  import { auth, db } from "$lib/firebase/firebase";
  import { update } from "firebase/database";
  import UserSelectModal from "./UserSelectModal.svelte";
  export let closeEditForm: () => void;
  export let taskDetails: any;
  export let filteredTasks: any[];
  export let userTasks: any[];
  let title: string = "";
  let description: string = "";

  let priority: string = "";

  let showUserModal: boolean = false;
  let selectedUsers: string[] = [];
  let allUsers: { uid: string; displayName: string; role?: string }[] = [];
  let assignedUsersCount = 0;
  const closeModal = () => {
    showUserModal = false;
  };
  const handleSaveSelection = (selected: string[]) => {
    selectedUsers = selected;
    assignedUsersCount = selected.length;
    closeModal();
  };
  const fetchUsers = async () => {
    try {
      const usersCollection = collection(db, "users");
      const userDocs = await getDocs(usersCollection);
      allUsers = userDocs.docs
        .map((doc) => {
          const data = doc.data();
          return {
            uid: doc.id,
            displayName: data.displayName || "No Name",
            role: data.role || "user",
          };
        })
        .filter((user) => user.role !== "admin");
    } catch (error) {
      console.log("Error fetching users", error);
    }
  };

  const updateTask = async () => {
    if (!title || !description || !priority) {
      console.log("Please fill in all required fields");
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      console.log("User is not authenticated");
      return;
    }

    try {
      const userDocRef = doc(db, `users/${user.uid}`);
      const userSnapshot = await getDoc(userDocRef);
      const userData = userSnapshot.data();
      if (!userData || !userData.tasks) {
        console.log("No tasks found for the user");
        return;
      }

      // Find and update the specific task
      const updatedTasks = userData.tasks.map((task) => {
        if (task.Id === taskDetails.Id) {
          return {
            ...task,
            title,
            description,
            priority,
            assignedUsers: selectedUsers,
          };
        }
        return task;
      });

      await updateDoc(userDocRef, {
        tasks: updatedTasks,
      });

      console.log("Task updated successfully in user's tasks array");

      // Determine added and removed users
      const previousAssignedUsers = taskDetails.assignedUsers || [];
      const addedUsers = selectedUsers.filter(
        (userId) => !previousAssignedUsers.includes(userId),
      );
      const removedUsers = previousAssignedUsers.filter(
        (userId) => !selectedUsers.includes(userId),
      );

      console.log("Added users:", addedUsers);
      console.log("Removed users:", removedUsers);

      // Add tasks to newly assigned users
      const addTasksPromises = addedUsers.map((userId) => {
        const userDocRef = doc(db, `users/${userId}`);
        return updateDoc(userDocRef, {
          assignedTasks: arrayUnion({
            Id: taskDetails.Id,
            adminId: user.uid,
          }),
        });
      });
      await Promise.all(addTasksPromises);

      console.log("Updated assignedTasks for newly added users");

      // Remove tasks from previously assigned users
      const removeTasksPromises = removedUsers.map((userId) => {
        const userDocRef = doc(db, `users/${userId}`);
        return updateDoc(userDocRef, {
          assignedTasks: arrayRemove({
            Id: taskDetails.Id,
            adminId: user.uid,
          }),
        });
      });
      await Promise.all(removeTasksPromises);

      console.log("Removed assignedTasks from previously assigned users");
      await sendPushNotificationToUsers(selectedUsers, taskDetails);
      // Reset form fields and close the form
      title = "";
      description = "";
      priority = "";
      selectedUsers = [];
      assignedUsersCount = 0;
      closeEditForm();
    } catch (error) {
      console.error("Error updating task: ", error);
    }
  };

  const sendPushNotificationToUsers = async (assignedUsers, taskData) => {
    try {
      const response = await fetch("http://localhost:3000/sendNotification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          assignedUsers,
          taskData,
        }),
      });

      if (response.ok) {
        console.log("Push notification sent successfully");
      } else {
        console.error("Error sending notification");
      }
    } catch (error) {
      console.error("Error calling backend for notifications:", error);
    }
  };

  onMount(() => {
    if (taskDetails) {
      title = taskDetails.title || "";
      description = taskDetails.description || "";
      priority = taskDetails.priority || "";
      selectedUsers = taskDetails.assignedUsers || []; // Pre-select assigned users
      assignedUsersCount = selectedUsers.length;
      fetchUsers(); // Fetch users to populate the modal
    }
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
        on:click={updateTask}
        class="bg-green-700 text-white hover:bg-green-600 px-5 py-2 rounded-md"
        >Update Task</button
      >
      <button
        type="button"
        on:click={closeEditForm}
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
