<template>
  <div id="app" class="min-h-screen p-4 sm:p-6 md:p-10">
    <div class="flex flex-col lg:flex-row gap-6">

      <!-- Left Section: Data Table -->
      <div
        class="bg-white p-4 sm:p-6 shadow-2xl rounded-2xl w-full flex flex-col overflow-hidden border border-gray-100">

        <!-- Header & Controls -->
        <div
          class="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 mb-4 border-b border-gray-100">
          <h2 class="font-extrabold text-gray-800 tracking-tight text-2xl sm:text-3xl mb-3 sm:mb-0">
            Business Permits
            <span class="text-orange-500 text-lg ml-2 font-mono">({{ totalItems }})</span>
          </h2>
          <div class="flex items-center gap-3 w-full sm:w-auto">
            <div class="relative flex-grow w-full sm:w-64">
              <!-- Search Icon -->
              <svg class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
                xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2"
                viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input v-model="searchQuery" @input="currentPage = 1" type="text"
                placeholder="Search business or owner..."
                class="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full text-sm transition focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-inner" />
            </div>
          </div>
        </div>

        <!-- Table -->
        <div class="flex-grow overflow-x-auto min-h-[300px]">
          <table class="w-full text-sm border-collapse">
            <thead class="bg-gray-50 border-b border-gray-200 sticky top-0">
              <tr>
                <th class="p-3 text-left w-12 text-gray-600 font-semibold">#</th>
                <th class="p-3 text-left text-gray-600 font-semibold">Name of Business</th>
                <th class="p-3 text-left text-gray-600 font-semibold hidden md:table-cell">Business Owner</th>
                <th class="p-3 text-left text-gray-600 font-semibold hidden sm:table-cell">Nature</th>
                <th class="p-3 text-left text-gray-600 font-semibold hidden lg:table-cell">Date Applied</th>
                <th class="p-3 text-center text-gray-600 font-semibold w-24">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(biz, index) in paginatedBusinesses" :key="biz.id"
                class="border-b border-gray-100 hover:bg-orange-50/50 transition duration-150">
                <td class="p-3 text-gray-500 font-mono">
                  {{ (currentPage - 1) * itemsPerPage + index + 1 }}
                </td>
                <td class="p-3 font-medium text-gray-800">{{ biz.name }}</td>
                <td class="p-3 text-gray-600 hidden md:table-cell">{{ biz.owner }}</td>
                <td class="p-3 text-gray-600 hidden sm:table-cell">
                  <span :class="natureClass(biz.nature)" class="px-3 py-1 text-xs font-medium rounded-full">
                    {{ biz.nature }}
                  </span>
                </td>
                <td class="p-3 text-gray-500 text-sm hidden lg:table-cell">{{ formatDate(biz.date) }}</td>
                <td class="p-3 text-center">
                  <button @click="goToPrint(biz)"
                    class="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded-full text-xs font-bold transition shadow-md shadow-orange-400/50 transform active:scale-95">
                    Generate
                  </button>
                </td>
              </tr>
              <tr v-if="!paginatedBusinesses.length">
                <td colspan="6" class="p-8 text-center text-lg text-gray-400">
                  No business records found. Try adjusting your search.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination Controls -->
        <div v-if="totalPages > 1"
          class="flex flex-col sm:flex-row justify-between items-center bg-white p-4 pt-6 border-t border-gray-100 mt-4">
          <div class="text-sm text-gray-600 mb-4 sm:mb-0">
            Showing
            <span class="font-bold text-gray-800 mx-1">{{ Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)
              }}</span>
            to
            <span class="font-bold text-gray-800 mx-1">{{ Math.min(currentPage * itemsPerPage, totalItems) }}</span>
            of
            <span class="font-bold text-gray-800 mx-1">{{ totalItems }}</span> results
          </div>
          <div class="flex items-center gap-2">
            <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1"
              class="p-2 border border-gray-300 rounded-full disabled:opacity-50 hover:bg-gray-100 transition">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor"
                stroke-width="2" viewBox="0 0 24 24">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <div class="flex gap-1">
              <button v-for="page in totalPages" :key="page" @click="goToPage(page)" :class="[
                'w-8 h-8 rounded-full text-sm font-bold transition-all duration-200 transform hover:scale-105',
                page === currentPage
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-400/50'
                  : 'text-gray-700 hover:bg-gray-200',
              ]">
                {{ page }}
              </button>
            </div>
            <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages"
              class="p-2 border border-gray-300 rounded-full disabled:opacity-50 hover:bg-gray-100 transition">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor"
                stroke-width="2" viewBox="0 0 24 24">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Right Form -->
      <div
        class="bg-white shadow-2xl rounded-2xl w-full lg:w-1/3 p-6 space-y-5 h-fit border border-gray-100 sticky top-6">
        <h3 class="font-extrabold text-orange-700 text-xl border-b pb-3 flex items-center space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2"
            viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="16" />
            <line x1="8" y1="12" x2="16" y2="12" />
          </svg>
          <span>Add New Permit</span>
        </h3>

        <div class="space-y-4">
          <div>
            <label class="text-sm font-semibold text-gray-700 block mb-1">Name of Business</label>
            <input v-model="newBusiness.name"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm transition focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm"
              placeholder="e.g., Jane's Retail Shop" />
          </div>
          <div>
            <label class="text-sm font-semibold text-gray-700 block mb-1">Business Owner</label>
            <input v-model="newBusiness.owner"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm transition focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm"
              placeholder="e.g., Jane Doe" />
          </div>
          <div>
            <label class="text-sm font-semibold text-gray-700 block mb-1">Nature</label>
            <input v-model="newBusiness.nature"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm transition focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm"
              placeholder="e.g., General Retail, Food Service" />
          </div>
          <div>
            <label class="text-sm font-semibold text-gray-700 block mb-1">Date Applied</label>
            <input v-model="newBusiness.date" type="date"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm transition focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm" />
          </div>
        </div>

        <div class="flex justify-end pt-4 border-t border-gray-100">
          <button @click="addBusiness"
            class="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full text-md font-bold transition shadow-lg shadow-orange-400/50 flex items-center space-x-2 transform active:scale-95">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2"
              viewBox="0 0 24 24">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
              <polyline points="17 21 17 13 7 13 7 21" />
              <polyline points="7 3 7 8 15 8" />
            </svg>
            <span>Add Record</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Print Data Modal -->
    <div v-if="printData"
      class="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 z-50 transition-opacity duration-300">
      <div
        class="bg-white rounded-xl shadow-2xl p-8 max-w-lg w-full transform transition-transform duration-300 scale-100 border-t-8 border-blue-500">
        <h3 class="text-2xl font-bold text-blue-700 mb-4 border-b pb-2">Generate Permit View Mock</h3>
        <p class="text-gray-600 mb-6">
          Permit ID: <span class="text-xs font-mono bg-gray-100 px-2 py-1 rounded">{{ printData.id }}</span>
        </p>
        <div class="space-y-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p><strong>Business Name:</strong> <span class="font-medium text-gray-800">{{ printData.name }}</span></p>
          <p><strong>Owner:</strong> <span class="text-gray-700">{{ printData.owner }}</span></p>
          <p><strong>Nature:</strong> <span class="text-gray-700">{{ printData.nature }}</span></p>
          <p><strong>Date Applied:</strong> <span class="text-gray-700">{{ formatDate(printData.date) }}</span></p>
        </div>
        <div class="mt-6 flex justify-end">
          <button @click="printData = null"
            class="bg-gray-300 hover:bg-gray-400 text-gray-800 px-5 py-2 rounded-full font-medium transition transform active:scale-95">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const router = useRouter();
