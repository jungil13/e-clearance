<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 flex items-center justify-center p-4">
    <div class="bg-white w-full max-w-5xl rounded-2xl shadow-lg p-6 transition">
      <h1 class="text-2xl font-semibold text-gray-800 text-center mb-6">
        Requested Clearances
      </h1>

      <!-- Search + Filter -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-5 gap-3">
        <input v-model="search" type="text" placeholder="Search service type..."
          class="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
        <select v-model="filterStatus"
          class="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-400">
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="w-full border-collapse text-gray-800 text-sm md:text-base">
          <thead>
            <tr class="bg-gray-100 text-gray-700">
              <th class="p-3 text-left font-medium">Service type</th>
              <th class="p-3 text-left font-medium">Date pick-up</th>
              <th class="p-3 text-left font-medium">Date Requested</th>
              <th class="p-3 text-center font-medium">Status</th>
              <th class="p-3 text-center font-medium">Action</th>
            </tr>
          </thead>

          <tbody>
            <!-- Skeleton Loader -->
            <tr v-if="loading">
              <td colspan="5" class="py-6">
                <div class="animate-pulse space-y-2">
                  <div class="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                  <div class="h-4 bg-gray-200 rounded w-2/3 mx-auto"></div>
                  <div class="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                </div>
              </td>
            </tr>

            <!-- Actual Data -->
            <tr v-else v-for="(item, index) in paginatedClearances" :key="index"
              class="border-b border-gray-200 hover:bg-gray-50 transition">
              <td class="p-3 font-medium">{{ item.service }}</td>
              <td class="p-3">{{ item.pickup }}</td>
              <td class="p-3">{{ item.requested }}</td>
              <td class="p-3 text-center">
                <span class="px-3 py-1 text-sm font-semibold rounded-full" :class="{
                  'bg-red-100 text-red-600': item.status === 'Pending',
                  'bg-green-100 text-green-600': item.status === 'Completed',
                }">
                  {{ item.status }}
                </span>
              </td>
              <td class="p-3 text-center">
                <button @click="viewDetails(item)" class="text-blue-600 hover:text-blue-800 font-medium text-sm">
                  View
                </button>
              </td>
            </tr>

            <!-- Empty State -->
            <tr v-if="!loading && paginatedClearances.length === 0">
              <td colspan="5" class="text-center py-6">
                <div class="flex flex-col items-center justify-center text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 mb-2 text-gray-400" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 13h6m2 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p>No clearances found</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="!loading && filteredClearances.length > 0"
        class="flex justify-between items-center mt-6 text-sm flex-wrap gap-2">
        <p class="text-gray-600">
          Showing {{ startIndex + 1 }} - {{ endIndex }} of {{ filteredClearances.length }}
        </p>

        <div class="flex items-center gap-2">
          <button @click="prevPage" :disabled="currentPage === 1"
            class="px-3 py-1 rounded-md border text-gray-700 hover:bg-gray-100 disabled:opacity-50">
            Prev
          </button>
          <span class="text-gray-700">{{ currentPage }}</span>
          <button @click="nextPage" :disabled="endIndex >= filteredClearances.length"
            class="px-3 py-1 rounded-md border text-gray-700 hover:bg-gray-100 disabled:opacity-50">
            Next
          </button>
        </div>
      </div>

      <!-- Modal -->
      <!-- Modal -->
      <div v-if="selectedItem" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div class="bg-white rounded-xl shadow-xl p-6 w-full max-w-md animate-fadeIn">
          <h2 class="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
            Clearance Details
          </h2>
          <div class="space-y-2 text-gray-700">
            <p><span class="font-medium">Service:</span> {{ selectedItem.type }}</p>
            <p><span class="font-medium">Pickup Date:</span> {{ formatDate(selectedItem.pickup_date) }}</p>
            <p><span class="font-medium">Date Requested:</span> {{ formatDate(selectedItem.requested_at) }}</p>
            <p><span class="font-medium">Status:</span>
              <span :class="{
                'text-red-600': selectedItem.status === 'Pending',
                'text-yellow-600': selectedItem.status === 'Processing',
                'text-blue-600': selectedItem.status === 'For Pickup',
                'text-green-600': selectedItem.status === 'Released'
              }">
                {{ selectedItem.status }}
              </span>
            </p>

            <!-- Conditional fields based on type -->
            <template v-if="selectedItem.type === 'Business'">
              <p><span class="font-medium">Business Name:</span> {{ selectedItem.business_name }}</p>
              <p><span class="font-medium">Owner:</span> {{ selectedItem.business_owner }}</p>
              <p><span class="font-medium">Nature:</span> {{ selectedItem.business_nature }}</p>
            </template>

            <template v-else-if="selectedItem.type === 'Barangay' || selectedItem.type === 'Sanitary'">
              <p><span class="font-medium">Full Name:</span> {{ selectedItem.full_name }}</p>
              <p><span class="font-medium">Purpose:</span> {{ selectedItem.purpose }}</p>
            </template>
          </div>

          <div class="text-right mt-6">
            <button @click="selectedItem = null"
              class="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition">
              Close
            </button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import Swal from "sweetalert2";

const clearances = ref([]);
const search = ref("");
const filterStatus = ref("");
const currentPage = ref(1);
const itemsPerPage = 3;
const selectedItem = ref(null);
const loading = ref(true);

// Helper to format ISO date strings to readable format
const formatDate = (isoDate) => {
  if (!isoDate) return "";
  const date = new Date(isoDate);
  return date.toLocaleDateString("en-GB"); // DD/MM/YYYY
};

// Fetch clearances for logged-in user
const fetchClearances = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    Swal.fire("Error", "You must be logged in to view clearances", "error");
    loading.value = false;
    return;
  }

  try {
    const response = await axios.get("http://localhost:5000/api/clearances/my-clearances", {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Map backend response to table-friendly format
    clearances.value = response.data.map((c) => ({
      service: c.type,                   // "Business", "Barangay", "Sanitary"
      pickup: formatDate(c.pickup_date), // Target pick-up date
      requested: formatDate(c.requested_at), // Requested date
      status: c.status,                  // Pending / Processing / For Pickup / Released
      details: c,                        // store full data for modal view
    }));
  } catch (error) {
    console.error(error);
    Swal.fire(
      "Error",
      error.response?.data?.message || "Failed to fetch clearances",
      "error"
    );
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchClearances();
});

// Filtering & pagination
const filteredClearances = computed(() => {
  return clearances.value.filter((c) => {
    const matchesSearch = c.service.toLowerCase().includes(search.value.toLowerCase());
    const matchesStatus = filterStatus.value ? c.status === filterStatus.value : true;
    return matchesSearch && matchesStatus;
  });
});

const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage);
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage, filteredClearances.value.length));

const paginatedClearances = computed(() =>
  filteredClearances.value.slice(startIndex.value, endIndex.value)
);

function nextPage() {
  if (endIndex.value < filteredClearances.value.length) currentPage.value++;
}

function prevPage() {
  if (currentPage.value > 1) currentPage.value--;
}

function viewDetails(item) {
  selectedItem.value = item.details; // show full data in modal
}
</script>


<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease;
}
</style>
