<script lang="ts">
  import Navbar from "../components/Navbar.svelte";
  import "../app.css";
  import { onMount } from "svelte";
  import { auth, db } from "$lib/firebase/firebase";
  import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
  import { authStore } from "../store/store";
  import AllTask from "../components/AllTask.svelte";
  import EditTaskForm from "../components/EditTaskForm.svelte";
  import {
    PushNotifications,
    type ActionPerformed,
    type PushNotificationSchema,
    type Token,
  } from "@capacitor/push-notifications";
  let showNav: boolean = true;
  let showFooter: boolean = true;
  let showSideMenu: boolean = false;
  const nonAuthRoutes = ["/"];

  onMount(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user: any) => {
      const currentPath = window.location.pathname;

      if (!user && !nonAuthRoutes.includes(currentPath)) {
        window.location.href = "/";
        return;
      }

      // Request permission to use push notifications
      PushNotifications.requestPermissions().then((result) => {
        if (result.receive === "granted") {
          // Register with Apple / Google to receive push via APNS/FCM
          PushNotifications.register();
        } else {
          console.error("Push notification permission denied");
        }
      });

      // Listener for successful registration
      PushNotifications.addListener("registration", async (token: Token) => {
        console.log("Push token:", token.value);
        const user = auth.currentUser;
        if (user) {
          const userDocRef = doc(db, "users", user.uid);
          try {
            await updateDoc(userDocRef, {
              fcmToken: token.value,
            });
            console.log("user device token saved");
          } catch (error) {
            console.log("error storing token", error);
          }
        } else {
          console.log("user is not logged in");
        }
      });
      // device 1
      //ekR9CqCjQsCIL703|woAN3:APA91bFjwfB7JkZZxNYqoYBUIxPPXc5zCPJyBciGeWzsEebK7XvxXnHSOwRcUcyRlyAlepgB4XTUeyURF35EG9n5KtXvge6EEiQ2hyaWfmhV8fbX-m6DYs
      // device2
      //c-DpGD0hRZmlqHHB6vwUmk:APA91bHZnbzLKD62ZyA5i7POFk3HDwqvlb3B-_6f3npBoELSQ_xdNqyP1E_gJgl9H8XiBKuYelcSC67Dno1wAAPfENMCXMpz362LO97qm1QhtwOuYZsBo4U
      // Listener for registration errors
      PushNotifications.addListener("registrationError", (error: any) => {
        alert(`Error on registration: ${JSON.stringify(error)}`);
        console.error("Registration error:", error);
      });

      // Listener for receiving notifications while the app is open
      PushNotifications.addListener(
        "pushNotificationReceived",
        (notification: PushNotificationSchema) => {
          alert(`Push received: ${JSON.stringify(notification)}`);
          console.log("Push notification received:", notification);
        },
      );

      // Listener for handling notification actions (when a user taps the notification)
      PushNotifications.addListener(
        "pushNotificationActionPerformed",
        (notification: ActionPerformed) => {
          alert(`Push action performed: ${JSON.stringify(notification)}`);
          console.log("Notification action performed:", notification);
        },
      );

      if (user && currentPath === "/") {
        const userRef = doc(db, "users", user.uid);
        getDoc(userRef).then((userDoc) => {
          if (userDoc.exists()) {
            const userData = userDoc.data();
            if (userData.role === "admin") {
              window.location.href = "/admin-dashboard";
            } else if (userData.role === "user") {
              window.location.href = "/dashboard";
            } else {
              console.log("Unknown role:", userData.role);
            }
          } else {
            console.log("User data not found");
          }
        });
      }
      if (
        currentPath.startsWith("/dashboard") ||
        currentPath.startsWith("/admin-dashboard")
      ) {
        showNav = false;
        showFooter = false;
      }
      if (!user) {
        return;
      }
      let dataToSetToStore: any;
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        const userRef = doc(db, "users", user.uid);
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
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    applyDarkMode();
  };
  const applyDarkMode = () => {
    document.body.classList.toggle("dark", darkMode);
  };
  onMount(() => {
    const storeDarkMode = localStorage.getItem("darkMode");
    if (storeDarkMode) {
      darkMode = JSON.parse(storeDarkMode);
      applyDarkMode();
    }
  });
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