const token = localStorage.getItem("token");

// State
const businesses = ref([]);
const newBusiness = ref({ name: "", owner: "", nature: "", date: "" });
const searchQuery = ref("");
const currentPage = ref(1);
const itemsPerPage = ref(5);

// Axios config
const axiosConfig = {
  headers: { Authorization: `Bearer ${token}` },
};

// Fetch Businesses
const fetchBusinesses = async () => {
  try {
    const res = await axios.get(
      "http://localhost:5000/api/clearances/type/Business",
      axiosConfig
    );
    businesses.value = res.data.map((c) => ({
      name: c.business_name,
      owner: c.business_owner,
      nature: c.business_nature,
      date: c.pickup_date,
      id: c.id,
    }));
  } catch (error) {
    console.error("Failed to fetch businesses:", error);
  }
};

onMounted(fetchBusinesses);

// Add Business
const addBusiness = async () => {
  if (!newBusiness.value.name || !newBusiness.value.owner) return;

  const payload = {
    type: "Business",
    business_name: newBusiness.value.name,
    business_owner: newBusiness.value.owner,
    business_nature: newBusiness.value.nature,
    pickup_date: newBusiness.value.date,
  };

  try {
    const res = await axios.post(
      "http://localhost:5000/api/clearances/request",
      payload,
      axiosConfig
    );

    businesses.value.unshift({
      name: payload.business_name,
      owner: payload.business_owner,
      nature: payload.business_nature,
      date: payload.pickup_date,
      id: res.data.id,
    });

    newBusiness.value = { name: "", owner: "", nature: "", date: "" };
    currentPage.value = 1;
  } catch (error) {
    console.error("Failed to add business clearance:", error);
  }
};

// Filter & Pagination
const filteredBusinesses = computed(() => {
  const q = searchQuery.value.toLowerCase();
  return businesses.value.filter(
    (b) =>
      b.name.toLowerCase().includes(q) ||
      b.owner.toLowerCase().includes(q) ||
      b.nature.toLowerCase().includes(q)
  );
});

const totalItems = computed(() => filteredBusinesses.value.length);
const totalPages = computed(() =>
  Math.ceil(totalItems.value / itemsPerPage.value)
);
const paginatedBusinesses = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  return filteredBusinesses.value.slice(start, start + itemsPerPage.value);
});

// Navigation
const goToPrint = (biz) => {
  router.push({
    name: "BarangayBusinessPrint",
    query: { data: JSON.stringify(biz) },
  });
};

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) currentPage.value = page;
};

// ✅ Add this function in the same script
const natureClass = (nature) => {
  if (nature.includes("Retail")) return "bg-green-100 text-green-700";
  if (nature.includes("Food")) return "bg-blue-100 text-blue-700";
  if (nature.includes("Service")) return "bg-purple-100 text-purple-700";
  return "bg-gray-100 text-gray-700";
};

// Format date helper
const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
};
</script>
