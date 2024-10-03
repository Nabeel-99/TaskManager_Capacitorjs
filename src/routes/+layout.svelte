<script lang="ts">
  import Navbar from '../components/Navbar.svelte';
  import '../app.css';
  import { onMount } from 'svelte';
  import { auth, db } from '$lib/firebase/firebase';
  import { doc, getDoc, setDoc } from 'firebase/firestore';
  import { authStore } from '../store/store';
  import AllTask from '../components/AllTask.svelte';
  import EditTaskForm from '../components/EditTaskForm.svelte';
  import { PushNotifications } from '@capacitor/push-notifications';
  import { Capacitor } from '@capacitor/core';

  let showNav: boolean = true;
  let showFooter: boolean = true;
  let showSideMenu: boolean = false;
  const nonAuthRoutes = ['/'];
  onMount(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user: any) => {
      const currentPath = window.location.pathname;

      if (!user && !nonAuthRoutes.includes(currentPath)) {
        window.location.href = '/';
        return;
      }

      if (user && currentPath === '/') {
        const userRef = doc(db, 'users', user.uid);
        getDoc(userRef).then((userDoc) => {
          if (userDoc.exists()) {
            const userData = userDoc.data();
            if (userData.role === 'admin') {
              window.location.href = '/admin-dashboard';
            } else if (userData.role === 'user') {
              window.location.href = '/dashboard';
            } else {
              console.log('Unknown role:', userData.role);
            }
          } else {
            console.log('User data not found');
          }
        });
      }
      if (
        currentPath.startsWith('/dashboard') ||
        currentPath.startsWith('/admin-dashboard')
      ) {
        showNav = false;
        showFooter = false;
      }
      if (!user) {
        return;
      }
      let dataToSetToStore: any;
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        const userRef = doc(db, 'users', user.uid);
        dataToSetToStore = {
          email: user.email,
          fullName: user?.displayName,
        };
        await setDoc(userRef, dataToSetToStore, { merge: true });
      } else {
        const userData = docSnap.data();
        dataToSetToStore = userData;
      }
      authStore.update((curr) => {
        return {
          ...curr,
          user,
          data: dataToSetToStore,
          loading: false,
        };
      });
    });
  });
  export let darkMode: boolean = false;
  const toggleDarkMode = () => {
    darkMode = !darkMode;
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    applyDarkMode();
  };
  const applyDarkMode = () => {
    document.body.classList.toggle('dark', darkMode);
  };
  onMount(() => {
    const storeDarkMode = localStorage.getItem('darkMode');
    if (storeDarkMode) {
      darkMode = JSON.parse(storeDarkMode);
      applyDarkMode();
    }
  });

  // Function to request permissions and register for push notifications
</script>

<div class="app dark:bg-[#232529] dark:text-white">
  {#if showNav}
    <Navbar on:toggleDarkMode={toggleDarkMode} {darkMode} />
  {/if}

  <main>
    <slot darkmode={darkMode} />
  </main>
  {#if showFooter}
    <footer class="border-t w-screen dark:border-t-[#525355]">
      <p>All Rights Reserved &copy; copyright 2024</p>
    </footer>
  {/if}
</div>

<style>
  .app {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  main {
    flex: 1;
    display: flex;
    flex-direction: column;
    /* padding: 1rem; */
    width: 100%;
    /* max-width: 64rem; */
    margin: 0 auto;
    box-sizing: border-box;
  }

  footer {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 12px;
  }

  footer a {
    font-weight: bold;
  }

  @media (min-width: 480px) {
    footer {
      padding: 12px 0;
    }
  }
</style>
