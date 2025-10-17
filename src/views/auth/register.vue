<template>
  <div class="min-h-screen flex flex-col items-center justify-center font-[Poppins] relative overflow-hidden px-4">
    <!-- Background Image -->
    <div class="absolute inset-0 bg-cover bg-center" :style="{ backgroundImage: `url(${backgroundImage})` }"></div>
    <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

    <!-- Registration Card -->
    <div class="bg-white/95 w-full max-w-md p-8 rounded-2xl shadow-2xl z-10 mt-36 backdrop-blur-md">
      <h2 class="text-2xl font-semibold text-center text-gray-800 mb-6">
        Create Your Account
      </h2>

      <form @submit="handleRegister" class="flex flex-col space-y-4">
        <!-- Name Fields -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input v-model="first_name" type="text" placeholder="First Name"
            class="w-full px-4 py-3 rounded-full bg-gray-100 focus:ring-2 focus:ring-orange-400 focus:outline-none transition" />
          <input v-model="middle_name" type="text" placeholder="Middle Name"
            class="w-full px-4 py-3 rounded-full bg-gray-100 focus:ring-2 focus:ring-orange-400 focus:outline-none transition" />
          <input v-model="last_name" type="text" placeholder="Last Name"
            class="w-full px-4 py-3 rounded-full bg-gray-100 focus:ring-2 focus:ring-orange-400 focus:outline-none transition sm:col-span-2" />
        </div>

        <input v-model="age" type="number" placeholder="Age"
          class="w-full px-4 py-3 rounded-full bg-gray-100 focus:ring-2 focus:ring-orange-400 focus:outline-none transition" />

        <select v-model="gender"
          class="w-full px-4 py-3 rounded-full bg-gray-100 text-gray-700 focus:ring-2 focus:ring-orange-400 focus:outline-none transition">
          <option disabled value="">Gender</option>
          <option>Male</option>
          <option>Female</option>
          <option>Prefer not to say</option>
        </select>

        <select v-model="civil_status"
          class="w-full px-4 py-3 rounded-full bg-gray-100 text-gray-700 focus:ring-2 focus:ring-orange-400 focus:outline-none transition">
          <option disabled value="">Civil Status</option>
          <option>Single</option>
          <option>Married</option>
          <option>Widowed</option>
          <option>Separated</option>
          <option>Divorced</option>
        </select>

        <input v-model="purok" type="text" placeholder="Purok"
          class="w-full px-4 py-3 rounded-full bg-gray-100 focus:ring-2 focus:ring-orange-400 focus:outline-none transition" />

        <input v-model="address" type="text" placeholder="Address"
          class="w-full px-4 py-3 rounded-full bg-gray-100 focus:ring-2 focus:ring-orange-400 focus:outline-none transition" />

        <div class="mb-4">
          <label class="block text-sm font-semibold text-gray-700 mb-1">Email</label>
          <input v-model="email" type="email" placeholder="Enter your email address" required
            class="w-full px-4 py-3 rounded-full bg-gray-100 focus:ring-2 focus:ring-orange-400 focus:outline-none transition" />
          <p class="text-xs text-gray-500 mt-1">
            📧 Must be a <span class="font-medium text-green-700">valid email address</span> to receive status
            notifications.
          </p>
        </div>

        <!-- File Upload -->
        <div class="text-center sm:text-left">
          <label class="block text-sm font-medium text-gray-700 mb-1">Upload your VALID ID (with Barangay
            address)</label>
          <input @change="onFileChange" type="file"
            class="block w-full text-sm text-gray-600 bg-gray-100 rounded-lg border border-gray-200 cursor-pointer focus:ring-2 focus:ring-orange-400 focus:outline-none transition" />
        </div>

        <input v-model="username" type="text" placeholder="Username"
          class="w-full px-4 py-3 rounded-full bg-gray-100 focus:ring-2 focus:ring-orange-400 focus:outline-none transition" />

        <!-- Password with Eye -->
        <div class="relative">
          <input v-model="password" :type="showPassword ? 'text' : 'password'" placeholder="Password"
            class="w-full px-4 py-3 pr-12 rounded-full bg-gray-100 focus:ring-2 focus:ring-orange-400 focus:outline-none transition" />
          <button type="button" @click="showPassword = !showPassword"
            class="absolute inset-y-0 right-4 flex items-center text-gray-500 hover:text-gray-700">
            <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
          </button>
        </div>

        <!-- Confirm Password -->
        <div class="relative">
          <input v-model="confirmPassword" :type="showConfirmPassword ? 'text' : 'password'"
            placeholder="Confirm Password"
            class="w-full px-4 py-3 pr-12 rounded-full bg-gray-100 focus:ring-2 focus:ring-orange-400 focus:outline-none transition" />
          <button type="button" @click="showConfirmPassword = !showConfirmPassword"
            class="absolute inset-y-0 right-4 flex items-center text-gray-500 hover:text-gray-700">
            <i :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
          </button>
        </div>

        <button type="submit"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-full shadow-md transition">
          Register
        </button>
      </form>

      <div class="text-center mt-4 text-sm text-gray-700">
        Already have an account?
        <RouterLink to="/login" class="text-blue-600 hover:underline font-medium">Login here</RouterLink>
      </div>
    </div>
    <footer>
      <p class="text-white text-sm mt-6 z-10">&copy; 2024 Barangay Bangbang. All rights reserved.</p>
    </footer>
  </div>
