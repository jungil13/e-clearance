<template>
  <nav class="bg-zinc-800 text-white shadow-md">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16 items-center">
        <!-- Left: Logo + System Name -->
        <div class="flex items-center space-x-3">
          <img
            src="@/assets/bang.png"
            alt="Logo"
            class="w-10 h-10 rounded-full"
          />
          <RouterLink
            to="/"
            class="text-lg sm:text-xl font-semibold tracking-wide"
          >
            Barangay e-Clearance System
          </RouterLink>
        </div>

        <!-- Desktop Links -->
        <div class="hidden md:flex space-x-6 items-center">
          <!-- Only show when NOT logged in -->
          <template v-if="!isLoggedIn">
            <RouterLink
              to="/"
              class="hover:text-orange-100 transition-colors duration-200"
            >
              Home
            </RouterLink>
            <RouterLink
              to="/about"
              class="hover:text-orange-100 transition-colors duration-200"
            >
              About
            </RouterLink>
             <RouterLink
              to="/services"
              class="hover:text-orange-100 transition-colors duration-200"
            >
            Services
            </RouterLink>
            <RouterLink
              to="/login"
              class="bg-white text-orange-600 px-4 py-2 rounded-lg font-medium hover:bg-orange-100 transition"
            >
              Log in
            </RouterLink>
            <RouterLink
              to="/register"
              class="bg-orange-700 px-4 py-2 rounded-lg font-medium hover:bg-orange-800 transition"
            >
              Register
            </RouterLink>
          </template>

          <!-- Logged-in View -->
          <template v-else>
             <RouterLink
              to="/services"
              class="hover:text-orange-100 transition-colors duration-200"
            >
            Services
            </RouterLink>
            <RouterLink
              to="/myrequest"
              class="hover:text-orange-100 transition-colors duration-200"
            >
              My Request
            </RouterLink>

            <!-- Notification Bell -->
            <div class="relative">
              <button
                @click="toggleNotifications"
                class="relative p-2 hover:bg-zinc-700 rounded-full transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14V11a6 6 0 10-12 0v3c0 .386-.149.736-.395 1.002L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                <span
                  v-if="notifications.length"
                  class="absolute top-0 right-0 bg-red-500 text-xs rounded-full px-1.5 py-0.5"
                >
                  {{ notifications.length }}
                </span>
              </button>

              <!-- Notification Dropdown -->
              <div
                v-if="showNotifications"
                class="absolute right-0 mt-2 w-64 bg-white text-gray-800 rounded-lg shadow-lg p-3 z-50"
              >
                <h3 class="font-semibold mb-2">Notifications</h3>
                <div
                  v-if="notifications.length"
                  class="space-y-2 max-h-48 overflow-y-auto"
                >
                  <div
                    v-for="(notif, index) in notifications"
                    :key="index"
                    class="p-2 bg-gray-100 rounded-md text-sm"
                  >
                    {{ notif }}
                  </div>
                </div>
                <div v-else class="text-sm text-gray-500">No new notifications</div>
              </div>
            </div>

            <!-- User Avatar -->
            <div class="relative">
              <button
                @click="toggleDropdown"
                class="flex items-center space-x-2 bg-zinc-700 px-3 py-2 rounded-full hover:bg-zinc-600 transition"
              >
                <img
                  src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                  alt="User Avatar"
                  class="w-8 h-8 rounded-full"
                />
                <span class="hidden sm:inline">{{ username || "User" }}</span>
              </button>

              <!-- Dropdown Menu -->
              <div
                v-if="showDropdown"
                class="absolute right-0 mt-2 w-40 bg-white text-gray-800 rounded-lg shadow-lg z-50"
              >
                <RouterLink
                  to="/profile"
                  class="block px-4 py-2 hover:bg-gray-100"
                >
                  Profile
                </RouterLink>
                <button
                  @click="logout"
                  class="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            </div>
          </template>
        </div>

        <!-- Mobile Menu Button -->
        <button @click="isOpen = !isOpen" class="md:hidden focus:outline-none">
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16m-7 6h7"
            ></path>
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile Menu -->
    <div v-if="isOpen" class="md:hidden bg-orange-600">
      <div class="px-4 py-3 space-y-2">
        <template v-if="!isLoggedIn">
          <RouterLink
            to="/"
            class="block hover:text-orange-200 transition"
            @click="isOpen = false"
          >
            Home
          </RouterLink>
          <RouterLink
            to="/about"
            class="block hover:text-orange-200 transition"
            @click="isOpen = false"
          >
            About
          </RouterLink>
           <RouterLink
              to="/services"
              class="hover:text-orange-100 transition-colors duration-200"
            >
            Services
            </RouterLink>
          <RouterLink
            to="/login"
            class="block bg-white text-orange-600 px-4 py-2 rounded-lg font-medium hover:bg-orange-100 transition"
            @click="isOpen = false"
          >
            Log in
          </RouterLink>
          <RouterLink
            to="/register"
            class="block bg-orange-700 px-4 py-2 rounded-lg font-medium hover:bg-orange-800 transition"
            @click="isOpen = false"
          >
            Register
          </RouterLink>
        </template>

        <template v-else>
          <RouterLink
            to="/myrequest"
            class="block hover:text-orange-200 transition"
            @click="isOpen = false"
          >
            My Request
          </RouterLink>
          <button
            @click="logout"
            class="block w-full text-left hover:text-orange-200 transition"
          >
            Logout
          </button>
        </template>
      </div>
    </div>
  </nav>
</template>
<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { io } from "socket.io-client";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";

const router = useRouter();

// --- Reactive state ---
const isOpen = ref(false);
const isLoggedIn = ref(false);
const username = ref("");
const showDropdown = ref(false);
const showNotifications = ref(false);
const notifications = ref([]);

// --- Socket.IO ---
let socket;

onMounted(() => {
  // Connect to backend Socket.IO
  socket = io("http://localhost:5000");

  // Listen for clearance notifications
  socket.on("clearanceNotification", (data) => {
    if (data?.message) {
      notifications.value.unshift(data.message); // latest on top
    }
  });

  // Check login state
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("username");
  if (token) {
    isLoggedIn.value = true;
    username.value = user;
  }
});

// Disconnect socket when component unmounts to avoid memory leaks
onBeforeUnmount(() => {
  if (socket) {
    socket.disconnect();
  }
});

// --- UI toggle functions ---
const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
  showNotifications.value = false;
};

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value;
  showDropdown.value = false;
};

// --- Logout function ---
const logout = async () => {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "You will be logged out of your account.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#e74c3c",
    cancelButtonColor: "#6c757d",
    confirmButtonText: "Yes, log out",
  });

  if (result.isConfirmed) {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    isLoggedIn.value = false;

    await Swal.fire({
      title: "Logged Out",
      text: "You have been successfully logged out.",
      icon: "success",
      timer: 1500,
      showConfirmButton: false,
    });

    router.push("/login");

    // Optional: reload to reset global state
    setTimeout(() => {
      window.location.reload();
    }, 300);
  }
};
</script>
