import { auth, db } from '$lib/firebase/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { writable } from 'svelte/store';

export const authStore = writable({
  user: null,
  loading: true,
  data: {},
});

export const authHandlers = {
  signup: async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ) => {
    const { user } = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, {
      email,
      displayName: `${firstName} ${lastName}`,
      role: 'user',
    });
  },
  login: async (email: string, password: string) => {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      if (userData.role === 'admin') {
        window.location.href = '/admin-dashboard';
      } else {
        window.location.href = '/dashboard';
      }
    }
  },
  logout: async () => {
    await signOut(auth);
  },
};

async function createAdminUser() {
  const adminEmail = 'admin2@test.com';
  const adminPassword = '123.321a';

  const { user } = await createUserWithEmailAndPassword(
    auth,
    adminEmail,
    adminPassword,
  );

  const userRef = doc(db, 'users', user.uid);
  await setDoc(userRef, {
    email: adminEmail,
    displayName: 'Admin User 2',
    role: 'admin',
  });
  console.log('created');
}
// createAdminUser();
