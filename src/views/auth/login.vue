<template>
  <div class="min-h-screen flex flex-col items-center justify-center font-poppins relative overflow-hidden">
    <!-- ✅ Background Image with Overlay -->
    <div class="absolute inset-0 bg-cover bg-center" :style="{ backgroundImage: `url(${backgroundImage})` }"></div>
    <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

    <!-- Logo -->
    <div class="mb-6 z-10">
      <img src="@/assets/bang.png" alt="Barangay Logo" class="w-24 h-24 mx-auto rounded-full shadow-lg" />
    </div>

    <!-- Login Card -->
    <div class="bg-white/95 w-[90%] sm:w-[400px] p-8 rounded-2xl shadow-2xl backdrop-blur-md z-10">
      <h2 class="text-2xl font-semibold text-center text-gray-800 mb-6">
        Login to Barangay Bangbang
      </h2>

      <form @submit.prevent="login" class="flex flex-col space-y-4">
        <input v-model="username" type="text" placeholder="Username"
          class="w-full px-4 py-3 rounded-full bg-gray-100 focus:bg-gray-50 focus:ring-2 focus:ring-orange-400 focus:outline-none transition" />
        <input v-model="password" type="password" placeholder="Password"
          class="w-full px-4 py-3 rounded-full bg-gray-100 focus:bg-gray-50 focus:ring-2 focus:ring-orange-400 focus:outline-none transition" />

        <button type="submit"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-full shadow-md transition">
          Login
        </button>
      </form>

      <div class="text-center mt-4 text-sm">
        <a href="#" class="text-blue-600 hover:underline" @click.prevent="showForgotPassword = true">
          Forgot password?
        </a>
      </div>

      <!-- Forgot Password Modal -->
      <transition name="fade">
        <div v-if="showForgotPassword" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div class="bg-white p-6 rounded-xl w-[90%] max-w-md">
            <h2 class="text-xl font-semibold mb-4">Reset Password</h2>
            <input v-model="resetEmail" type="email" placeholder="Enter your email"
              class="w-full px-4 py-3 rounded-full bg-gray-100 focus:bg-gray-50 focus:ring-2 focus:ring-orange-400 focus:outline-none transition mb-4" />
            <div class="flex justify-end space-x-2">
              <button @click="showForgotPassword = false" class="px-4 py-2 bg-gray-300 rounded-full">Cancel</button>
              <button @click="sendResetEmail" class="px-4 py-2 bg-blue-600 text-white rounded-full">Send</button>
            </div>
          </div>
        </div>
      </transition>

      <div class="text-center mt-2 text-sm text-gray-700">
        Don’t have an account?
        <RouterLink to="/register">
          <div class="text-blue-600 hover:underline font-medium">Register here</div>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import Swal from "sweetalert2";
import { ref } from "vue";
import { useRouter } from "vue-router";
import backgroundImage from "@/assets/image.png"; // ✅ Proper import for Vite/Vue 3

const username = ref("");
const password = ref("");
const router = useRouter();
const showForgotPassword = ref(false);
const resetEmail = ref("");

const sendResetEmail = async () => {
  if (!resetEmail.value) {
    Swal.fire("Oops!", "Please enter your email.", "warning");
    return;
  }

  try {
    const res = await axios.post("http://localhost:5000/api/users/forgot-password", {
      email: resetEmail.value,
    });

    Swal.fire({
      icon: "success",
      title: "Email Sent",
      text: res.data.message,
      timer: 2000,
      showConfirmButton: false,
    });

    showForgotPassword.value = false;
    resetEmail.value = "";
  } catch (err) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: err.response?.data?.message || "Failed to send reset email",
    });
  }
};

const login = async () => {
  if (!username.value || !password.value) {
    Swal.fire("Oops!", "Please enter both username and password.", "warning");
    return;
  }

  try {
    const res = await axios.post("http://localhost:5000/api/users/login", {
      username: username.value,
      password: password.value,
    });

    const user = res.data.user;
    const status = user.status?.toLowerCase();

    // 🚫 Block pending or rejected users
    if (status === "pending" || status === "rejected") {
      Swal.fire({
        icon: "warning",
        title: "Access Denied",
        text: `Your account is currently ${status}. Please contact the Barangay for approval.`,
      });
      return;
    }

    // ✅ Continue login for approved users
    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", username.value);
      localStorage.setItem("userType", res.data.user_type);

      if (user) {
        localStorage.setItem("fullName", user.full_name);
        localStorage.setItem("purok", user.purok);
      }

      await Swal.fire({
        icon: "success",
        title: "Login Successful!",
        showConfirmButton: false,
        timer: 1500,
      });

      const userType = res.data.user_type?.toLowerCase();
      if (userType === "admin") {
        router.push("/admin");
      } else {
        router.push("/myrequest");
      }

      setTimeout(() => window.location.reload(), 500);
    }
  } catch (err) {
    Swal.fire({
      icon: "error",
      title: "Login Failed",
      text: err.response?.data?.message || "Invalid credentials, please try again.",
    });
  }
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap");

.font-poppins {
  font-family: "Poppins", sans-serif;
}

.bg-cover {
  transition: transform 0.3s ease-in-out;
}
.bg-cover:hover {
  transform: scale(1.02);
}
</style>
