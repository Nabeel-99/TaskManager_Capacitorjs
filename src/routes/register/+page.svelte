<script lang="ts">
    import signUpImage from "$lib/signup.png"
  import { authHandlers } from "../../store/store";

    let email: string = ''
    let firstName: string = ''
    let lastName: string = ''
    let password: string = ''
    let authError: boolean = false
    let authenticating: boolean = false
    let errMessage: string = 'Please fill in all fields'

const handleSignUp = async () => {
    if(authenticating){
        return;
    }
    if(!email || !firstName || !lastName || !password){
        errMessage = 'Please fill in all fields';
        authError = true;
        return;
    }
    authenticating = true;
    try {
        await authHandlers.signup(email, password, firstName, lastName);
        window.location.href = '/login'; // Navigate to login page after successful signup
    } catch (error: any) {
        if(error.code === "auth/email-already-in-use"){
            errMessage = 'Email already exists';
        }else{
            errMessage = "Invalid credentials"
        }
       
        authError = true;
        console.log(`auth error:`, error);
    } finally {
        authenticating = false; // Reset authenticating after signup attempt
    }
}
    

 </script>
 <div class="flex flex-col gap-8 lg:gap-8  lg:flex-row min-h-[100vh]  p-10 rounded-md items-center lg:justify-around px-14 bg-[#f5f5f5] dark:bg-[#2f3134] ">
     <div class="order-2 lg:order-none border p-8 flex flex-col gap-8 rounded-md shadow-md bg-[#edf0f0] md:w-auto w-screen mt-10  dark:bg-[#232529] dark:text-white dark:border-[#454648]">
         <div class="text-xl font-bold font-sans ">Login</div>
         <form class="flex flex-col gap-3 border p-5 border-black rounded-md  bg-white  dark:white dark:bg-[#2A2D32] dark:border-white">
            {#if authError}
                <p class="text-red-500">{errMessage}</p>
            {/if}
            <label for="emailInput">Email:</label>
            <input bind:value={email} type="email" id="emailInput" class="border md:w-96 rounded-sm px-2 p-1 dark:bg-[#2A2D32]" required/>
            
             <label for="firstname">First Name:</label>
             <input bind:value={firstName}  type="text" id="firstname" class="border md:w-96 rounded-sm px-2 p-1 dark:bg-[#2A2D32]" required/>
             <label for="lastname">Last Name:</label>
             <input bind:value={lastName} type="text" id="lastname" class="border md:w-96 rounded-sm px-2 p-1 dark:bg-[#2A2D32]" required/>
             <label for="password">Password:</label>
             <input bind:value={password} type="password" id="password" class="border md:w-96 rounded-sm px-2 p-1 dark:bg-[#2A2D32]" required/>
             <div>
                 <button on:click={handleSignUp} class="bg-green-500 text-white hover:bg-green-300 px-5 py-2 rounded-md">
                    {#if authenticating}
                         <i class="fa-solid fa-circle-notch spin px-5 py-2"></i>  
                        {:else}
                        Create account
                    {/if}
                  
                </button>
             </div>
         </form>
         <p>Already have an account? <a href="/login" class="text-blue-500 font-bold">Login</a></p>
     </div>
     <div class="order-1">
         <img src={signUpImage} alt="login" class=" h-36 md:h-72"/>
     </div>
 
 </div>
 <style>
     .spin{
        animation: spin 2s infinite;
     }
     @keyframes spin {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
     }
 </style>
 
 <!-- markup (zero or more items) goes here -->