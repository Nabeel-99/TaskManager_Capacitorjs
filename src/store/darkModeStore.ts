import { type Writable, writable } from "svelte/store";

export const darkMode: Writable<boolean> = writable(false);
