<template>
  <div class="flex min-h-screen bg-gray-100 font-inter relative">
    <!-- Mobile Overlay -->
    <div v-if="isSidebarOpen" class="fixed inset-0 bg-black/40 z-10 md:hidden" @click="toggleSidebar"></div>

    <!-- SIDEBAR -->
    <aside :class="[ 
        'bg-white fixed top-0 left-0 h-full flex flex-col border-r border-gray-200 z-30 shadow-lg transition-transform duration-300 ease-in-out w-64',
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
        'md:translate-x-0'
      ]">
      <!-- Logo / Title -->
      <div class="p-5 border-b border-gray-200 flex items-center gap-1">
        <img :src="bangLogo" alt="Logo" class="w-12 h-12 rounded-full" /><span>
          Admin Panel
        </span>
        <button class="md:hidden p-1 rounded-lg hover:bg-gray-100 transition" @click="toggleSidebar">
          <XMarkIcon class="w-6 h-6 text-gray-600" />
        </button>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 overflow-y-auto p-3 space-y-1">
        <RouterLink v-for="link in links" :key="link.route" :to="`/admin${link.route}`"
          class="flex items-center gap-3 p-3 rounded-lg text-gray-600 transition-all duration-150 hover:bg-blue-50 hover:text-blue-700 font-medium"
          :class="{
            'bg-blue-600 text-white shadow-md hover:bg-blue-700':
              $route.path === `/admin${link.route}` ||
              ($route.path.startsWith(`/admin${link.route}/`) && link.route !== '')
          }" @click="isSidebarOpen = false">
          <component :is="link.iconComponent" class="w-6 h-6 shrink-0" />
          <span>{{ link.title }}</span>
        </RouterLink>
      </nav>

      <!-- Footer -->
      <div class="p-4 text-xs text-gray-400 border-t text-center">
        © 2025 Admin Dashboard
      </div>
    </aside>

    <!-- MAIN SECTION -->
    <div class="flex-1 flex flex-col w-full md:ml-64">
      <!-- HEADER -->
      <header
        class="fixed top-0 left-0 md:left-64 right-0 bg-white shadow-sm border-b border-gray-200 h-16 flex justify-between items-center px-4 md:px-8 z-20">
        <div class="flex items-center gap-3">
          <button class="md:hidden p-2 text-gray-600 hover:text-blue-600 rounded-lg transition" @click="toggleSidebar">
            <Bars3Icon class="w-6 h-6" />
          </button>
          <img :src="bangLogo" alt="Logo" class="w-10 h-10 rounded-full" />
          <h1 class="text-lg md:text-xl font-semibold text-gray-800">Dashboard</h1>
        </div>

        <div class="flex items-center gap-4">
          <div class="relative">
            <!-- Notification Bell -->
            <button class="p-2 text-gray-500 hover:text-blue-600 rounded-full transition relative"
              @click="toggleNotifications">
              <BellIcon class="w-6 h-6" />
              <span v-if="notifications.length"
                class="absolute top-0 right-0 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                {{ notifications.length }}
              </span>
            </button>

            <!-- Notification Dropdown -->
            <div v-if="showNotifications"
              class="absolute right-0 mt-3 w-80 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden z-50 animate-fadeIn">
              <div class="p-3 font-semibold text-gray-700 border-b">Notifications</div>
              <ul class="max-h-60 overflow-y-auto">
                <li v-for="(notif, i) in notifications" :key="i"
                  class="p-3 hover:bg-gray-50 text-sm text-gray-600 flex justify-between items-center">
                  <span>{{ notif }}</span>
                  <button class="text-blue-500 hover:text-blue-700 text-xs" @click="removeNotification(i)">
                    Dismiss
                  </button>
                </li>
              </ul>
              <div v-if="!notifications.length" class="p-4 text-sm text-gray-400 text-center">
                No new notifications
              </div>
            </div>
          </div>

          <!-- Profile & Logout -->
          <div class="flex items-center gap-3">
            <div class="hidden sm:block text-gray-700 font-medium">Admin</div>
            <img src="https://i.pravatar.cc/40?img=1" alt="Avatar"
              class="w-10 h-10 rounded-full border-2 border-blue-500 object-cover" />
            <button class="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded-full transition"
              @click="logout">
              Logout
            </button>
          </div>
        </div>
      </header>
      <main class="flex-1 pt-20 px-4 md:px-8 pb-8 bg-gradient-to-br from-orange-100 via-orange-300 to-teal-500">
        <RouterView />
      </main>

      <!-- FOOTER -->
      <footer class="p-4 text-center text-xs text-gray-500 border-t bg-white shadow-inner">
        Data Management System v1.0
      </footer>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
import { io } from "socket.io-client";
import {
  HomeIcon,
  UsersIcon,
  UserPlusIcon,
  DocumentTextIcon,
  BellIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/vue/24/solid";

import bangLogo from '@/assets/bang.png'; // Logo

// -------------------- State --------------------
const router = useRouter();
const isSidebarOpen = ref(false);
const showNotifications = ref(false);
const notifications = ref([]); 
let socket;

// -------------------- Sidebar Links --------------------
const links = [
  { title: "Dashboard", iconComponent: HomeIcon, route: "" },
  { title: "Total Population", iconComponent: UsersIcon, route: "/data/population" },
  { title: "Registered Residence", iconComponent: UserPlusIcon, route: "/data/residence" },
  { title: "Barangay Officials & Staff", iconComponent: UsersIcon, route: "/directory/officials" },
  { title: "Barangay Clearance", iconComponent: DocumentTextIcon, route: "/permits/clearance" },
  { title: "Sanitary Permit", iconComponent: DocumentTextIcon, route: "/permits/sanitary" },
  { title: "Business Permit", iconComponent: DocumentTextIcon, route: "/permits/business" },
  { title: "Requested Document", iconComponent: DocumentTextIcon, route: "/requests/documents" },
];

// -------------------- Functions --------------------
const toggleSidebar = () => (isSidebarOpen.value = !isSidebarOpen.value);
const toggleNotifications = () => (showNotifications.value = !showNotifications.value);
const removeNotification = (i) => notifications.value.splice(i, 1);
const clearNotifications = () => notifications.value = [];

const logout = async () => {
  const result = await Swal.fire({
    title: "Logout",
    text: "Are you sure you want to logout?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, Logout",
    cancelButtonText: "Cancel",
  });

  if (result.isConfirmed) {
    localStorage.clear();
    Swal.fire("Logged out!", "You have been logged out.", "success");
    router.push("/login");
    window.location.reload(); 
  }
};

// -------------------- Socket.IO --------------------
onMounted(() => {
  socket = io("http://localhost:5000");

  socket.on("connect", () => console.log("🔌 Connected to Socket.IO server"));

  socket.on("newUser", (data) => addNotification(data.message));
  socket.on("newClearance", (data) => addNotification(data.message));

  socket.on("disconnect", () => console.log("❌ Disconnected from Socket.IO server"));
});

onBeforeUnmount(() => {
  if (socket) socket.disconnect();
});

// -------------------- Helpers --------------------
const addNotification = (message) => {
  notifications.value.unshift(message);

  // Remove after 30 seconds automatically
  setTimeout(() => {
    const index = notifications.value.indexOf(message);
    if (index > -1) notifications.value.splice(index, 1);
  }, 30000);
};
</script>