</template>

<script setup>
import axios from "axios";
import Swal from "sweetalert2";
import { ref } from "vue";
import backgroundImage from "@/assets/image.png";

const first_name = ref("");
const middle_name = ref("");
const last_name = ref("");
const age = ref("");
const gender = ref("");
const civil_status = ref("");
const purok = ref("");
const address = ref("");
const email = ref("");
const username = ref("");
const password = ref("");
const confirmPassword = ref("");
const valid_id = ref(null);

const showPassword = ref(false);
const showConfirmPassword = ref(false);

const onFileChange = (e) => {
  valid_id.value = e.target.files[0];
};

const handleRegister = async (event) => {
  event.preventDefault();

  if (!first_name.value || !last_name.value || !email.value || !username.value || !password.value || !confirmPassword.value) {
    Swal.fire({
      icon: "warning",
      title: "Missing Fields",
      text: "Please fill in all required fields.",
    });
    return;
  }

  if (password.value !== confirmPassword.value) {
    Swal.fire({
      icon: "error",
      title: "Password Mismatch",
      text: "Passwords do not match. Please re-enter.",
    });
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.value)) {
    Swal.fire({
      icon: "error",
      title: "Invalid Email",
      text: "Please enter a valid email address.",
    });
    return;
  }

  const formData = new FormData();
  formData.append("first_name", first_name.value);
  formData.append("middle_name", middle_name.value);
  formData.append("last_name", last_name.value);
  formData.append("age", age.value);
  formData.append("gender", gender.value);
  formData.append("civil_status", civil_status.value);
  formData.append("purok", purok.value);
  formData.append("address", address.value);
  formData.append("email", email.value);
  formData.append("username", username.value);
  formData.append("password", password.value);
  if (valid_id.value) formData.append("valid_id", valid_id.value);

  try {
    const res = await axios.post("http://localhost:5000/api/users/register", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    await Swal.fire({
      icon: "success",
      title: "Registration Successful!",
      html: `
        <p class='text-gray-700'>Please wait at least <b>30 minutes</b> for your account to be reviewed.</p>
        <p class='text-gray-700 mt-2'>You’ll receive an email once it’s approved.</p>
      `,
      confirmButtonColor: "#2563eb",
    });

    event.target.reset();
  } catch (error) {
    console.error(error);
    Swal.fire({
      icon: "error",
      title: "Registration Failed",
      text: error.response?.data?.message || "Something went wrong.",
    });
  }
};
</script>

<style scoped>
.font-[Poppins] {
  font-family: "Poppins", sans-serif;
}
</style>
