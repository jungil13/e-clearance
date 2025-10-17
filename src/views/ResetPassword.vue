<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-r from-orange-300 via-pink-300 to-purple-400 font-poppins relative overflow-hidden">
    <!-- Animated Background Blobs -->
    <div class="absolute -top-20 -left-20 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
    <div class="absolute -bottom-20 -right-20 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
    <div class="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>

    <!-- Card -->
    <div class="bg-white/95 backdrop-blur-md w-[90%] sm:w-[400px] p-8 rounded-3xl shadow-2xl z-10 transform transition-all duration-500 hover:scale-105">
      <h2 class="text-3xl font-bold text-center text-gray-800 mb-6 animate-fadeIn">Reset Your Password</h2>

      <form @submit.prevent="resetPassword" class="flex flex-col space-y-4">
        <input
          v-model="password"
          type="password"
          placeholder="New Password"
          class="w-full px-5 py-3 rounded-xl bg-gray-100 focus:bg-gray-50 focus:ring-2 focus:ring-orange-400 focus:outline-none shadow-inner transition duration-300 animate-fadeIn delay-100"
        />
        <input
          v-model="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          class="w-full px-5 py-3 rounded-xl bg-gray-100 focus:bg-gray-50 focus:ring-2 focus:ring-orange-400 focus:outline-none shadow-inner transition duration-300 animate-fadeIn delay-200"
        />

        <button
          type="submit"
          class="w-full bg-gradient-to-r from-orange-400 to-pink-500 hover:from-pink-500 hover:to-orange-400 text-white font-semibold py-3 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 animate-fadeIn delay-300"
        >
          Reset Password
        </button>
      </form>

      <div class="text-center mt-4 text-sm text-gray-600 animate-fadeIn delay-400">
        Remembered your password?
        <router-link to="/login" class="text-blue-600 hover:underline font-medium">Login here</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import Swal from "sweetalert2";

const route = useRoute();
const router = useRouter();

const token = ref(""); // reset token from URL
const password = ref("");
const confirmPassword = ref("");

onMounted(() => {
  token.value = route.params.token || "";
  if (!token.value) {
    Swal.fire("Error", "Invalid or missing token", "error");
    router.push("/login");
  }
});

const resetPassword = async () => {
  if (!password.value || !confirmPassword.value) {
    Swal.fire("Oops!", "Please fill in both fields.", "warning");
    return;
  }
  if (password.value !== confirmPassword.value) {
    Swal.fire("Oops!", "Passwords do not match.", "warning");
    return;
  }

  try {
    const res = await axios.post(`http://localhost:5000/api/users/reset-password/${token.value}`, {
      password: password.value,
    });

    Swal.fire({
      icon: "success",
      title: "Password Reset Successfully",
      text: res.data.message,
      timer: 2000,
      showConfirmButton: false,
    });

    router.push("/login");
  } catch (err) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: err.response?.data?.message || "Failed to reset password",
    });
  }
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap");
.font-poppins {
  font-family: "Poppins", sans-serif;
}

/* Animations */
@keyframes blob {
  0%, 100% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
}

.animate-blob {
  animation: blob 8s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fadeIn {
  animation: fadeIn 0.8s ease forwards;
}

.delay-100 { animation-delay: 0.1s; }
.delay-200 { animation-delay: 0.2s; }
.delay-300 { animation-delay: 0.3s; }
.delay-400 { animation-delay: 0.4s; }
</style>
