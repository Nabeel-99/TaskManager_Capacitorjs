<script lang="ts">
  export let users: { uid: string; displayName: string }[] = [];
  export let selectedUsers: string[] = [];
  export let closeModal: () => void;
  export let saveSelection: (selected: string[]) => void;
  const toggleUserSelection = (uid: string) => {
    if (selectedUsers.includes(uid)) {
      selectedUsers = selectedUsers.filter((id) => id !== uid);
    } else {
      selectedUsers = [...selectedUsers, uid];
    }
  };

  const saveUsers = () => {
    saveSelection(selectedUsers);
    closeModal();
  };
</script>

<div
  class="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center"
>
  <div class="bg-white dark:bg-[#2A2D32] rounded-md p-5 w-1/2">
    <h2 class="text-xl font-bold">Assign Task</h2>
    <div class="mt-4">
      {#each users as user}
        <div class="flex items-center mb-2">
          <input
            type="checkbox"
            id={user.uid}
            checked={selectedUsers.includes(user.uid)}
            on:change={() => toggleUserSelection(user.uid)}
            class="mr-2"
          />
          <label for={user.uid} class="cursor-pointer">{user.displayName}</label
          >
        </div>
      {/each}
    </div>
    <div class="mt-4 flex gap-2 justify-end">
      <button
        on:click={closeModal}
        class="bg-gray-700 text-white hover:bg-gray-600 px-4 py-2 rounded-md"
        >Close</button
      >
      <button
        on:click={saveUsers}
        class="bg-green-700 text-white hover:bg-green-600 px-4 py-2 rounded-md"
        >Save</button
      >
    </div>
  </div>
</div>
