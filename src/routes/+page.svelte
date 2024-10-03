<script lang="ts">
  import heroImage from '$lib/overview.png';
  export let darkMode: boolean;
  import landingImage from '$lib/landingImage.svg';

  let projectName: string = '';
</script>

<!-- landing page -->
<div class="flex flex-col justify-center text-center items-center gap-2">
  <h1 class="md:text-[3rem] text-2xl font-bold leading-tight tracking-tight">
    Welcome to My Task Manager
  </h1>
  <p class="md:text-base md:whitespace-pre-wrap">
    Organize and prioritize your workload to maintain focus and enhance
    productivity effortlessly. Our intuitive tools offer flexibility, empowering
    you to efficiently manage tasks with ease.
  </p>
  <div class="mt-4">
    <a
      href="/login"
      class="px-5 py-3 bg-[#232529] hover:bg-[#3a3d43] text-white shadow-md rounded-md dark:bg-white dark:text-black dark:hover:bg-slate-300"
      >Get started</a
    >
  </div>
  <div class="mt-8 mb-7 flex items-center justify-center">
    <img
      src={heroImage}
      alt="hero"
      class="shadow-md border border-[#363638] rounded-2xl drop-shadow-lg object-contain md:w-[70%]"
    />
  </div>
</div>

<style>
</style>
