<script>
   import loginImage from "$lib/signin.png"
</script>
<div class="flex flex-col gap-8 lg:gap-8  lg:flex-row min-h-[100vh]  p-10 rounded-md items-center lg:justify-around px-14 bg-[#f5f5f5] ">
    <div class="order-2 lg:order-none border p-8 flex flex-col gap-8 rounded-md shadow-md bg-[#edf0f0] md:w-auto w-screen mt-10">
        <div class="text-xl font-bold font-sans ">Login</div>
        <form class="flex flex-col gap-3 border p-5 border-black rounded-md  bg-white">
            <label for="emailInput">Email:</label>
            <input  type="email" id="emailInput" class="border md:w-96 rounded-sm px-2 p-1"/>
            <label for="password">Password:</label>
            <input  type="email" id="password" class="border md:w-96 rounded-sm px-2 p-1"/>
            <div>
                <button class="bg-green-500 text-white hover:bg-green-300 px-5 py-2 rounded-md">Login</button>
            </div>
        </form>
        <p>Don't have an account? <a href="/register" class="text-blue-500 font-bold">Register</a></p>
    </div>
    <div class="order-1">
        <img src={loginImage} alt="login" class=" h-36 md:h-72"/>
    </div>

</div>
<style>
    /* your styles go here */
</style>

<!-- markup (zero or more items) goes here -->