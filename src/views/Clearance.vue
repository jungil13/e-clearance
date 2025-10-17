<template>
  <div
    class="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200 flex items-center justify-center py-10 px-6 font-[Poppins]">
    <div
      class="bg-white rounded-3xl shadow-2xl w-full max-w-6xl grid lg:grid-cols-3 overflow-hidden border border-slate-200 transition-all duration-300">
      <!-- LEFT SIDE -->
      <div
        class="lg:col-span-1 flex flex-col items-center justify-center bg-gradient-to-b from-indigo-900 to-indigo-700 text-white p-10 space-y-6">
        <div class="flex flex-col items-center">
          <img src="@/assets/bang.png" alt="Barangay Logo"
            class="w-28 h-28 rounded-full object-cover border-4 border-indigo-400 shadow-lg mb-3" />
          <h2 class="text-3xl font-extrabold text-center leading-tight">
            Barangay Bangbang
          </h2>
          <p class="text-indigo-200 text-sm tracking-wide">Cordova, Cebu</p>
        </div>

        <div
          class="bg-white/10 backdrop-blur-md rounded-2xl px-8 py-6 w-full max-w-[240px] text-center border border-indigo-400/30 shadow-inner">
          <p class="text-sm text-indigo-200 uppercase tracking-wide">Processing Fee</p>
          <p class="text-4xl font-bold text-white mt-1 drop-shadow-md">₱100.00</p>
        </div>
      </div>

      <!-- RIGHT SIDE -->
      <div class="lg:col-span-2 p-10 md:p-14 bg-gradient-to-br from-white via-slate-50 to-slate-100">
        <header class="border-b border-slate-200 pb-4 mb-8">
          <h1 class="text-3xl font-bold text-slate-800">Barangay Clearance Request</h1>
          <p class="text-slate-500 mt-1 text-sm">Fill out the form below to request your clearance document.</p>
        </header>

        <form class="space-y-6" @submit="handleSubmit">
          <!-- Full Name -->
          <div>
            <label for="name" class="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
            <input type="text" id="name" v-model="fullName" readonly
              class="w-full px-4 py-3 rounded-xl border border-slate-300 shadow-sm bg-slate-100 cursor-not-allowed focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 outline-none transition"
              required />
          </div>


          <!-- Pickup Date -->
          <div>
            <label for="pickupDate" class="block text-sm font-medium text-slate-700 mb-2">Target Pick-up Date</label>
            <input type="date" id="pickupDate" v-model="pickupDate"
              class="w-full px-4 py-3 rounded-xl border border-slate-300 shadow-sm focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 outline-none transition appearance-none"
              required />
          </div>

          <!-- Purpose -->
          <div>
            <label for="purpose" class="block text-sm font-medium text-slate-700 mb-2">Purpose</label>
            <textarea id="purpose" v-model="purpose" rows="4" placeholder="State the purpose"
              class="w-full px-4 py-3 rounded-xl border border-slate-300 shadow-sm resize-none focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 outline-none transition"
              required></textarea>
          </div>

          <!-- Submit Button -->
          <div class="pt-2 text-right">
            <button type="submit"
              class="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-[2px]">
              Submit Request
            </button>
          </div>
        </form>


        <div class="mt-8">
          <a href="#" class="text-indigo-600 hover:text-indigo-800 text-sm font-medium transition">
            ← Back to Services
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import Swal from "sweetalert2";

const fullName = ref("");
const pickupDate = ref("");
const purpose = ref("");

// Fetch logged-in user info
onMounted(() => {
  const storedFullName = localStorage.getItem("fullName") || "";
  fullName.value = storedFullName;
});

const handleSubmit = async (e) => {
  e.preventDefault();

  const token = localStorage.getItem("token");
  if (!token) {
    Swal.fire("Error", "You must be logged in to request a clearance", "error");
    return;
  }

  try {
    await axios.post(
      "http://localhost:5000/api/clearances/request",
      {
        type: "Barangay",
        full_name: fullName.value,
        pickup_date: pickupDate.value,
        purpose: purpose.value,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    Swal.fire("Success", "Your clearance request has been submitted!", "success");

    // Reset fields except fullname
    pickupDate.value = "";
    purpose.value = "";
  } catch (error) {
    console.error(error);
    Swal.fire(
      "Error",
      error.response?.data?.message || "Failed to submit request",
      "error"
    );
  }
};
</script>


<style scoped>
input[type="date"]::-webkit-calendar-picker-indicator {
  filter: invert(0.5) sepia(1) saturate(2) hue-rotate(200deg);
  cursor: pointer;
}
</style>
