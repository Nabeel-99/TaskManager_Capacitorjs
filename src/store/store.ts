import { auth, db } from "$lib/firebase/firebase"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"
import {writable} from "svelte/store"


export const authStore = writable({
    user: null,
    loading: true,
    data: {}
})

export const authHandlers = {
    signup: async (email: string, password: string, firstName: string, lastName: string) => {
       const { user } = await createUserWithEmailAndPassword(auth, email, password)
       const userRef = doc(db, 'users', user.uid);
       await setDoc(userRef, {
        email,
        displayName: `${firstName} ${lastName}`
       })
    },
    login: async (email: string, password: string) => {
        await signInWithEmailAndPassword(auth, email, password)
    },
    logout: async () => {
        await signOut(auth)
    }
    

}